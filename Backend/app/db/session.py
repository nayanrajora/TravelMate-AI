from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# SQLite requires check_same_thread=False because FastAPI can make multiple requests in different threads.
# For PostgreSQL or MySQL, this connect_arg is not needed.
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# Engine is the actual connection point to the physical database
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False # Set to True to print all SQL statement logs in local dev
)

# SessionLocal is the factory class used to instantiate database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class is what all database models (User, Itinerary, etc.) will inherit from
Base = declarative_base()
