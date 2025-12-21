<!-- Workspace instructions for Copilot -->

# ✅ Projet Gestion de Ferme - Configuration (Django + React)

## État du Projet
- Frontend : React 19 + Vite + Tailwind + PWA (offline, sync, design system).
- Backend : Django 4.2 + DRF + SimpleJWT (login/register/refresh), PostgreSQL ou SQLite.
- Infrastructure : Docker Compose (backend_django + Postgres), GitHub Actions (frontend build/lint, tests Django, build Docker).
- Docs principales : `README.md`, `frontend/README.md`, `infra/README.md`, `infra/DATABASE_SETUP.md`, `frontend/PWA_DOCUMENTATION.md`.

## Architecture Implémentée
- Backend : `backend_django/` (apps `users`, `core`, `common`), auth JWT, endpoints `/api/auth/login|register|refresh`, ressources farms/units/lots/stock.
- Frontend : feature-based, hooks/services partagés, `AuthContext` basé sur JWT (tokens stockés localement), API client `src/lib/api-client.ts` vers `VITE_API_BASE_URL`.
- PWA : Workbox avec cache API `/api/`, images, fonts ; IndexedDB + offline queue/sync.

## Points d'attention
- Ne plus utiliser Supabase ni l'ancien backend Node : dossiers `backend/` supprimés, supabase.ts retiré.
- Variables d’env frontend : `VITE_API_BASE_URL`, `VITE_APP_ENV`.
- Docker : backend expose 8000 ; compose : service `backend` + `database` Postgres.

## Tests
- Backend : `python manage.py test` (SQLite par défaut).
- Frontend : `npm run lint`, `npm run build`.

## Prochaines améliorations possibles
- Ajouter des pages CRUD reliées aux endpoints Django.
- Couvrir plus de tests Django (core) et tests e2e frontend.
