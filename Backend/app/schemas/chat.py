from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional
from datetime import datetime


class ChatMessageRequest(BaseModel):
    """Payload sent by the client to ask the AI concierge a question."""
    message: str

    @field_validator("message")
    @classmethod
    def message_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Message cannot be empty")
        return v.strip()


class ChatMessageResponse(BaseModel):
    """Single chat message record returned by the API."""
    id: int
    trip_id: int
    role: str  # "user" | "assistant"
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChatResponse(BaseModel):
    """Response envelope returned after sending a chat message."""
    user_message: ChatMessageResponse
    assistant_message: ChatMessageResponse


class ChatHistoryResponse(BaseModel):
    """Full conversation history for a trip."""
    trip_id: int
    messages: List[ChatMessageResponse]
