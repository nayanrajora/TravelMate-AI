from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.schemas.token import Token
from app.core.security import get_password_hash, verify_password, create_access_token
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    Hashes the password and saves the user account to the database.
    """
    # Check if the user email already exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
        
    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        bio="Hello! I'm a new traveler exploring the world with TravelMate AI.",
        travel_preferences="Flexible, Budget-conscious",
        is_active=True,
        is_admin=False
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate a user and return a JWT access token.
    """
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
        
    # Generate the access token using the user ID as subject
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current logged-in user profile info.
    Protected endpoint using the get_current_user dependency.
    """
    return current_user

from pydantic import BaseModel
from typing import Optional

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    travel_preferences: Optional[str] = None

@router.patch("/me", response_model=UserResponse)
async def update_me(user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Update current logged-in user profile info.
    """
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.bio is not None:
        current_user.bio = user_update.bio
    if user_update.travel_preferences is not None:
        current_user.travel_preferences = user_update.travel_preferences
        
    db.commit()
    db.refresh(current_user)
    return current_user
