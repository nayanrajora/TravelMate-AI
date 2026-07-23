from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime

class ExpenseBase(BaseModel):
    category: str # e.g. "Food", "Transport", "Lodging", "Activities", "Shopping"
    amount: float
    description: Optional[str] = None
    date: date

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    date: Optional[date] = None

class ExpenseResponse(ExpenseBase):
    id: int
    trip_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
