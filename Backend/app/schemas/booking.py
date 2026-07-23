from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime

class BookingBase(BaseModel):
    hotel_name: str
    location: str
    price_per_night: str
    check_in: date
    check_out: date
    guests: int
    total_price: float

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
