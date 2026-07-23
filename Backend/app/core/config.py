import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "TravelMate AI"
    ENVIRONMENT: str = "development"

    # Database Configuration
    DATABASE_URL: str = "sqlite:///./travelmate.db"

    # JWT Authentication Configuration
    SECRET_KEY: str = "replace_with_a_secure_random_secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # AI Configuration
    AI_PROVIDER: str = "openai"
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173", # Vite React default
        "http://127.0.0.1:5173",
    ]

    # Model configuration to load values from .env file
    model_config = SettingsConfigDict(
        env_file=[
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), ".env.local")
        ],
        env_file_encoding="utf-8",
        extra="ignore" # ignore extra variables in env file
    )

settings = Settings()
