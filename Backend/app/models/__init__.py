from app.db.session import Base
from app.models.user import User
from app.models.trip import Trip
from app.models.expense import Expense
from app.models.packing import PackingItem
from app.models.chat import ChatMessage
from app.models.booking import Booking
# This ensures all models are imported in one place and registered on the declarative Base metadata.
__all__ = ["Base", "User", "Trip", "Expense", "PackingItem", "ChatMessage", "Booking"]
