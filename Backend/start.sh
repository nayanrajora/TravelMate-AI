#!/bin/bash
set -e

echo "Starting Backend service..."

# Run Alembic migrations
echo "Running database migrations..."
alembic upgrade head

# Start Uvicorn server
echo "Starting Uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
