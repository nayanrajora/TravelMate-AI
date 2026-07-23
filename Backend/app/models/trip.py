from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    budget_level = Column(String, nullable=False) # e.g. "Economy", "Moderate", "Luxury"
    traveler_type = Column(String, nullable=False) # e.g. "Solo", "Couple", "Family", "Friends"
    interests = Column(JSON, nullable=True) # List of selected interests: ["Food", "History", "Nature"]
    generated_itinerary = Column(JSON, nullable=True) # Stores the complete AI itinerary payload
    is_draft = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="trips")
    expenses = relationship("Expense", back_populates="trip", cascade="all, delete-orphan")
    packing_items = relationship("PackingItem", back_populates="trip", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="trip", cascade="all, delete-orphan")
