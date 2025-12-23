const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/'
const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'

export function getTokens() {
  return {
    access: localStorage.getItem(ACCESS_KEY) || undefined,
    refresh: localStorage.getItem(REFRESH_KEY) || undefined,
  }
}

function setTokens(tokens?: { access?: string; refresh?: string }) {
  if (tokens?.access) {
    localStorage.setItem(ACCESS_KEY, tokens.access)
  }
  if (tokens?.refresh) {
    localStorage.setItem(REFRESH_KEY, tokens.refresh)
  }
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function hasAccessToken() {
  return Boolean(localStorage.getItem(ACCESS_KEY))
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(new URL(path, baseURL).toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    ...init,
  })

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : null

  if (!res.ok) {
    const message = (data as { detail?: string } | null)?.detail || res.statusText
    throw new Error(message)
  }

  return data as T
}

function unwrapList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[]
  if (value && typeof value === 'object' && Array.isArray((value as { results?: unknown }).results)) {
    return (value as { results: T[] }).results
  }
  return []
}

async function refreshAccessToken() {
  const { refresh } = getTokens()
  if (!refresh) {
    clearTokens()
    throw new Error('Refresh token manquant')
  }
  const res = await request<LoginResponse>('auth/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  })
  setTokens({ access: res.access, refresh: res.refresh ?? refresh })
  return res.access
}

async function requestAuth<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const { access } = getTokens()
  const res = await fetch(new URL(path, baseURL).toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...init.headers,
    },
    ...init,
  })

  if (res.status === 401 && retry) {
    try {
      await refreshAccessToken()
      return requestAuth<T>(path, init, false)
    } catch {
      clearTokens()
      throw new Error('Session expirée, reconnectez-vous')
    }
  }

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : null

  if (!res.ok) {
    const message = (data as { detail?: string } | null)?.detail || res.statusText
    throw new Error(message)
  }

  return data as T
}

export function healthCheck() {
  return request<{ status: string }>('health/')
}

export interface LoginResponse {
  access: string
  refresh: string
}

export function login(email: string, password: string) {
  return request<LoginResponse>('auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function register(email: string, password: string) {
  return request<LoginResponse>('auth/register/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function storeTokens(tokens: LoginResponse) {
  setTokens(tokens)
}

export type DashboardSummary = {
  total_lots: number
  active_lots: number
  mortality_7d: number
  mortality_rate_percent_7d: number
  feed_intake_kg_7d: number
  milk_production_l_7d: number
  eggs_count_7d: number
  eggs_per_hen_per_day: number
  avg_daily_gain_kg: number
  feed_conversion_ratio: number | null
  farm_margin_30d: number
  lot_margins_30d: Array<{ lot_id: string; lot_code: string; margin: number }>
  stock_alerts: Array<{ id: string; name: string; quantity: number; unit: string; alert_threshold: number }>
}

export interface Enterprise {
  id: string
  name: string
  owner: string
}

export function listEnterprises() {
  return requestAuth<unknown>('enterprises/').then((res) => unwrapList<Enterprise>(res))
}

export type CreateEnterprisePayload = Pick<Enterprise, 'name'>

export function createEnterprise(payload: CreateEnterprisePayload) {
  return requestAuth<Enterprise>('enterprises/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface Farm {
  id: string
  name: string
  location?: string
  enterprise: string
}

export function listFarms(params?: { enterprise_id?: string }) {
  const search = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
  return requestAuth<unknown>(`farms/${search}`).then((res) => unwrapList<Farm>(res))
}

export type CreateFarmPayload = Pick<Farm, 'enterprise' | 'name' | 'location'>

export function createFarm(payload: CreateFarmPayload) {
  return requestAuth<Farm>('farms/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface Species {
  id: string
  code: string
  name: string
  breeding_type: string
}

export function listSpecies(params?: { breeding_type?: string }) {
  const search = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
  return requestAuth<unknown>(`species/${search}`).then((res) => unwrapList<Species>(res))
}

export type CreateSpeciesPayload = Pick<Species, 'code' | 'name' | 'breeding_type'>

export function createSpecies(payload: CreateSpeciesPayload) {
  return requestAuth<Species>('species/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface BreedingType {
  id: string
  code: string
  name: string
}

export function listBreedingTypes() {
  return requestAuth<unknown>('breeding-types/').then((res) => unwrapList<BreedingType>(res))
}

export interface Unit {
  id: string
  farm: string
  breeding_type: string
  species?: string | null
  name: string
  capacity: number
  conditions?: Record<string, unknown>
  created_at?: string
}

export function listUnits(params?: { farm_id?: string; breeding_type?: string }) {
  const search = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
  return requestAuth<unknown>(`units/${search}`).then((res) => unwrapList<Unit>(res))
}

export type CreateUnitPayload = Omit<Unit, 'id' | 'created_at'>

export function createUnit(payload: CreateUnitPayload) {
  return requestAuth<Unit>('units/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchDashboardSummary(farmId: string) {
  const search = new URLSearchParams({ farm_id: farmId })
  return requestAuth<DashboardSummary>(`dashboard/summary/?${search.toString()}`)
}

// Types métier (minimaux)
export interface Lot {
  id: string
  unit: string
  species: string
  code: string
  entry_date: string
  initial_count: number
  status: 'active' | 'closed'
  destination?: string
}

export function listLots(params?: { farm_id?: string; unit_id?: string; species?: string; status?: string }) {
  const search = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
  return requestAuth<unknown>(`lots/${search}`).then((res) => unwrapList<Lot>(res))
}

export type CreateLotPayload = Omit<Lot, 'id'>

export function createLot(payload: CreateLotPayload) {
  return requestAuth<Lot>('lots/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Suivi journalier des lots (alimentation / mortalité / production)
export interface LotDailyRecord {
  id: string
  lot: string
  date: string
  mortality: number
  feed_intake_kg: number
  milk_production_l: number
  eggs_count: number
  avg_weight_kg: number
  notes?: string
}

export function listLotRecords(params?: { lot_id?: string; date_from?: string; date_to?: string }) {
  const filtered = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ) as Record<string, string>
  const search = Object.keys(filtered).length ? `?${new URLSearchParams(filtered).toString()}` : ''
  return requestAuth<unknown>(`lot-records/${search}`).then((res) => unwrapList<LotDailyRecord>(res))
}

export type CreateLotRecordPayload = Omit<LotDailyRecord, 'id'>

export function createLotRecord(payload: CreateLotRecordPayload) {
  return requestAuth<LotDailyRecord>('lot-records/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface HealthEvent {
  id: string
  lot: string
  event_type: 'vaccination' | 'treatment' | 'disease'
  date: string
  product?: string
  dose?: string
  veterinarian?: string
  notes?: string
}

export function listHealthEvents(params?: { lot_id?: string; date_from?: string; date_to?: string }) {
  const filtered = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ) as Record<string, string>
  const search = Object.keys(filtered).length ? `?${new URLSearchParams(filtered).toString()}` : ''
  return requestAuth<unknown>(`health-events/${search}`).then((res) => unwrapList<HealthEvent>(res))
}

export type CreateHealthEventPayload = Omit<HealthEvent, 'id'>

export function createHealthEvent(payload: CreateHealthEventPayload) {
  return requestAuth<HealthEvent>('health-events/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface StockItem {
  id: string
  farm: string
  name: string
  item_type: string
  quantity: number
  unit: string
  alert_threshold: number
}

export function listStockItems(params?: { farm_id?: string }) {
  const search = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
  return requestAuth<unknown>(`stock-items/${search}`).then((res) => unwrapList<StockItem>(res))
}

export type CreateStockItemPayload = Omit<StockItem, 'id'>

export function createStockItem(payload: CreateStockItemPayload) {
  return requestAuth<StockItem>('stock-items/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface StockMovement {
  id: string
  stock_item: string
  movement_type: 'in' | 'out'
  quantity: number
  date: string
  lot?: string | null
  reason?: string
}

export type CreateStockMovementPayload = Omit<StockMovement, 'id'>

export function listStockMovements(params?: { farm_id?: string; stock_item_id?: string }) {
  const search = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
  return requestAuth<unknown>(`stock-movements/${search}`).then((res) => unwrapList<StockMovement>(res))
}

export function createStockMovement(payload: CreateStockMovementPayload) {
  return requestAuth<StockMovement>('stock-movements/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Reproduction
export interface ReproductionEvent {
  id: string
  lot: string
  date: string
  event_type: 'insemination' | 'saillie' | 'gestation_check' | 'mise_bas'
  gestation_days?: number | null
  born_alive: number
  born_dead: number
  notes?: string
}

export function listReproductionEvents(params?: { lot_id?: string }) {
  const filtered = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ) as Record<string, string>
  const search = Object.keys(filtered).length ? `?${new URLSearchParams(filtered).toString()}` : ''
  return requestAuth<unknown>(`reproduction-events/${search}`).then((res) => unwrapList<ReproductionEvent>(res))
}

export type CreateReproductionEventPayload = Omit<ReproductionEvent, 'id'>

export function createReproductionEvent(payload: CreateReproductionEventPayload) {
  return requestAuth<ReproductionEvent>('reproduction-events/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Finances
export interface FinancialEntry {
  id: string
  farm: string
  lot?: string | null
  date: string
  entry_type: 'cost' | 'revenue'
  category: 'feed' | 'vet' | 'labor' | 'sale' | 'other'
  amount: number
  notes?: string
}

export function listFinancialEntries(params?: { farm_id?: string; lot_id?: string }) {
  const filtered = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ) as Record<string, string>
  const search = Object.keys(filtered).length ? `?${new URLSearchParams(filtered).toString()}` : ''
  return requestAuth<unknown>(`financial-entries/${search}`).then((res) => unwrapList<FinancialEntry>(res))
}

export type CreateFinancialEntryPayload = Omit<FinancialEntry, 'id'>

export function createFinancialEntry(payload: CreateFinancialEntryPayload) {
  return requestAuth<FinancialEntry>('financial-entries/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
