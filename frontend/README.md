# Frontend - Gestion de Ferme

Application web React avec Vite et Tailwind CSS.

## 🚀 Démarrage

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```
➡️ Application disponible sur http://localhost:5173

### Production
```bash
npm run build
npm run preview
```

## 🛠️ Technologies

- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **ESLint** - Linting

## 📁 Structure

```
src/
├── assets/         # Images, fonts, etc.
├── components/     # Composants React réutilisables
├── pages/          # Pages de l'application
├── services/       # Services API
├── hooks/          # Custom hooks
├── utils/          # Utilitaires
├── App.tsx         # Composant racine
├── main.tsx        # Point d'entrée
└── index.css       # Styles globaux Tailwind
```

## 📝 Scripts

- `npm run dev` - Serveur de développement avec HMR
- `npm run build` - Build de production
- `npm run lint` - Vérification du code
- `npm run preview` - Prévisualisation du build de production

## 🎨 Tailwind CSS

Tailwind est configuré et prêt à l'emploi. Les directives sont dans `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Configuration dans `tailwind.config.js`.

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du frontend:

```env
VITE_API_URL=http://localhost:3000/api
```

Accès dans le code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 📦 Build

Le build de production est optimisé et minifié:

```bash
npm run build
```

Les fichiers sont générés dans le dossier `dist/`.
