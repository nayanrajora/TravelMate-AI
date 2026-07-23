from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base


class ChatMessage(Base):
    """
    Stores individual AI concierge chat messages for a trip.
    Persists the conversation history so users can review past Q&A.
    """
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    role = Column(String, nullable=False)  # "user" | "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    trip = relationship("Trip", back_populates="chat_messages")
