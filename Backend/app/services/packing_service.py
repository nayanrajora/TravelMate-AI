"""
Packing checklist service layer.
Contains business logic for managing packing items and computing progress metrics.
"""

from sqlalchemy.orm import Session
from typing import List, Optional

from app.models.packing import PackingItem
from app.schemas.packing import PackingItemCreate, PackingItemUpdate


def get_packing_item_by_id(db: Session, item_id: int) -> Optional[PackingItem]:
    return db.query(PackingItem).filter(PackingItem.id == item_id).first()


def list_packing_items_for_trip(db: Session, trip_id: int) -> List[PackingItem]:
    return (
        db.query(PackingItem)
        .filter(PackingItem.trip_id == trip_id)
        .order_by(PackingItem.category.asc(), PackingItem.item_name.asc())
        .all()
    )


def create_packing_item(db: Session, trip_id: int, item_in: PackingItemCreate) -> PackingItem:
    item = PackingItem(
        trip_id=trip_id,
        item_name=item_in.item_name,
        category=item_in.category,
        is_packed=item_in.is_packed,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_packing_item(db: Session, item: PackingItem, item_update: PackingItemUpdate) -> PackingItem:
    update_data = item_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


def toggle_packed_status(db: Session, item: PackingItem) -> PackingItem:
    item.is_packed = not item.is_packed
    db.commit()
    db.refresh(item)
    return item


def delete_packing_item(db: Session, item: PackingItem) -> None:
    db.delete(item)
    db.commit()


def get_packing_progress(db: Session, trip_id: int) -> dict:
    """
    Compute packing progress for a trip.
    Returns total items, packed count, percentage, and a per-category breakdown.
    """
    items = list_packing_items_for_trip(db, trip_id)

    total = len(items)
    packed = sum(1 for i in items if i.is_packed)
    percentage = round((packed / total * 100), 1) if total > 0 else 0.0

    # Per-category breakdown
    categories: dict = {}
    for item in items:
        cat = item.category
        if cat not in categories:
            categories[cat] = {"category": cat, "total": 0, "packed": 0}
        categories[cat]["total"] += 1
        if item.is_packed:
            categories[cat]["packed"] += 1

    by_category = list(categories.values())

    return {
        "trip_id": trip_id,
        "total_items": total,
        "packed_items": packed,
        "unpacked_items": total - packed,
        "progress_percentage": percentage,
        "by_category": by_category,
    }
