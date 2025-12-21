# Guide de configuration base de données (Django)

Deux options :
- **SQLite** (par défaut) : rien à faire, `python manage.py migrate` suffit.
- **PostgreSQL** (recommandé en prod) : utiliser Docker Compose ou une instance Postgres existante.

## Option A — SQLite (rapide)
```bash
cd backend_django
python manage.py migrate
```

## Option B — PostgreSQL local via Docker Compose
```bash
cd infra
docker-compose up -d database
# DB disponible sur localhost:5432 (user/password/ferme_db)
```

Configurer le backend pour Postgres (fichier `.env` du backend_django) :
```env
DB_ENGINE=postgres
POSTGRES_DB=ferme_db
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

Appliquer les migrations :
```bash
cd backend_django
python manage.py migrate
```

## Option C — PostgreSQL existant (hébergé)
1. Créez une base vide.
2. Renseignez la connexion dans `.env` (voir ci-dessus, adapter host/port/identifiants).
3. Exécutez `python manage.py migrate`.

## Vérifications utiles (PostgreSQL)
Lister les tables :
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
```

Vérifier les migrations :
```sql
SELECT * FROM django_migrations ORDER BY applied DESC;
```

## Notes
- Les modèles Django pilotent le schéma : pas besoin d'importer `database-schema.sql`.
- Pour préremplir des données, créez des fixtures ou utilisez l'admin Django.
