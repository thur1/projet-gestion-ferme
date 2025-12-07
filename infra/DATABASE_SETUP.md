# Guide d'importation du schéma SQL dans Supabase

## 📋 Prérequis

- Compte Supabase actif
- Projet Supabase créé (celui utilisé pour l'auth)

## 🚀 Étapes d'importation

### Méthode 1: Via l'interface Supabase (Recommandée)

1. **Connectez-vous à Supabase**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet

2. **Ouvrez l'éditeur SQL**
   - Dans le menu latéral, cliquez sur **SQL Editor**
   - Cliquez sur **New Query**

3. **Importez le schéma**
   - Ouvrez le fichier `database-schema.sql`
   - Copiez tout le contenu
   - Collez-le dans l'éditeur SQL Supabase
   - Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

4. **Vérifiez la création**
   - Allez dans **Table Editor** dans le menu latéral
   - Vous devriez voir toutes les tables créées :
     - users
     - farms
     - buildings
     - batches
     - batch_daily_logs
     - stock_items
     - stock_movements

### Méthode 2: Via psql (ligne de commande)

```bash
# Récupérez votre connection string depuis Supabase Settings > Database
psql "postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres" -f infra/database-schema.sql
```

## 🔍 Vérifications après importation

### 1. Vérifier les tables

```sql
-- Dans SQL Editor, exécutez:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Vous devriez voir : `batches`, `batch_daily_logs`, `buildings`, `farms`, `stock_items`, `stock_movements`, `users`

### 2. Vérifier les politiques RLS

```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 3. Vérifier les triggers

```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

## 🎯 Structure créée

### Tables principales

| Table | Description | Relation principale |
|-------|-------------|---------------------|
| `users` | Profils utilisateurs | Étend `auth.users` |
| `farms` | Fermes | Appartient à `users` |
| `buildings` | Bâtiments | Appartient à `farms` |
| `batches` | Lots (animaux/cultures) | Appartient à `farms` |
| `batch_daily_logs` | Suivi journalier | Appartient à `batches` |
| `stock_items` | Articles en stock | Appartient à `farms` |
| `stock_movements` | Mouvements de stock | Modifie `stock_items` |

### Cascades configurées

- **users → farms** : `ON DELETE CASCADE` (supprimer user = supprimer fermes)
- **farms → buildings/batches/stock_items** : `ON DELETE CASCADE`
- **batches → batch_daily_logs** : `ON DELETE CASCADE`
- **stock_items → stock_movements** : `ON DELETE CASCADE`

### Fonctionnalités automatiques

✅ **Trigger `updated_at`** : Mise à jour automatique du timestamp  
✅ **Trigger création profil** : Profil créé automatiquement à l'inscription  
✅ **Trigger stock** : Stock mis à jour automatiquement lors des mouvements  
✅ **RLS** : Sécurité au niveau des lignes activée sur toutes les tables  

## 🔐 Politiques de sécurité (RLS)

- **Principe** : Les utilisateurs n'accèdent qu'à leurs propres données
- **Implémentation** : Via `auth.uid()` et les relations entre tables
- **Actions protégées** : SELECT, INSERT, UPDATE, DELETE selon la table

## 📊 Vues créées

- `stock_alerts` : Articles avec stock faible
- `active_batches_summary` : Résumé des lots actifs avec calcul des pertes

## 🧪 Tester le schéma

Après importation, testez avec ces requêtes :

```sql
-- Voir votre profil utilisateur
SELECT * FROM public.users WHERE id = auth.uid();

-- Créer une ferme de test
INSERT INTO public.farms (user_id, name, location)
VALUES (auth.uid(), 'Ma Première Ferme', 'Normandie');

-- Vérifier la ferme créée
SELECT * FROM public.farms;
```

## ⚠️ Notes importantes

1. **Extension UUID** : Le script active l'extension `uuid-ossp` automatiquement
2. **Auth.users** : Le trigger `on_auth_user_created` crée automatiquement un profil lors de l'inscription
3. **Données de test** : La section à la fin du SQL est commentée, décommentez si vous voulez des données d'exemple

## 🔧 Personnalisation

Pour modifier le schéma :
1. Éditez `database-schema.sql`
2. Ré-exécutez le script complet, ou
3. Exécutez uniquement les parties modifiées dans SQL Editor

## 📚 Prochaines étapes

1. ✅ Importer le schéma SQL
2. Créer les endpoints backend pour accéder aux données
3. Créer l'interface frontend pour gérer fermes, lots, stock, etc.
4. Implémenter les graphiques et statistiques
