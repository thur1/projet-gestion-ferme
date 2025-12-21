/**
 * Configuration des routes de l'application
 */

export const ROUTES = {
  // Public
  login: '/login',
  register: '/register',
  
  // Dashboard
  home: '/',
  dashboard: '/dashboard',
  
  // Aviculture
  poultry: {
    base: '/poultry',
    list: '/poultry',
    create: '/poultry/new',
    detail: (id: string) => `/poultry/${id}`,
    dailyLog: (id: string) => `/poultry/${id}/log`,
    history: (id: string) => `/poultry/${id}/history`,
  },
  
  // Porcin
  pigs: {
    base: '/pigs',
    list: '/pigs',
    create: '/pigs/new',
    detail: (id: string) => `/pigs/${id}`,
    health: (id: string) => `/pigs/${id}/health`,
    reproduction: (id: string) => `/pigs/${id}/reproduction`,
  },
  
  // Stock
  stock: {
    base: '/stock',
    list: '/stock',
    create: '/stock/new',
    detail: (id: string) => `/stock/${id}`,
    movements: (id: string) => `/stock/${id}/movements`,
    alerts: '/stock/alerts',
  },
  
  // Santé
  health: '/health',
  
  // Rapports & KPI
  reports: '/reports',
  kpi: '/kpi',
  
  // Paramètres
  settings: '/settings',
  profile: '/profile',
} as const;

export type RouteKey = keyof typeof ROUTES;
