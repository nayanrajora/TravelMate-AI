from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), unique=True, index=True, nullable=False)

    hashed_password = Column(String(255), nullable=False)

    full_name = Column(String(150), nullable=True)

    bio = Column(String(1000), nullable=True)

    travel_preferences = Column(
        String(500),
        nullable=True
    )  # Example: "Solo, Adventure, Budget"

    is_active = Column(Boolean, default=True)

    is_admin = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    trips = relationship(
        "Trip",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    bookings = relationship(
        "Booking",
        back_populates="user",
        cascade="all, delete-orphan"
    )