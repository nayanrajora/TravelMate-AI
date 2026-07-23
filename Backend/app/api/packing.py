"""
Packing Checklist API Router.
Provides CRUD operations and progress tracking for trip packing lists.
All endpoints are JWT-protected and ownership-enforced.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.models.user import User
from app.models.trip import Trip
from app.schemas.packing import PackingItemCreate, PackingItemUpdate, PackingItemResponse
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user
from app.services import packing_service

router = APIRouter(tags=["Packing Checklist"])


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


def _get_authorized_item(item_id: int, current_user: User, db: Session):
    item = packing_service.get_packing_item_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Packing item not found")

    trip = db.query(Trip).filter(Trip.id == item.trip_id).first()
    if not trip or trip.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this packing item",
        )
    return item


# ---------------------------------------------------------------------------
# GET /trips/{trip_id}/packing — list all packing items for a trip
# ---------------------------------------------------------------------------
@router.get("/trips/{trip_id}/packing", response_model=List[PackingItemResponse])
async def list_packing_items(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all packing items for a specific trip (sorted by category, then name)."""
    _get_authorized_trip(trip_id, current_user, db)
    return packing_service.list_packing_items_for_trip(db, trip_id)


# ---------------------------------------------------------------------------
# POST /trips/{trip_id}/packing — add a new packing item
# ---------------------------------------------------------------------------
@router.post(
    "/trips/{trip_id}/packing",
    response_model=PackingItemResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_packing_item(
    trip_id: int,
    item_in: PackingItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a new item to a trip's packing checklist."""
    _get_authorized_trip(trip_id, current_user, db)
    return packing_service.create_packing_item(db, trip_id, item_in)


# ---------------------------------------------------------------------------
# GET /trips/{trip_id}/packing/progress — checklist completion summary
# ---------------------------------------------------------------------------
@router.get("/trips/{trip_id}/packing/progress", response_model=Dict[str, Any])
async def get_packing_progress(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns packing progress summary: total items, packed count, percentage, and
    per-category breakdown. Useful for progress bars and checklist dashboards.
    """
    _get_authorized_trip(trip_id, current_user, db)
    return packing_service.get_packing_progress(db, trip_id)


# ---------------------------------------------------------------------------
# GET /packing/{item_id} — get a single packing item
# ---------------------------------------------------------------------------
@router.get("/packing/{item_id}", response_model=PackingItemResponse)
async def get_packing_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve a single packing item by ID."""
    return _get_authorized_item(item_id, current_user, db)


# ---------------------------------------------------------------------------
# PUT /packing/{item_id} — full update of a packing item
# ---------------------------------------------------------------------------
@router.put("/packing/{item_id}", response_model=PackingItemResponse)
async def update_packing_item(
    item_id: int,
    item_update: PackingItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update one or more fields of an existing packing item."""
    item = _get_authorized_item(item_id, current_user, db)
    return packing_service.update_packing_item(db, item, item_update)


# ---------------------------------------------------------------------------
# PATCH /packing/{item_id}/toggle — flip packed status
# ---------------------------------------------------------------------------
@router.patch("/packing/{item_id}/toggle", response_model=PackingItemResponse)
async def toggle_packing_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Toggle the packed/unpacked status of a packing item."""
    item = _get_authorized_item(item_id, current_user, db)
    return packing_service.toggle_packed_status(db, item)


# ---------------------------------------------------------------------------
# DELETE /packing/{item_id} — remove a packing item
# ---------------------------------------------------------------------------
@router.delete("/packing/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_packing_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a packing item from the checklist."""
    item = _get_authorized_item(item_id, current_user, db)
    packing_service.delete_packing_item(db, item)
    return None
