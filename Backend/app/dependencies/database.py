from typing import Generator
from app.db.session import SessionLocal

def get_db() -> Generator:
    """
    FastAPI dependency that yields a database session.
    Ensures that the connection is closed after the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
