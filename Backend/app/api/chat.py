"""
AI Concierge Chat API Router.
Provides endpoints for conversational AI assistance scoped to a specific trip.
All endpoints are JWT-protected and trip-ownership-enforced.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.trip import Trip
from app.schemas.chat import (
    ChatMessageRequest,
    ChatMessageResponse,
    ChatResponse,
    ChatHistoryResponse,
)
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user
from app.services import chat_service

router = APIRouter(tags=["AI Concierge Chat"])


# ---------------------------------------------------------------------------
# Helper: verify trip ownership
# ---------------------------------------------------------------------------
def _get_authorized_trip(trip_id: int, current_user: User, db: Session) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this trip",
        )
    return trip


# ---------------------------------------------------------------------------
# POST /trips/{trip_id}/chat — send a message to the AI concierge
# ---------------------------------------------------------------------------
@router.post(
    "/trips/{trip_id}/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
)
async def send_chat_message(
    trip_id: int,
    body: ChatMessageRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Send a message to the AI travel concierge for a specific trip.

    The concierge is context-aware: it knows the trip's destination, dates, budget,
    traveler type, and itinerary. Conversation history is persisted per trip so
    follow-up questions have context.

    Supports OpenAI (gpt-4o-mini), Gemini (gemini-1.5-flash), or falls back to
    a built-in mock concierge when no API key is configured.
    """
    trip = _get_authorized_trip(trip_id, current_user, db)

    # 1. Persist user message
    user_msg = chat_service.save_message(db, trip_id, role="user", content=body.message)

    gemini_key = request.headers.get("x-gemini-key")

    # 2. Get AI reply
    reply_text = await chat_service.get_ai_response(db, trip, body.message, gemini_key)

    # 3. Persist assistant message
    assistant_msg = chat_service.save_message(db, trip_id, role="assistant", content=reply_text)

    return ChatResponse(
        user_message=ChatMessageResponse.model_validate(user_msg),
        assistant_message=ChatMessageResponse.model_validate(assistant_msg),
    )


# ---------------------------------------------------------------------------
# POST /trips/{trip_id}/chat/stream — stream a message from the AI concierge
# ---------------------------------------------------------------------------
@router.post(
    "/trips/{trip_id}/chat/stream",
    response_class=StreamingResponse,
    status_code=status.HTTP_200_OK,
)
async def stream_chat_message(
    trip_id: int,
    body: ChatMessageRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Stream a message from the AI travel concierge for a specific trip.
    Yields SSE chunks.
    """
    trip = _get_authorized_trip(trip_id, current_user, db)

    # 1. Persist user message
    chat_service.save_message(db, trip_id, role="user", content=body.message)
    
    # Check for Gemini key in header
    gemini_key = request.headers.get("x-gemini-key")

    # 2. Return StreamingResponse
    return StreamingResponse(
        chat_service.stream_ai_response(db, trip, body.message, gemini_key),
        media_type="text/event-stream",
    )


# ---------------------------------------------------------------------------
# GET /trips/{trip_id}/chat/history — retrieve full conversation history
# ---------------------------------------------------------------------------
@router.get(
    "/trips/{trip_id}/chat/history",
    response_model=ChatHistoryResponse,
)
async def get_chat_history(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve the full AI concierge conversation history for a trip.
    Messages are ordered chronologically (oldest first).
    """
    _get_authorized_trip(trip_id, current_user, db)
    messages = chat_service.get_chat_history(db, trip_id)
    return ChatHistoryResponse(
        trip_id=trip_id,
        messages=[ChatMessageResponse.model_validate(m) for m in messages],
    )


# ---------------------------------------------------------------------------
# DELETE /trips/{trip_id}/chat/history — clear conversation history
# ---------------------------------------------------------------------------
@router.delete(
    "/trips/{trip_id}/chat/history",
    status_code=status.HTTP_200_OK,
)
async def clear_chat_history(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Clear all chat messages for a trip.
    Useful when the user wants to start a fresh conversation.
    """
    _get_authorized_trip(trip_id, current_user, db)
    count = chat_service.clear_chat_history(db, trip_id)
    return {"message": f"Cleared {count} chat message(s) for trip {trip_id}."}


# ---------------------------------------------------------------------------
# POST /chat/stream — Generic streaming chat without a specific trip
# ---------------------------------------------------------------------------
@router.post(
    "/chat/stream",
    response_class=StreamingResponse,
    status_code=status.HTTP_200_OK,
)
async def stream_generic_chat_message(
    body: ChatMessageRequest,
    request: Request,
):
    """
    Generic chat endpoint that doesn't require a specific trip context.
    Yields SSE chunks.
    """
    gemini_key = request.headers.get("x-gemini-key") or chat_service.settings.GEMINI_API_KEY
    if not gemini_key:
        async def _error_stream():
            yield f"data: {{\"text\": \"[AI Error: No API Key configured. Please add your Gemini API Key in the settings.]\"}}\n\n"
        return StreamingResponse(_error_stream(), media_type="text/event-stream")
    
    # Generic system prompt for general travel queries
    system_prompt = "You are TravelMate AI, a professional 24/7 travel concierge. Answer travel-related questions clearly and helpfully."
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": body.message}
    ]

    return StreamingResponse(
        chat_service.stream_gemini_response(messages, gemini_key),
        media_type="text/event-stream",
    )
