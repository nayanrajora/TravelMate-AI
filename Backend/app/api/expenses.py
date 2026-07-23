"""
Expense Management API Router.
Provides CRUD operations and budget analytics for trip expenses.
All endpoints are JWT-protected and ownership-enforced.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.models.user import User
from app.models.trip import Trip
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user
from app.services import expense_service

router = APIRouter(tags=["Smart Budget Analytics"])


# ---------------------------------------------------------------------------
# Helper: verify trip ownership (DRY utility used by all expense endpoints)
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


# ---------------------------------------------------------------------------
# GET /trips/{trip_id}/expenses — list all expenses for a trip
# ---------------------------------------------------------------------------
@router.get("/trips/{trip_id}/expenses", response_model=List[ExpenseResponse])
async def list_expenses(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all expense logs linked to a specific trip (sorted by date ascending)."""
    _get_authorized_trip(trip_id, current_user, db)
    return expense_service.list_expenses_for_trip(db, trip_id)


# ---------------------------------------------------------------------------
# POST /trips/{trip_id}/expenses — log a new expense
# ---------------------------------------------------------------------------
@router.post(
    "/trips/{trip_id}/expenses",
    response_model=ExpenseResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_expense(
    trip_id: int,
    expense_in: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Log a new expense entry against a specific trip."""
    _get_authorized_trip(trip_id, current_user, db)
    return expense_service.create_expense(db, trip_id, expense_in)


# ---------------------------------------------------------------------------
# GET /trips/{trip_id}/expenses/analytics — budget breakdown by category
# ---------------------------------------------------------------------------
@router.get("/trips/{trip_id}/expenses/analytics", response_model=Dict[str, Any])
async def get_expenses_analytics(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Aggregate expense totals grouped by category.
    Returns structured budget report including estimated vs actual totals.
    Designed to feed frontend charting dashboards (e.g. Recharts / Chart.js).
    """
    trip = _get_authorized_trip(trip_id, current_user, db)
    return expense_service.get_analytics(db, trip)


# ---------------------------------------------------------------------------
# GET /expenses/{expense_id} — fetch a single expense record
# ---------------------------------------------------------------------------
@router.get("/expenses/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve a single expense record by ID."""
    expense = expense_service.get_expense_by_id(db, expense_id)
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    trip = db.query(Trip).filter(Trip.id == expense.trip_id).first()
    if not trip or trip.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this expense",
        )
    return expense


# ---------------------------------------------------------------------------
# PUT /expenses/{expense_id} — update an expense record
# ---------------------------------------------------------------------------
@router.put("/expenses/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: int,
    expense_update: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update one or more fields of an existing expense log."""
    expense = expense_service.get_expense_by_id(db, expense_id)
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    trip = db.query(Trip).filter(Trip.id == expense.trip_id).first()
    if not trip or trip.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this expense",
        )
    return expense_service.update_expense(db, expense, expense_update)


# ---------------------------------------------------------------------------
# DELETE /expenses/{expense_id} — remove an expense record
# ---------------------------------------------------------------------------
@router.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an expense log entry."""
    expense = expense_service.get_expense_by_id(db, expense_id)
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    trip = db.query(Trip).filter(Trip.id == expense.trip_id).first()
    if not trip or trip.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this expense",
        )
    expense_service.delete_expense(db, expense)
    return None
