export interface WeatherForecast {
  summary: string;
  tempMax: number;
  tempMin: number;
  code: number;
}

export async function fetchWeatherForecast(lat: number, lon: number): Promise<WeatherForecast> {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`);
    if (!res.ok) {
      throw new Error("Weather API Error");
    }
    const data = await res.json();
    
    // Grab the first day's forecast
    const maxTemp = data.daily.temperature_2m_max[0];
    const minTemp = data.daily.temperature_2m_min[0];
    const weatherCode = data.daily.weather_code[0];

    // Basic WMO Code mapping
    let summary = "Pleasant";
    if (weatherCode === 0) summary = "Clear Skies";
    else if (weatherCode >= 1 && weatherCode <= 3) summary = "Partly Cloudy";
    else if (weatherCode >= 51 && weatherCode <= 67) summary = "Rain";
    else if (weatherCode >= 71 && weatherCode <= 77) summary = "Snow";
    else if (weatherCode >= 95) summary = "Thunderstorms";

    return {
      summary,
      tempMax: maxTemp,
      tempMin: minTemp,
      code: weatherCode
    };
  } catch (error) {
    console.warn("Failed to fetch Open-Meteo weather, using neutral fallback", error);
    return {
      summary: "Pleasant",
      tempMax: 25,
      tempMin: 18,
      code: 0
    };
  }
}
