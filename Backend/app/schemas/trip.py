from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import date, datetime

class TripBase(BaseModel):
    title: str
    destination: str
    start_date: date
    end_date: date
    budget_level: str # Economy, Moderate, Luxury
    traveler_type: str # Solo, Couple, Family, Friends
    interests: Optional[List[str]] = []
    generated_itinerary: Optional[Any] = None
    is_draft: Optional[bool] = False

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget_level: Optional[str] = None
    traveler_type: Optional[str] = None
    interests: Optional[List[str]] = None
    generated_itinerary: Optional[Any] = None
    is_draft: Optional[bool] = None

class TripResponse(TripBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
