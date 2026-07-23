from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.trips import router as trips_router
from app.api.packing import router as packing_router
from app.api.expenses import router as expenses_router
from app.api.chat import router as chat_router
from app.api.weather import router as weather_router
from app.api.bookings import router as bookings_router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="0.1.0",
        description="AI-powered travel planning companion API",
    )

    # Configure CORS middleware to allow React frontend to connect
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routes
    app.include_router(auth_router, prefix="/api")
    app.include_router(trips_router, prefix="/api")
    app.include_router(packing_router, prefix="/api")
    app.include_router(expenses_router, prefix="/api")
    app.include_router(chat_router, prefix="/api")
    app.include_router(weather_router, prefix="/api")
    app.include_router(bookings_router, prefix="/api")

    # Health check route
    @app.get("/health", tags=["Health"])
    async def health_check():
        return {
            "status": "healthy",
            "project_name": settings.PROJECT_NAME,
            "environment": settings.ENVIRONMENT,
            "version": "0.1.0"
        }

    return app

app = create_app()
