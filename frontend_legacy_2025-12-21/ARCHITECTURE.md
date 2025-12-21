# Architecture Frontend - Gestion de Ferme
⚠️ Document legacy (stack Supabase/Node). Voir README et QUICK_START pour la stack Django + JWT actuelle.

## 📐 Vue d'Ensemble

Architecture **modulaire mobile-first** optimisée pour:
- ✅ Connexions faibles (zones rurales africaines)
- ✅ Support offline-first avec PWA
- ✅ Scalabilité et maintenabilité
- ✅ Code splitting automatique

## 🗂️ Structure des Dossiers

```
frontend/src/
│
├── app/                          # Configuration globale
│   ├── App.tsx                   # Point d'entrée principal
│   ├── providers.tsx             # Providers React (Auth, Theme, etc.)
│   └── router.tsx                # Configuration des routes
│
├── features/                     # Modules métier (domain-driven)
│   ├── auth/                     # Authentification
│   │   ├── components/           # ProtectedRoute, LoginForm
│   │   ├── hooks/                # useAuth
│   │   └── types.ts
│   │
│   ├── poultry/                  # 🐔 Aviculture
│   │   ├── components/           # LotCard, DailyLogForm
│   │   ├── hooks/                # useLots, useDailyLogs
│   │   ├── services/             # API calls spécifiques
│   │   └── types.ts
│   │
│   ├── pigs/                     # 🐷 Porcin
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   │
│   └── stock/                    # 📦 Stock
│       ├── components/
│       ├── hooks/
│       └── types.ts
│
├── shared/                       # Code partagé
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── layout/               # AppLayout, Header, Sidebar
│   │   └── common/               # EmptyState, StatCard, LoadingStates
│   │
│   ├── hooks/                    # Hooks réutilisables
│   │   ├── useOnlineStatus.ts
│   │   ├── useLocalStorage.ts
│   │   └── useApi.ts
│   │
│   ├── services/
│   │   ├── api/                  # Client HTTP + services API
│   │   ├── storage/              # IndexedDB wrapper
│   │   └── offline/              # Queue offline, sync
│   │
│   ├── types/                    # Types globaux
│   │   └── index.ts
│   │
│   └── utils/                    # Utilitaires
│       └── cn.ts (classnames)
│
├── pages/                        # Pages routées (legacy, à migrer)
│   ├── Login.tsx
│   ├── Register.tsx
│   └── ModernDashboard.tsx
│
├── config/                       # Configuration
│   ├── constants.ts              # Constantes globales
│   ├── routes.ts                 # Définition des routes
│   └── env.ts                    # Variables d'environnement
│
├── styles/                       # Design System
│   ├── tokens.css                # Design tokens
│   └── components.css            # Styles globaux
│
└── lib/                          # Configurations tierces
    ├── supabase.ts
    └── utils.ts
```

## 🎯 Principes d'Architecture

### 1. **Feature-First Organization**
Chaque module métier (`features/`) contient:
- Ses propres composants
- Ses hooks spécifiques
- Ses services API
- Ses types TypeScript

**Avantage:** Isolation, tests faciles, code splitting automatique.

### 2. **Shared Infrastructure**
Code réutilisable entre features dans `shared/`:
- Composants UI génériques
- Hooks utilitaires
- Services transverses (API, storage)

### 3. **Centralized Configuration**
`config/` contient toutes les constantes:
- Routes
- API endpoints
- Seuils d'alertes
- Variables d'environnement

## 🔄 Flux de Données

```
User Interaction
      ↓
   Component (features/)
      ↓
   Hook (useApi, useAuth)
      ↓
   Service (shared/services/api)
      ↓
   API Backend
      ↓
   Supabase/PostgreSQL
```

### Exemple: Créer un lot

```typescript
// features/poultry/components/CreateLotForm.tsx
import { batchesApi } from '@/shared/services/api';

function CreateLotForm() {
  const handleSubmit = async (data) => {
    const { data: batch, error } = await batchesApi.create(data);
    // ...
  };
}
```

## 🎨 Design System

### Tokens de couleurs

```typescript
// config/constants.ts
colors: {
  primary: '#2E8B57',      // Vert forêt
  secondary: '#FFB74D',    // Orange
  danger: '#E53935',
  success: '#2E7D32',
}
```

### Composants réutilisables

| Composant | Usage |
|-----------|-------|
| `StatCard` | Afficher métriques clés |
| `EmptyState` | Listes vides |
| `LoadingStates` | Spinners, skeletons |
| `AppLayout` | Layout avec sidebar |

## 📱 Mobile-First

### Responsive Design

```tsx
// Toujours mobile d'abord
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

### Touch-Friendly

```typescript
// config/constants.ts
minHeight: {
  touch: '44px',    // Recommandation Apple
  button: '48px',   // Recommandation Android
}
```

## 🔌 Offline-First

### Service Worker (Phase 0.4)
```typescript
// shared/services/offline/worker.ts
- Cache assets statiques
- Queue actions offline
- Sync automatique reconnexion
```

### IndexedDB (Phase 0.4)
```typescript
// shared/services/storage/
- Persist données critiques
- Fallback si API down
```

## 📦 Imports Recommandés

### ✅ Faire
```typescript
import { Button, Card } from '@/shared/components';
import { useApi, useOnlineStatus } from '@/shared/hooks';
import { ROUTES, API_CONFIG } from '@/config';
import type { Batch, Farm } from '@/shared/types';
```

### ❌ Éviter
```typescript
import Button from '../../shared/components/ui/button';
import { useAuth } from '../../../contexts/AuthContext';
```

## 🧪 Tests (Phase future)

```
features/poultry/
├── components/
│   ├── LotCard.tsx
│   └── LotCard.test.tsx         # Tests unitaires
├── hooks/
│   ├── useLots.ts
│   └── useLots.test.ts
└── __tests__/
    └── integration.test.tsx      # Tests d'intégration
```

## 🚀 Performance

### Code Splitting
```typescript
// app/router.tsx
const PoultryPage = lazy(() => import('@/features/poultry/components/PoultryPage'));
```

### Bundle Size Targets
- Initial load: < 200KB gzipped
- Feature chunk: < 50KB
- Total: < 500KB

## 🔐 Sécurité

### Protected Routes
```typescript
<ProtectedRoute>
  <AppLayout />
</ProtectedRoute>
```

### API Tokens
```typescript
// Géré automatiquement par useAuth
apiClient.setAuthToken(session.access_token);
```

## 📝 Conventions

### Naming
- **Components:** PascalCase (`LotCard.tsx`)
- **Hooks:** camelCase avec `use` (`useLots.ts`)
- **Utils:** camelCase (`formatDate.ts`)
- **Types:** PascalCase (`Batch`, `User`)

### File Organization
- Un composant = un fichier
- Index files pour exports groupés
- Co-located tests

## 🛣️ Migration Path

### Phase 0 (Actuelle)
- ✅ Structure créée
- ✅ Services API
- ✅ Hooks de base
- ⏳ PWA à venir

### Phase 1
- Migrer pages vers features/
- Créer hooks métier
- Ajouter tests

### Phase 2
- Offline complet
- Optimisations performance
- Analytics

## 📚 Ressources

- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Supabase](https://supabase.com/docs)

---

**Maintenu par:** Équipe Dev Gestion de Ferme  
**Dernière mise à jour:** Décembre 2025
