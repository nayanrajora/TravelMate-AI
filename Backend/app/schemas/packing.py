from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class PackingItemBase(BaseModel):
    item_name: str
    category: str # e.g. "Clothing", "Electronics", "Documents", "Toiletries"
    is_packed: Optional[bool] = False

class PackingItemCreate(PackingItemBase):
    pass

class PackingItemUpdate(BaseModel):
    item_name: Optional[str] = None
    category: Optional[str] = None
    is_packed: Optional[bool] = None

class PackingItemResponse(PackingItemBase):
    id: int
    trip_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
