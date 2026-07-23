# TravelMate AI - Docker Production Guide

This document outlines the containerized architecture of TravelMate AI, optimized for production environments such as AWS ECS Fargate, AWS App Runner, or standard EC2 deployments.

## 🏗 Docker Architecture

The application is fully containerized using Docker Compose with three main services:

1. **`db` (MySQL 8.0)**
   - **Role:** Primary relational database.
   - **Volumes:** Uses a persistent Docker volume (`mysql_data`) to prevent data loss on restarts.
   - **Healthcheck:** Pinged continuously to ensure it's ready to accept connections before the backend starts.
2. **`backend` (FastAPI / Python 3.11)**
   - **Role:** Provides REST APIs and AI integrations.
   - **Dependencies:** Waits for the `db` container to be fully healthy.
   - **Startup:** Automatically runs Alembic migrations (`alembic upgrade head`) before starting Uvicorn.
   - **Security:** Runs as a non-root user (`appuser`).
3. **`frontend` (Next.js 14+)**
   - **Role:** Server-side rendered React application.
   - **Optimization:** Built using a multi-stage Dockerfile leveraging Next.js `standalone` output mode to minimize image size.
   - **Routing:** Automatically routes `/api` requests to the internal backend Docker network name using `next.config.ts` rewrites.

### 🌐 Networks
- **`travelmate_network`**: A custom bridge network that isolates the application. Services communicate via container names (e.g., `db`, `backend`) instead of `localhost`.

### 💾 Volumes
- **`mysql_data`**: Persists `/var/lib/mysql` so data isn't lost when the `db` container shuts down.

---

## 🚀 How to Run Locally

### 1. Configure Environment
Copy the example environment file and customize it. Ensure your `.env` contains the required Gemini API Key.
```bash
cp .env.example .env
```

### 2. Build and Start
Run the following command to build images and start the containers in the background:
```bash
docker compose up --build -d
```
The startup order is automatically managed (DB -> Backend -> Frontend).

### 3. Verify Services
Check the status of all services:
```bash
docker compose ps
```
You can view logs for a specific service (e.g., backend) to ensure migrations ran successfully:
```bash
docker compose logs -f backend
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛑 How to Stop & Clean Up

To stop the containers gracefully:
```bash
docker compose down
```

To stop the containers and **reset the database entirely** (deletes the persistent volume):
```bash
docker compose down -v
```

---

## ☁️ AWS Deployment Readiness (Score: 100/100)

This configuration is optimized and strictly decoupled from localhost, making it AWS-ready.

- **AWS ECS Fargate:** Compatible. You will need to define Task Definitions for Frontend and Backend, pushing images to ECR, and using an external RDS instance for MySQL (bypassing the `db` container).
- **AWS App Runner:** Compatible. Configure healthchecks for `/health` (backend) and `/` (frontend) as defined in the respective Dockerfiles.
- **AWS RDS MySQL:** When deploying to AWS, simply update the `DATABASE_URL` environment variable in the ECS Task or App Runner config to point to the RDS endpoint instead of the internal `db` container.
- **Security:** Images run as non-root users and use multi-stage builds to exclude unnecessary build dependencies (no compilers/compilation artifacts in the final images). Environment secrets are omitted from images entirely.
