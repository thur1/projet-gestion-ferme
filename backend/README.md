# Backend API - Gestion de Ferme

API REST avec architecture propre (Clean Architecture) pour la gestion de ferme.

## 🏗️ Architecture

### Clean Architecture - Couches

```
src/
├── domain/              # Couche Domaine (Logique Métier)
│   ├── entities/        # Entités métier (Farm, Animal, etc.)
│   └── repositories/    # Interfaces de repositories
│
├── application/         # Couche Application (Cas d'Usage)
│   └── use-cases/       # Use cases (GetAllFarms, CreateFarm, etc.)
│
├── infrastructure/      # Couche Infrastructure (Détails Techniques)
│   └── repositories/    # Implémentations (InMemory, Postgres, etc.)
│
└── presentation/        # Couche Présentation (HTTP/API)
    ├── controllers/     # Contrôleurs
    └── routes/          # Définition des routes
```

### Principes

- **Indépendance**: Le domaine ne dépend d'aucune autre couche
- **Inversion de dépendances**: Les dépendances pointent vers le domaine
- **Testabilité**: Chaque couche peut être testée indépendamment

## 🚀 Démarrage

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /health
```
Retourne le statut de l'API.

### Farms

**Lister toutes les fermes**
```
GET /api/farms
```

**Créer une ferme**
```
POST /api/farms
Content-Type: application/json

{
  "name": "Ferme du Soleil",
  "location": "Normandie"
}
```

## 🧪 Tests

```bash
npm test
```

## 🔧 Configuration

Variables d'environnement (`.env`):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/ferme_db
```

Voir `.env.example` pour un template complet.

## 📦 Dépendances

### Production
- `express` - Framework web
- `cors` - Gestion CORS
- `dotenv` - Variables d'environnement
- `pg` - Client PostgreSQL
- `zod` - Validation de schémas

### Développement
- `typescript` - Typage statique
- `tsx` - Exécution TypeScript avec hot-reload
- `eslint` - Linting

## 🐳 Docker

Voir le dossier `infra/` pour la configuration Docker.

## 📝 Scripts

- `npm run dev` - Développement avec hot-reload
- `npm run build` - Compilation TypeScript
- `npm start` - Démarrage production
- `npm test` - Lancer les tests
- `npm run lint` - Vérification du code
