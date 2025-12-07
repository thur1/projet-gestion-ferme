# Supabase Authentication - Configuration

## 📋 Prérequis

1. **Créer un compte Supabase** : https://supabase.com
2. **Créer un nouveau projet** dans le dashboard Supabase

## 🔧 Configuration

### 1. Récupérer les identifiants Supabase

Dans votre projet Supabase :
- Allez dans **Settings** → **API**
- Copiez :
  - `Project URL` (ex: https://xxxxx.supabase.co)
  - `anon public` key

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du frontend :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key_ici
```

### 3. Configurer l'authentification dans Supabase

Dans le dashboard Supabase :
- **Authentication** → **Settings**
- Activez **Email Auth**
- Configurez les **Email Templates** si nécessaire
- Configurez **Redirect URLs** (optionnel) :
  - `http://localhost:5173/**`

## 🚀 Utilisation

### Pages disponibles

- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/dashboard` - Page protégée (nécessite authentification)

### Hook useAuth()

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth();
  
  // user contient les infos de l'utilisateur connecté
  // signIn(email, password) pour se connecter
  // signOut() pour se déconnecter
  // loading indique si l'auth est en cours de chargement
}
```

### Protection de routes

```typescript
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  }
/>
```

## 🔐 Sécurité

- ✅ Token stocké dans cookie HttpOnly
- ✅ Cookie avec flag Secure (HTTPS)
- ✅ Cookie avec SameSite=strict
- ✅ Redirection automatique si non authentifié
- ✅ Gestion de session avec Supabase

## 🧪 Tester

1. Lancez le frontend : `npm run dev`
2. Allez sur http://localhost:5173
3. Créez un compte sur `/register`
4. Vérifiez votre email (si confirmation activée dans Supabase)
5. Connectez-vous sur `/login`
6. Vous serez redirigé vers `/dashboard`

## 📝 Notes

- Les cookies sont automatiquement gérés par le contexte d'authentification
- La session persiste entre les rechargements de page
- Le token est automatiquement rafraîchi par Supabase
