# Projet de Gestion de Ferme

Projet full-stack en mono-repo pour la gestion de ferme avec React, Node.js, et PostgreSQL.

## 📁 Structure du Projet

```
projet-de-gestion-de-ferme/
├── frontend/           # Application React + Vite + Tailwind CSS
├── backend/            # API Node.js + Express (Clean Architecture)
├── infra/              # Configuration Docker (Dockerfile + docker-compose)
└── .github/
    └── workflows/      # CI/CD GitHub Actions
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 24.x ou supérieur
- Docker & Docker Compose (optionnel)
- Git

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd projet-de-gestion-de-ferme
```

2. **Installer les dépendances**

Frontend:
```bash
cd frontend
npm install
```

Backend:
```bash
cd backend
npm install
```

### Développement Local

#### Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
➡️ Application disponible sur http://localhost:5173

#### Backend (Node.js + Express)
```bash
cd backend
npm run dev
```
➡️ API disponible sur http://localhost:3000

### Avec Docker

Lancer tous les services (backend + base de données):
```bash
cd infra
docker-compose up -d
```

Services disponibles:
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

## 🏗️ Architecture

### Frontend
- **Framework**: React 19 avec TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Linting**: ESLint

### Backend (Clean Architecture)

```
backend/src/
├── domain/              # Entités et interfaces métier
│   ├── entities/        # Farm, Animal, etc.
│   └── repositories/    # Interfaces de repositories
├── application/         # Cas d'usage (Use Cases)
│   └── use-cases/       # GetAllFarms, CreateFarm, etc.
├── infrastructure/      # Implémentations techniques
│   └── repositories/    # InMemoryFarmRepository, PostgresFarmRepository
└── presentation/        # Couche HTTP
    ├── controllers/     # FarmController
    └── routes/          # Définition des routes
```

**Principe**: La logique métier (domain) ne dépend d'aucune couche externe.

### Infrastructure
- **Base de données**: PostgreSQL 16
- **Conteneurisation**: Docker
- **Orchestration**: Docker Compose

## 📝 Scripts Disponibles

### Frontend
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run lint` - Vérification du code
- `npm run preview` - Prévisualisation du build

### Backend
- `npm run dev` - Serveur de développement avec hot-reload
- `npm run build` - Compilation TypeScript
- `npm start` - Démarrage en production
- `npm run lint` - Vérification du code
- `npm test` - Lancer les tests

## 🧪 Tests & CI/CD

GitHub Actions CI configuré pour:
- ✅ Build frontend et backend
- ✅ Linting
- ✅ Tests unitaires
- ✅ Build Docker

Le pipeline se déclenche sur les push/PR vers `main` et `develop`.

## 🔧 Configuration

### Variables d'environnement

Backend (`.env`):
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/ferme_db
```

Voir `backend/.env.example` pour plus de détails.

## 📚 Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Infrastructure README](./infra/README.md)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT
