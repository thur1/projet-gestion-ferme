# Projet de Gestion de Ferme 🌾

Application full-stack avec frontend React et backend Django/DRF pour gérer fermes, lots et stocks.

## 📁 Structure du Projet

```
projet-de-gestion-de-ferme/
├── frontend/           # React 19 + Vite + Tailwind
├── backend_django/     # Django 4.2 + DRF + JWT
├── infra/              # Docker, PostgreSQL, docs infra
└── .github/
  └── workflows/      # CI/CD GitHub Actions
```

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription/connexion via API Django `/api/auth/`
- JWT (access/refresh) avec SimpleJWT
- Routes protégées côté frontend

### 🌾 Gestion des Fermes
- Création/gestion de fermes
- Multi-ferme par utilisateur

### 🐔 Gestion des Lots
- Lots par unité/espèce
- Suivi journalier (mortalité, alimentation, œufs/lait)

### 📦 Gestion des Stocks
- Articles, mouvements, alertes seuil

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 24.x (frontend)
- Python 3.11+ (backend_django)
- PostgreSQL (local ou conteneur)
- Docker & Docker Compose (optionnel)

### Installation
1. Cloner
```bash
git clone https://github.com/thur1/projet-gestion-ferme.git
cd projet-gestion-ferme
```

2. Backend Django
```bash
cd backend_django
python -m venv .venv
.venv/Scripts/activate  # ou source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Ajuster DB_ENGINE/postgres si besoin
python manage.py migrate
python manage.py createsuperuser  # optionnel
```

3. Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
```
Variables principales :
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
VITE_APP_ENV=development
```

4. Base de données
Les migrations Django créent le schéma automatiquement (`python manage.py migrate`).

### Développement Local

Backend Django
```bash
cd backend_django
python manage.py runserver 8000
# API: http://127.0.0.1:8000/api/
```

Frontend
```bash
cd frontend
npm run dev
# App: http://127.0.0.1:5173/
```

### Docker
```bash
cd infra
docker-compose up -d
```
Services :
- Backend Django : http://localhost:8000
- PostgreSQL : localhost:5432

## 🏗️ Architecture Technique

### Frontend
- React 19 (TS) + Vite 7.2
- Tailwind CSS 4.1
- React Router 7
- State/query : React Query + Context

### Backend Django
- Django 4.2 + DRF
- Auth : SimpleJWT (access/refresh)
- DB : PostgreSQL (ou SQLite par défaut)
- Schéma principal : Enterprise, Farm, Unit, Species, Lot, LotDailyRecord, HealthEvent, StockItem, StockMovement

### Base de Données (PostgreSQL ou SQLite)

- Par défaut : SQLite (dev/CI) ; pour PostgreSQL, définir `DB_ENGINE=postgres` et les variables `POSTGRES_*`.
- Schéma géré par les migrations Django (voir `backend_django/apps/core/models.py`).
- Entités principales : Enterprise, Membership, Farm, Species, Unit, Lot, LotDailyRecord, HealthEvent, StockItem, StockMovement.

## 📚 Documentation API

### Endpoints Disponibles

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/auth/register/` | POST | Créer un compte | Non |
| `/api/auth/login/` | POST | Se connecter | Non |
| `/api/auth/refresh/` | POST | Rafraîchir le token | Non |
| `/api/farms/` | GET/POST | Liste/Création fermes | Oui |
| `/api/units/` | GET/POST | Unités d'élevage | Oui |
| `/api/lots/` | GET/POST | Lots | Oui |
| `/api/stock-items/` | GET/POST | Articles de stock | Oui |
| `/api/health-events/` | GET/POST | Évènements de santé (lot) | Oui |
| `/api/dashboard/summary/` | GET | KPIs fermes | Oui |

### Exemples de requêtes (Django API)

Créer une ferme :
```bash
curl -X POST http://127.0.0.1:8000/api/farms/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ferme Demo","enterprise":"<enterprise_id>"}'
```

Dashboard summary :
```bash
curl "http://127.0.0.1:8000/api/dashboard/summary/?farm_id=<id>" \
  -H "Authorization: Bearer <access_token>"
```

Créer un évènement de santé :
```bash
curl -X POST http://127.0.0.1:8000/api/health-events/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "lot": "<lot_uuid>",
    "date": "2025-01-05",
    "event_type": "vaccination",
    "product": "Vaccin X",
    "dose": "10ml",
    "veterinarian": "Dr Vet",
    "notes": "RAS"
  }'
```

## 🧪 Tests

### Backend Django
```bash
cd backend_django
python manage.py test
```

### Frontend
```bash
cd frontend
npm run lint
npm run build
```

## 🐳 Docker

Backend Django + Postgres via compose :
```bash
cd infra
docker-compose up -d
```

## 📦 Build Production

- Frontend : `npm run build` (dist/)
- Backend Django : `python manage.py runserver 0.0.0.0:8000` (ou `gunicorn backend_django.wsgi:application --bind 0.0.0.0:8000` si installé)

## 🚥 CI/CD

Workflow GitHub Actions (`.github/workflows/ci.yml`) : build/lint frontend, tests backend Django et build image Docker.

## 🔧 Configuration

Variables principales (backend_django `.env`) :
```env
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=false
DB_ENGINE=postgres
POSTGRES_DB=ferme_db
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_HOST=database
POSTGRES_PORT=5432
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
```

## 📚 Documentation

- Frontend : `frontend/README.md`
- Backend Django : admin auto-documenté + `/api/docs/` (Swagger) via DRF Spectacular
- Infra : `infra/README.md`

## 🤝 Contribution

1. Fork
2. Branche feature
3. PR

## 📄 Licence

MIT
