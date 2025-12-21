# 🚀 Guide de Démarrage Rapide (Django + React)

Ce guide lance rapidement le backend Django/DRF et le frontend React.

## ✅ Prérequis
- Python 3.11+
- Node.js 24.x
- Git
- PostgreSQL (optionnel, SQLite par défaut)

## 📋 Étapes

### 1️⃣ Cloner
```bash
git clone https://github.com/thur1/projet-gestion-ferme.git
cd projet-gestion-ferme
```

### 2️⃣ Backend Django
```bash
cd backend_django
python -m venv .venv
.venv/Scripts/activate  # ou source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser  # optionnel
python manage.py runserver 8000
# API: http://127.0.0.1:8000/api/
```

`.env` minimal :
```env
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=true
DB_ENGINE=sqlite
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
# Pour Postgres
# DB_ENGINE=postgres
# POSTGRES_DB=ferme_db
# POSTGRES_USER=user
# POSTGRES_PASSWORD=password
# POSTGRES_HOST=localhost
# POSTGRES_PORT=5432
```

### 3️⃣ Frontend
```bash
cd ../frontend
npm install
cp .env.example .env.local
npm run dev
# App: http://127.0.0.1:5173/
```
`.env.local` minimal :
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
VITE_APP_ENV=development
```

### 4️⃣ Tester l'API
Créer un compte :
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Demo1234!"}'
```
Login :
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Demo1234!"}'
```
Dashboard summary :
```bash
curl "http://127.0.0.1:8000/api/dashboard/summary/?farm_id=<id>" \
  -H "Authorization: Bearer <access_token>"
```

### 5️⃣ Docker (optionnel)
```bash
cd infra
docker-compose up -d
# Backend: http://localhost:8000
# Postgres: localhost:5432
```

## 🎉 URLs utiles
- Frontend : http://127.0.0.1:5173/
- Backend API : http://127.0.0.1:8000/api/
- Admin Django : http://127.0.0.1:8000/admin/
- Docs API : http://127.0.0.1:8000/api/docs/

## 🐛 Dépannage
- Port occupé : changer le port de runserver ou stopper le process.
- 401 : vérifier le token Bearer / compte.
- DB Postgres : vérifier variables si `DB_ENGINE=postgres`.

Bon dev ! 🚀
