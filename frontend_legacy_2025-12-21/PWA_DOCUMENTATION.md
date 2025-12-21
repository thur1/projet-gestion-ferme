# PWA Configuration - Farm Manager

## Vue d'ensemble

L'application Farm Manager est configurée comme Progressive Web App (PWA) avec des capacités offline complètes, optimisée pour une utilisation mobile dans des zones à faible connectivité.

## Fonctionnalités PWA

### ✅ Installable
- **Standalone Mode**: L'app s'exécute dans sa propre fenêtre
- **Add to Home Screen**: Icône sur l'écran d'accueil
- **Splash Screen**: Écran de démarrage avec branding
- **Orientation Portrait**: Optimisé pour usage mobile

### ✅ Offline-First
- **Service Worker**: Mise en cache intelligente des ressources
- **IndexedDB**: Base de données locale pour données métier
- **Offline Queue**: File d'attente pour synchronisation différée
- **Background Sync**: Synchronisation automatique au retour en ligne

### ✅ Caching Strategy

#### API Calls (NetworkFirst - 5min TTL)
```typescript
{
  urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
  handler: 'NetworkFirst',
  options: {
    cacheName: 'api-cache',
    expiration: {
      maxEntries: 100,
      maxAgeSeconds: 5 * 60 // 5 minutes
    },
    networkTimeoutSeconds: 10
  }
}
```

#### Images (CacheFirst - 30 jours)
```typescript
{
  urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  handler: 'CacheFirst',
  options: {
    cacheName: 'images-cache',
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 30 * 24 * 60 * 60 // 30 jours
    }
  }
}
```

#### Fonts (CacheFirst - 1 an)
```typescript
{
  urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/,
  handler: 'CacheFirst',
  options: {
    cacheName: 'fonts-cache',
    expiration: {
      maxAgeSeconds: 365 * 24 * 60 * 60 // 1 an
    }
  }
}
```

## Architecture Offline

### IndexedDB Stores

```typescript
const STORES = {
  FARMS: 'farms',              // Fermes de l'utilisateur
  BATCHES: 'batches',          // Lots avicoles/porcins
  DAILY_LOGS: 'daily_logs',    // Journaux quotidiens
  STOCK_ITEMS: 'stock_items',  // Articles en stock
  OFFLINE_QUEUE: 'offline_queue', // Actions en attente
  METADATA: 'metadata'         // Métadonnées (lastSyncTime, etc.)
};
```

### Services

#### 1. IndexedDB Service (`shared/services/storage/indexedDB.ts`)
- **Singleton Pattern**: Une seule instance globale
- **CRUD Operations**: add, put, get, getAll, delete, clear
- **Indexes**: Recherche rapide par clés secondaires
- **Metadata**: Stockage clé-valeur pour configuration

#### 2. Offline Queue Service (`shared/services/offline/queue.ts`)
- **File d'attente**: Stocke les actions échouées (CREATE, UPDATE, DELETE)
- **Retry Logic**: 3 tentatives avant échec définitif
- **Auto-processing**: Traitement toutes les 30 secondes
- **Status Tracking**: pending → processing → completed/failed

#### 3. Sync Service (`shared/services/offline/sync.ts`)
- **Full Sync**: Farms + Batches + Stock depuis l'API
- **Incremental Sync**: Replay des actions de la queue
- **Conflict Resolution**: Last-write-wins strategy
- **Auto-sync**: Synchronisation toutes les 60 secondes
- **Event-driven**: Sync au retour en ligne

## Hooks React

### useOfflineQueue
```typescript
const { pendingCount, actions, retryFailed, clearQueue } = useOfflineQueue();
```

### useSync
```typescript
const { status, sync, isSyncing } = useSync();
// status: { isSync, lastSyncTime, pendingChanges, error? }
```

### useOnlineStatus
```typescript
const isOnline = useOnlineStatus();
```

## Composants UI

### SyncIndicator
- Affiche le statut de synchronisation dans la barre d'en-tête
- Dropdown avec détails: dernière sync, actions en attente, erreurs
- Boutons: "Synchroniser maintenant", "Réessayer les échecs"

### ReloadPrompt
- Toast de notification pour nouvelles versions
- Bouton "Mettre à jour" pour recharger l'app
- Auto-dismiss après 30 secondes

### OnlineIndicator
- Badge vert "En ligne" / orange "Hors ligne"
- Visible dans AppLayout header

## Workflow d'utilisation

### Mode Online
1. Utilisateur fait une action (créer ferme, ajouter lot, etc.)
2. Requête API immédiate
3. Mise à jour locale en cas de succès
4. Sync automatique toutes les 60s

### Mode Offline
1. Utilisateur fait une action
2. **Sauvegarde locale** dans IndexedDB
3. **Ajout à la queue** offline
4. UI mise à jour immédiatement (ID temporaire)
5. Badge "X en attente" affiché

### Retour en ligne
1. Event `online` détecté
2. **Auto-sync** démarré après 1s
3. **Queue processing**: replay des actions
4. **Full sync**: récupération depuis API
5. **Résolution conflits**: last-write-wins
6. Badge "Synchronisé" ✅

## Configuration du Service Worker

### vite.config.ts
```typescript
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['icon-*.png'],
  manifest: {
    name: 'Farm Manager - Gestion de Ferme',
    short_name: 'Farm Manager',
    theme_color: '#2E8B57',
    icons: [
      { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  workbox: {
    runtimeCaching: [/* ... */]
  }
})
```

## Tests PWA

### Chrome DevTools
1. **Application Tab** → Service Workers
   - Vérifie le statut "activated and is running"
2. **Application Tab** → Manifest
   - Vérifie les propriétés du manifest
3. **Network Tab** → Offline
   - Teste l'app sans connexion
4. **Lighthouse** → PWA audit
   - Score cible: > 90/100

### Fonctionnalités à tester

- [ ] Installation sur écran d'accueil
- [ ] Fonctionnement offline complet
- [ ] Synchronisation au retour en ligne
- [ ] Persistance des données après fermeture
- [ ] Notification de mise à jour
- [ ] Performance (First Paint < 2s)
- [ ] Responsive mobile (320px - 768px)

## Performance Targets

| Métrique | Target | Actual |
|----------|--------|--------|
| First Contentful Paint | < 1.8s | - |
| Time to Interactive | < 3.8s | - |
| Speed Index | < 3.4s | - |
| Total Blocking Time | < 200ms | - |
| Cumulative Layout Shift | < 0.1 | - |

## Best Practices

### ✅ DO
- Toujours vérifier `navigator.onLine` avant requête
- Gérer les erreurs réseau gracieusement
- Afficher le statut sync à l'utilisateur
- Limiter la taille du cache (maxEntries)
- Nettoyer les anciennes données (TTL)

### ❌ DON'T
- Ne pas bloquer l'UI pendant la sync
- Ne pas faire confiance à `navigator.onLine` seul
- Ne pas stocker de données sensibles en clair
- Ne pas oublier de gérer les conflits
- Ne pas surcharger IndexedDB (> 50MB)

## Troubleshooting

### Service Worker ne s'enregistre pas
```bash
# Vérifier la console
# Erreur commune: scope invalide
# Solution: Servir depuis /
npm run dev -- --host
```

### Cache obsolète
```javascript
// Forcer la mise à jour
await caches.keys().then(names => {
  return Promise.all(names.map(name => caches.delete(name)));
});
```

### IndexedDB corruption
```javascript
// Réinitialiser la base
await syncService.clearLocalData();
await indexedDB.init();
```

## Ressources

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Service Worker Lifecycle](https://web.dev/service-worker-lifecycle/)

## Déploiement

### Prérequis
1. HTTPS obligatoire (sauf localhost)
2. Service Worker à la racine (/)
3. Manifest accessible
4. Icônes générées (192x192, 512x512)

### Checklist
- [ ] `npm run build` sans erreurs
- [ ] Tester en mode production localement
- [ ] Vérifier Lighthouse score
- [ ] Tester installation iOS/Android
- [ ] Valider offline sur mobile réel
- [ ] Monitoring sync errors (Sentry/LogRocket)

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2024  
**Contact**: [GitHub](https://github.com/thur1/projet-gestion-ferme)
