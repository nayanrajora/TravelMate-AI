"""
AI Concierge Chat Service.
Manages chat history persistence and routes messages to the configured AI provider.
Falls back gracefully when no AI key is configured.
"""

import json
import logging
import httpx
from typing import List, Dict, Any
import google.generativeai as genai

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.chat import ChatMessage
from app.models.trip import Trip
from app.prompts.templates import (
    CHAT_SYSTEM_PROMPT_TEMPLATE,
    CHAT_ITINERARY_SUMMARY_TEMPLATE,
    CHAT_NO_ITINERARY_SUMMARY,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# History helpers
# ---------------------------------------------------------------------------

def get_chat_history(db: Session, trip_id: int) -> List[ChatMessage]:
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.trip_id == trip_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )


def save_message(db: Session, trip_id: int, role: str, content: str) -> ChatMessage:
    msg = ChatMessage(trip_id=trip_id, role=role, content=content)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def clear_chat_history(db: Session, trip_id: int) -> int:
    """Delete all chat messages for a trip. Returns count of deleted records."""
    deleted = (
        db.query(ChatMessage)
        .filter(ChatMessage.trip_id == trip_id)
        .delete()
    )
    db.commit()
    return deleted


# ---------------------------------------------------------------------------
# System prompt builder
# ---------------------------------------------------------------------------

def _build_system_prompt(trip: Trip) -> str:
    """Construct the system prompt enriched with trip context."""
    itinerary = trip.generated_itinerary

    if itinerary and isinstance(itinerary, dict):
        schedule = itinerary.get("schedule", [])
        schedule_lines = []
        for day in schedule[:5]:  # Cap at 5 days to keep prompt manageable
            theme = day.get("theme", f"Day {day.get('day', '?')}")
            activities = ", ".join(
                a.get("activity_name", "") for a in day.get("activities", [])
            )
            schedule_lines.append(f"  Day {day.get('day', '?')}: {theme} — {activities}")

        total_cost = itinerary.get("meta", {}).get("total_estimated_cost", 0)
        itinerary_summary = CHAT_ITINERARY_SUMMARY_TEMPLATE.format(
            days=(trip.end_date - trip.start_date).days + 1,
            schedule_summary="\n".join(schedule_lines) if schedule_lines else "  (No schedule details available)",
            total_cost=total_cost,
        )
    else:
        itinerary_summary = CHAT_NO_ITINERARY_SUMMARY

    interests_str = ", ".join(trip.interests) if trip.interests else "Not specified"

    return CHAT_SYSTEM_PROMPT_TEMPLATE.format(
        destination=trip.destination,
        start_date=trip.start_date,
        end_date=trip.end_date,
        days=(trip.end_date - trip.start_date).days + 1,
        budget_level=trip.budget_level,
        traveler_type=trip.traveler_type,
        interests=interests_str,
        itinerary_summary=itinerary_summary,
    )


# ---------------------------------------------------------------------------
# Message history formatter for API calls
# ---------------------------------------------------------------------------

def _build_message_history(
    system_prompt: str,
    history: List[ChatMessage],
    new_user_message: str,
) -> List[Dict[str, str]]:
    """Build the message list for OpenAI-compatible chat completion calls."""
    messages = [{"role": "system", "content": system_prompt}]

    # Include recent history (last 20 messages to avoid token overflow)
    recent_history = history[-20:] if len(history) > 20 else history
    for msg in recent_history:
        messages.append({"role": msg.role, "content": msg.content})

    messages.append({"role": "user", "content": new_user_message})
    return messages


# ---------------------------------------------------------------------------
# AI Provider routing
# ---------------------------------------------------------------------------

async def _call_gemini(messages: List[Dict[str, str]], api_key: str) -> str:
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        
        # Convert to Gemini REST format
        contents = []
        system_instruction = None
        
        for msg in messages:
            if msg["role"] == "system":
                system_instruction = {"role": "user", "parts": [{"text": msg["content"]}]}
            else:
                contents.append({
                    "role": "user" if msg["role"] == "user" else "model",
                    "parts": [{"text": msg["content"]}]
                })
                
        # If there's a system prompt, we prepend it as the first user message (since some models don't support system_instruction properly via REST)
        if system_instruction:
            contents.insert(0, system_instruction)
            contents.insert(1, {"role": "model", "parts": [{"text": "Understood. I am your AI concierge."}]})

        payload = {"contents": contents}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=30.0)
            response.raise_for_status()
            data = response.json()
            
            if "candidates" in data and len(data["candidates"]) > 0:
                return data["candidates"][0]["content"]["parts"][0]["text"]
            return ""
            
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return ""

async def stream_gemini_response(messages: List[Dict[str, str]], api_key: str):
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?key={api_key}&alt=sse"
        
        contents = []
        system_instruction = None
        
        for msg in messages:
            if msg["role"] == "system":
                system_instruction = {"role": "user", "parts": [{"text": msg["content"]}]}
            else:
                contents.append({
                    "role": "user" if msg["role"] == "user" else "model",
                    "parts": [{"text": msg["content"]}]
                })
                
        if system_instruction:
            contents.insert(0, system_instruction)
            contents.insert(1, {"role": "model", "parts": [{"text": "Understood. I am your AI concierge."}]})

        payload = {"contents": contents}
        
        async with httpx.AsyncClient() as client:
            async with client.stream('POST', url, json=payload, timeout=30.0) as response:
                response.raise_for_status()
                
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:].strip()
                        if data_str == "[DONE]":
                            continue
                        try:
                            parsed = json.loads(data_str)
                            if "candidates" in parsed and len(parsed["candidates"]) > 0:
                                parts = parsed["candidates"][0]["content"]["parts"]
                                if len(parts) > 0 and "text" in parts[0]:
                                    text_val = parts[0]["text"]
                                    yield f"data: {json.dumps({'text': text_val})}\n\n"
                        except Exception:
                            pass
    except httpx.HTTPStatusError as e:
        logger.error(f"Gemini API HTTP error: {e}")
        err_msg = f"[AI Error: {e.response.status_code} {e.response.reason_phrase}. Please check your API key.]"
        yield f"data: {json.dumps({'text': err_msg})}\n\n"
    except Exception as e:
        logger.error(f"Gemini stream error: {e}")
        yield f"data: {json.dumps({'text': f'[Connection error: {str(e)}]'})}\n\n"


def _mock_response(user_message: str, trip: Trip = None) -> str:
    """
    Deterministic mock response used when no AI provider is configured.
    Provides generic but contextually relevant travel advice.
    """
    msg_lower = user_message.lower()
    
    dest = trip.destination if trip else "your destination"
    budget = trip.budget_level if trip else "your"
    start_date = trip.start_date if trip else "your travel dates"
    end_date = trip.end_date if trip else "your return date"

    if any(word in msg_lower for word in ["pack", "bring", "luggage", "suitcase"]):
        return (
            f"For your trip to {dest}, I'd recommend packing "
            "lightweight, breathable clothing, a universal power adapter, "
            "your travel documents, and a small first-aid kit. "
            "Check the local weather forecast closer to your departure date for specifics!"
        )
    if any(word in msg_lower for word in ["budget", "cost", "money", "spend", "expensive"]):
        return (
            f"Your trip is planned on a {budget} budget. "
            "To manage expenses, keep track of daily spending, use local transport where possible, "
            "and look for combo deals on activities. Your expense tracker on TravelMate can help!"
        )
    if any(word in msg_lower for word in ["food", "eat", "restaurant", "cuisine"]):
        return (
            f"Great choice exploring the food scene in {trip.destination}! "
            "I'd suggest trying local street food for authentic flavors at a lower cost, "
            "visiting popular food markets, and asking locals for their favourite spots. "
            "Don't forget to check for any dietary restriction considerations beforehand."
        )
    if any(word in msg_lower for word in ["transport", "travel", "get around", "taxi", "metro"]):
        return (
            f"Getting around {trip.destination} is usually straightforward. "
            "Public transport (metro, buses) is the most budget-friendly option. "
            "Ride-hailing apps are convenient for shorter distances, "
            "while walking is great for exploring the city centre."
        )
    if any(word in msg_lower for word in ["weather", "climate", "temperature", "rain"]):
        return (
            f"The weather in {dest} can vary. "
            "I recommend checking a weather app like Weather.com or AccuWeather a few days before your trip "
            f"for accurate forecasts covering {start_date} to {end_date}."
        )

    # Generic fallback
    return (
        f"That's a great question about your trip to {dest}! "
        "As your AI concierge, I'm here to help with itinerary details, packing tips, "
        "local food recommendations, budget advice, and general travel guidance. "
        "Could you be more specific so I can give you the best advice?"
    )


# ---------------------------------------------------------------------------
# Main chat entry points (Standard and Streaming)
# ---------------------------------------------------------------------------

async def get_ai_response(
    db: Session,
    trip: Trip,
    user_message: str,
    gemini_key: str = None
) -> str:
    """
    Save user message, get AI response, save assistant reply, return reply text.
    Routes to Gemini if key is provided, else falls back to Mock provider.
    """
    provider = settings.AI_PROVIDER.lower()
    history = get_chat_history(db, trip.id)
    system_prompt = _build_system_prompt(trip)
    messages = _build_message_history(system_prompt, history, user_message)

    reply: str = ""
    active_gemini_key = gemini_key or settings.GEMINI_API_KEY

    try:
        if active_gemini_key:
            reply = await _call_gemini(messages, active_gemini_key)
            if not reply:
                reply = "I'm sorry, the AI returned an empty response."
        else:
            reply = "No Gemini API Key is configured. Please click the Settings gear icon in the chat to add your key."
    except httpx.HTTPStatusError as e:
        logger.error(f"Gemini API HTTP error: {e}")
        reply = f"Error communicating with AI Provider: {e.response.status_code} {e.response.reason_phrase}. Please check your API key."
    except Exception as exc:
        logger.error(f"AI concierge error: {exc}")
        reply = f"An internal error occurred: {str(exc)}"

    return reply


import asyncio

async def stream_ai_response(
    db: Session,
    trip: Trip,
    user_message: str,
    gemini_key: str = None
):
    """
    Yields SSE chunks from Gemini. When finished, saves the complete assistant message.
    """
    provider = settings.AI_PROVIDER.lower()
    history = get_chat_history(db, trip.id)
    system_prompt = _build_system_prompt(trip)
    messages = _build_message_history(system_prompt, history, user_message)

    full_response = ""
    active_gemini_key = gemini_key or settings.GEMINI_API_KEY

    try:
        if active_gemini_key:
            async for chunk in stream_gemini_response(messages, active_gemini_key):
                try:
                    data_str = chunk[6:].strip() # remove "data: " and "\n\n"
                    parsed = json.loads(data_str)
                    full_response += parsed.get("text", "")
                except Exception:
                    pass
                yield chunk
                await asyncio.sleep(0)
        else:
            # Fallback to explicit message if no key
            reply = "No Gemini API Key is configured. Please click the Settings gear icon in the chat to add your key."
            words = reply.split(" ")
            for word in words:
                full_response += word + " "
                yield f"data: {json.dumps({'text': word + ' '})}\n\n"
                await asyncio.sleep(0.05)
    except httpx.HTTPStatusError as e:
        logger.error(f"Gemini API HTTP error: {e}")
        err_msg = f"\n[AI Error: {e.response.status_code} {e.response.reason_phrase}. Please check your API key.]"
        full_response += err_msg
        yield f"data: {json.dumps({'text': err_msg})}\n\n"
    except Exception as exc:
        logger.error(f"AI concierge streaming error: {exc}")
        err_msg = f"\n[Connection interrupted: {str(exc)}]"
        full_response += err_msg
        yield f"data: {json.dumps({'text': err_msg})}\n\n"

    # Save assistant message to DB after streaming is done
    if full_response:
        save_message(db, trip.id, role="assistant", content=full_response.strip())
