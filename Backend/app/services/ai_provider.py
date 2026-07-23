import json
import logging
import httpx
from datetime import date
from typing import Dict, Any, List
from app.core.config import settings
from app.prompts.templates import ITINERARY_SYSTEM_PROMPT, ITINERARY_USER_PROMPT_TEMPLATE
from app.services.ai_service import MockTravelPlannerService

logger = logging.getLogger(__name__)

class AIProviderService:
    """
    Modular AI service provider for TravelMate AI.
    Routes queries to OpenAI, Gemini, or falls back to local Mock generator.
    """
    
    @staticmethod
    async def generate_itinerary(
        destination: str,
        start_date: date,
        end_date: date,
        budget_level: str,
        traveler_type: str,
        interests: List[str],
        weather_forecast: str = "Unknown weather"
    ) -> Dict[str, Any]:
        
        # Calculate duration in days
        delta = end_date - start_date
        days = max(1, delta.days + 1)
        
        provider = settings.AI_PROVIDER.lower()
        
        # 1. Fallback immediately if provider is configured as mock
        if provider == "mock":
            logger.info("Using mock travel planner service.")
            return MockTravelPlannerService.generate_itinerary(
                destination, start_date, end_date, budget_level, traveler_type, interests
            )
            
        # Format prompts
        user_prompt = ITINERARY_USER_PROMPT_TEMPLATE.format(
            destination=destination,
            days=days,
            start_date=start_date,
            end_date=end_date,
            budget_level=budget_level,
            traveler_type=traveler_type,
            interests=", ".join(interests),
            weather_forecast=weather_forecast
        )
        
        # 2. OpenAI provider
        if provider == "openai":
            if not settings.OPENAI_API_KEY:
                logger.warning("OpenAI API Key is missing. Falling back to Mock generator.")
                return MockTravelPlannerService.generate_itinerary(
                    destination, start_date, end_date, budget_level, traveler_type, interests
                )
                
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": "gpt-4o-mini",
                            "messages": [
                                {"role": "system", "content": ITINERARY_SYSTEM_PROMPT},
                                {"role": "user", "content": user_prompt}
                            ],
                            "response_format": {"type": "json_object"}
                        }
                    )
                    
                    if response.status_code != 200:
                        logger.error(f"OpenAI API error: {response.text}. Falling back to Mock.")
                        return MockTravelPlannerService.generate_itinerary(
                            destination, start_date, end_date, budget_level, traveler_type, interests
                        )
                        
                    result = response.json()
                    json_text = result["choices"][0]["message"]["content"]
                    return json.loads(json_text)
                    
            except Exception as e:
                logger.error(f"Failed to generate itinerary via OpenAI: {str(e)}. Falling back to Mock.")
                return MockTravelPlannerService.generate_itinerary(
                    destination, start_date, end_date, budget_level, traveler_type, interests
                )
                
        # 3. Gemini provider
        elif provider == "gemini":
            if not settings.GEMINI_API_KEY:
                logger.warning("Gemini API Key is missing. Falling back to Mock generator.")
                return MockTravelPlannerService.generate_itinerary(
                    destination, start_date, end_date, budget_level, traveler_type, interests
                )
                
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
                
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        url,
                        headers={"Content-Type": "application/json"},
                        json={
                            "contents": [
                                {"parts": [{"text": user_prompt}]}
                            ],
                            "systemInstruction": {
                                "parts": [{"text": ITINERARY_SYSTEM_PROMPT}]
                            },
                            "generationConfig": {
                                "responseMimeType": "application/json"
                            }
                        }
                    )
                    
                    if response.status_code != 200:
                        logger.error(f"Gemini API error: {response.text}. Falling back to Mock.")
                        return MockTravelPlannerService.generate_itinerary(
                            destination, start_date, end_date, budget_level, traveler_type, interests
                        )
                        
                    result = response.json()
                    json_text = result["candidates"][0]["content"]["parts"][0]["text"]
                    return json.loads(json_text)
                    
            except Exception as e:
                logger.error(f"Failed to generate itinerary via Gemini: {str(e)}. Falling back to Mock.")
                return MockTravelPlannerService.generate_itinerary(
                    destination, start_date, end_date, budget_level, traveler_type, interests
                )
                
        # Default fallback
        logger.warning(f"Unknown AI Provider '{provider}'. Falling back to Mock generator.")
        return MockTravelPlannerService.generate_itinerary(
            destination, start_date, end_date, budget_level, traveler_type, interests
        )
