# Docker Infrastructure

This directory contains Docker configuration files for the project (backend Django + PostgreSQL).

## Files

- `Dockerfile` - Python 3.11 image for the Django backend
- `docker-compose.yml` - Orchestrates backend and PostgreSQL database

## Usage

### Start all services
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild services
```bash
docker-compose up -d --build
```

## Services

### Database (PostgreSQL)
- **Port**: 5432
- **User**: user
- **Password**: password
- **Database**: ferme_db

### Backend API (Django)
- **Port**: 8000
- **API**: http://localhost:8000/api/

## Environment Variables

Environment variables are configured in the `docker-compose.yml` file. For local development without Docker, use the `.env` file in the backend directory.
