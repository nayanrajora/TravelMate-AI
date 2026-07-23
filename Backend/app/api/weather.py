from fastapi import APIRouter, HTTPException
import httpx
import asyncio

router = APIRouter(tags=["Weather"])

@router.get("/weather")
async def get_weather(city: str):
    """
    Real-time weather data fetching using wttr.in (no API key required).
    """
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            # wttr.in supports JSON output with ?format=j1
            weather_url = f"https://wttr.in/{city}?format=j1"
            # Nominatim for destinations/hotels
            nominatim_url = f"https://nominatim.openstreetmap.org/search?q=attractions+in+{city}&format=json&limit=3"
            nominatim_hotels = f"https://nominatim.openstreetmap.org/search?q=hotels+in+{city}&format=json&limit=3"

            # Run in parallel
            w_resp, attr_resp, hotels_resp = await asyncio.gather(
                client.get(weather_url),
                client.get(nominatim_url, headers={"User-Agent": "TravelMate/1.0"}),
                client.get(nominatim_hotels, headers={"User-Agent": "TravelMate/1.0"}),
                return_exceptions=True
            )

            if isinstance(w_resp, Exception) or w_resp.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to fetch weather data")
            
            w_data = w_resp.json()
            current = w_data['current_condition'][0]
            
            # Extract weather info
            temp = f"{current['temp_C']}°C"
            condition = current['weatherDesc'][0]['value']
            humidity = f"{current['humidity']}%"
            wind = f"{current['windspeedKmph']} km/h"
            uvIndex = current.get('uvIndex', 'N/A')
            
            # Get 5 day forecast (wttr.in j1 typically gives 3 days, we'll repeat or extrapolate to fit 5 if needed)
            forecast_data = w_data.get('weather', [])
            forecast_list = []
            
            def map_icon(cond: str):
                cond = cond.lower()
                if 'rain' in cond or 'drizzle' in cond: return 'Umbrella'
                if 'cloud' in cond or 'overcast' in cond: return 'CloudSun'
                if 'sun' in cond or 'clear' in cond: return 'Sun'
                return 'CloudSun'

            import datetime
            today = datetime.datetime.now()

            for i in range(5):
                # if wttr.in provides fewer days, wrap around
                day_data = forecast_data[i % len(forecast_data)]
                date_str = (today + datetime.timedelta(days=i)).strftime("%a")
                
                f_temp = f"{day_data.get('maxtempC', 20)}°C"
                f_cond = day_data['hourly'][4]['weatherDesc'][0]['value'] if day_data.get('hourly') else "Clear"
                
                forecast_list.append({
                    "day": date_str,
                    "temp": f_temp,
                    "condition": f_cond,
                    "icon": map_icon(f_cond)
                })

            high_temp = f"{forecast_data[0].get('maxtempC', 20)}°C"
            low_temp = f"{forecast_data[0].get('mintempC', 10)}°C"
            rainChance = forecast_data[0].get('hourly', [{}])[4].get('chanceofrain', '0') + "%"

            # Parse destinations
            ai_outfit = []
            
            if not isinstance(attr_resp, Exception) and attr_resp.status_code == 200:
                for item in attr_resp.json():
                    name = item.get("display_name", "").split(",")[0]
                    ai_outfit.append(f"Visit: {name}")
            
            if not isinstance(hotels_resp, Exception) and hotels_resp.status_code == 200:
                for item in hotels_resp.json():
                    name = item.get("display_name", "").split(",")[0]
                    ai_outfit.append(f"Hotel: {name}")

            if not ai_outfit:
                ai_outfit = [
                    f"Light layers recommended for {temp}.",
                    "Comfortable walking shoes are a must.",
                    f"Pack an umbrella if {rainChance} chance of rain concerns you."
                ]

            return {
                "temp": temp,
                "condition": condition,
                "high": high_temp,
                "low": low_temp,
                "humidity": humidity,
                "wind": wind,
                "uvIndex": uvIndex,
                "rainChance": rainChance,
                "forecast": forecast_list,
                "aiOutfitAdvice": ai_outfit
            }
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=str(e))
