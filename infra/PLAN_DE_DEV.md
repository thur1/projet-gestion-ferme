## Plan de développement (élevage) – Mise à jour Phase 2

### 1. Vision produit (élevage uniquement)
Objectif : plateforme de gestion multi-fermes / multi-espèces utilisable sur le terrain, par du personnel non technique, avec traçabilité complète.
Espèces couvertes : volaille (chair, pondeuses), porcin, bovin viande, bovin laitier, autres ruminants (optionnel).

### 2. Architecture technique
Backend : Django + DRF (JWT + RBAC). Frontend : React + Vite (PWA offline). DB : PostgreSQL. Cache/queue : Redis + Celery (à prévoir phase suivante).

### 3. Modèle multi-fermes / multi-espèces (critique)
Entreprise → Fermes → Unités (1 espèce par unité). Exemple : Ferme A avec bâtiment volaille chair, pondeuses, porcherie, étable lait.

### 4. Modules fonctionnels
- Unités d’élevage : capacité, conditions, historique d’occupation.
- Lots / animaux par espèce : entrée, effectif, mortalité, conso aliment, ponte, réformes/sorties.
- Reproduction : insémination/saillie, gestation, mise-bas, performances repro.
- Santé : maladies, vaccins, traitements, ordonnances, quarantaine, alertes (traçabilité obligatoire).
- Alimentation : rations, conso jour/lot, coûts, IC.
- Stocks : aliments, médicaments, matériel, seuils d’alerte, mouvements.
- KPI : mortalité %, GMQ, IC, lait/jour, taux de ponte, rentabilité par lot.
- Finances : coûts (alimentaires, véto), recettes, marge par espèce/ferme.

### 5. UX / UI (terrain-friendly)
1 action = 1 écran, saisie rapide, boutons larges, offline, icônes par espèce. Écrans clés : dashboard ferme, fiche lot, entrée journalière, alertes, résumé mensuel.

### 6. Modèle de données (simplifié)
Enterprise, Farm, Unit, Species, Lot, HealthEvent, Feeding, Stock, FinancialEntry, AuditLog.

### 7. Sécurité / traçabilité
Permissions par ferme, audit des actions, export officiel.

### 8. Mobile / Offline
PWA, sync différée, IndexedDB, gestion de conflits.

### 9. Reporting
Registre sanitaire, registre d’élevage, rapports véto, exports officiels.

### 10. Roadmap
- Phase 1 (MVP volaille/bovin) ✅ : lots, santé, alimentation, dashboard, PWA offline, auth (remplacée par JWT DRF en phase 2), design system.
- Phase 2 (en cours) 🚧 : aligner frontend sur backend Django (JWT), routes `/api/auth/login|register|refresh`, ressources farms/units/lots/stock, sécuriser appels, initialiser données de base (enterprise/farm/species), affichage liste/CRUD minimal dans frontend.
- Phase 3 (premium) 🔜 : IA prédictive, IoT, mobile native.

### 11. Phase 2 – plan d’action détaillé
1) Auth & config
	- Basculer `VITE_API_BASE_URL` vers `http://127.0.0.1:8000/api/`.
	- Adapter service auth frontend pour JWT DRF (`/auth/login/`, `/auth/register/`, `/auth/refresh/`).
	- Stockage tokens (access/refresh) + refresh auto.
2) Connexions API métier
	- Endpoints farms/units/lots/stock alignés sur backend Django (DRF) avec headers `Authorization: Bearer <token>`.
	- Health check `/api/health/` pour état backend.
3) Données de base
	- Créer species de référence (poultry, pig, bovine) via admin ou fixtures.
	- Créer enterprise + farm + unit pour tests.
4) Frontend
	- Adapter pages Login/Register pour le flux JWT.
	- Lister fermes / lots / stock en lecture (MVP) à partir de l’API Django.
	- Gérer erreurs réseau (“Failed to fetch”) et état loading.
5) QA
	- Vérifier login/logout/refresh.
	- Build frontend (`npm run build`) et tests manuels basiques.

### 12. Checklist
✔ Multi-fermes / multi-espèces (modèle) · ✔ PWA offline · ✔ Traçabilité · ⏳ Connexion frontend ↔ backend Django (phase 2 en cours) · ⏳ CRUD métier alignés DRF.