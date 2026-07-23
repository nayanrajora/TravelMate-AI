"""
Expense service layer.
Contains business logic for expense management and budget analytics.
Keeps API routers thin.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date

from app.models.expense import Expense
from app.models.trip import Trip
from app.schemas.expense import ExpenseCreate, ExpenseUpdate


def get_expense_by_id(db: Session, expense_id: int) -> Optional[Expense]:
    return db.query(Expense).filter(Expense.id == expense_id).first()


def list_expenses_for_trip(db: Session, trip_id: int) -> List[Expense]:
    return (
        db.query(Expense)
        .filter(Expense.trip_id == trip_id)
        .order_by(Expense.date.asc())
        .all()
    )


def create_expense(db: Session, trip_id: int, expense_in: ExpenseCreate) -> Expense:
    expense = Expense(
        trip_id=trip_id,
        category=expense_in.category,
        amount=expense_in.amount,
        description=expense_in.description,
        date=expense_in.date,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


def update_expense(db: Session, expense: Expense, expense_update: ExpenseUpdate) -> Expense:
    update_data = expense_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(expense, key, value)
    db.commit()
    db.refresh(expense)
    return expense


def delete_expense(db: Session, expense: Expense) -> None:
    db.delete(expense)
    db.commit()


def get_analytics(db: Session, trip: Trip) -> dict:
    """
    Aggregate expense totals per category.
    Returns a structured payload suitable for charting dashboards (e.g. Recharts).
    """
    aggregates = (
        db.query(Expense.category, func.sum(Expense.amount).label("total"))
        .filter(Expense.trip_id == trip.id)
        .group_by(Expense.category)
        .all()
    )

    total_spent = sum(row.total for row in aggregates)

    # Extract estimated total from AI-generated itinerary metadata (if available)
    itinerary = trip.generated_itinerary or {}
    estimated_total = 0.0
    if isinstance(itinerary, dict):
        estimated_total = itinerary.get("meta", {}).get("total_estimated_cost", 0.0)

    by_category = [
        {"category": row.category, "amount": round(float(row.total), 2)}
        for row in aggregates
    ]

    trip_days = (trip.end_date - trip.start_date).days + 1

    return {
        "trip_id": trip.id,
        "destination": trip.destination,
        "days": trip_days,
        "estimated_budget": float(estimated_total),
        "total_spent": round(float(total_spent), 2),
        "remaining_budget": round(float(estimated_total) - float(total_spent), 2),
        "by_category": by_category,
    }
