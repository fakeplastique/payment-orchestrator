# Payment Orchestrator

A payment orchestration platform for managing transactions across multiple payment providers. Includes fraud detection, audit logging, role-based access control, and an analytics dashboard.

## Stack

**Backend:** NestJS, TypeORM, PostgreSQL, JWT (Passport)
**Frontend:** Next.js 15, Chart.js, SCSS
**Infrastructure:** Docker, Docker Compose

## Getting Started

Copy the environment file and fill in the values:

```bash
cp .env.example .env
```

### With Docker

```bash
# Production
docker-compose up

# Development (hot-reload)
docker-compose -f docker-compose.dev.yml up
```

Services: frontend on `:3000`, backend on `:3001`, PostgreSQL on `:9898`.

### Without Docker

Requires a PostgreSQL instance on `localhost:5432`.

```bash
npm run dev:backend    # starts NestJS on :3001
npm run dev:frontend   # starts Next.js on :3000
```