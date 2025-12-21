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

async function refreshAccessToken() {
  const { refresh } = getTokens()
  if (!refresh) throw new Error('Refresh token manquant')
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

export function storeTokens(tokens: LoginResponse) {
  setTokens(tokens)
}

export type DashboardSummary = {
  lots_total?: number
  units_total?: number
  farms_total?: number
  headcount_total?: number
  mortality_rate?: number
  stock_alerts?: Array<{ id: string; name: string; quantity: number; unit: string; alert_threshold: number }>
}

export interface Farm {
  id: string
  name: string
  location?: string
  enterprise: string
}

export function listFarms() {
  return requestAuth<Farm[]>('farms/')
}

export function fetchDashboardSummary(farmId: string) {
  const search = new URLSearchParams({ farm_id: farmId })
  return requestAuth<DashboardSummary>(`dashboard/summary/?${search.toString()}`)
}

// Types métier (minimaux)
export interface Lot {
  id: number
  name: string
  unit: number
  species: number
  headcount: number
}

export function listLots() {
  return requestAuth<Lot[]>('lots/')
}

export interface HealthEvent {
  id: number
  lot: number
  description: string
  event_type: string
  date: string
}

export function listHealthEvents() {
  return requestAuth<HealthEvent[]>('health-events/')
}

export interface StockItem {
  id: number
  name: string
  quantity: number
  unit: string
  category?: string
}

export function listStockItems() {
  return requestAuth<StockItem[]>('stock-items/')
}
