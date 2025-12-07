# Docker Infrastructure

This directory contains Docker configuration files for the project.

## Files

- `Dockerfile` - Multi-stage build for the backend application
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

### Backend API
- **Port**: 3000
- **Health Check**: http://localhost:3000/health
- **API**: http://localhost:3000/api/farms

## Environment Variables

Environment variables are configured in the `docker-compose.yml` file. For local development without Docker, use the `.env` file in the backend directory.
