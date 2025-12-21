# API Django (Phase 1)

- Base URL (dev): `http://localhost:8000/api/` (configurer `VITE_API_BASE_URL`).
- Auth: `/auth/login`, `/auth/register`, `/auth/refresh` (JWT Bearer).
- Ressources principales:
  - `/enterprises`, `/farms?enterprise_id=...`, `/units?farm_id=...`, `/lots?farm_id=...&unit_id=...&species=...&status=...`
  - `/lot-records?lot_id=...&date_from=...&date_to=...`
  - `/health-events?lot_id=...`
  - `/stock-items?farm_id=...`
  - `/stock-movements?farm_id=...&stock_item_id=...`
  - `/species` (lecture seule)
- Dashboard: `/dashboard/summary?farm_id=...` (retourne lots actifs, mortalité 7j, conso alim 7j, lait 7j, œufs 7j, alertes stock).
- Permissions (Phase 1) :
  - Lecture: membres ou owner de l'entreprise.
  - Écriture: rôles `owner` ou `admin` (owner créé automatiquement à la création d'entreprise).
- Offline: aligner IndexedDB/queues sur les routes ci-dessus (mutations POST/PUT/DELETE à enqueuer, GET à cacher selon besoins PWA).
