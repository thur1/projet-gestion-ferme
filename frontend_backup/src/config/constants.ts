/**
 * Constants globales de l'application
 */

export const APP_CONFIG = {
  name: 'Gestion de Ferme',
  version: '1.0.0',
  description: 'Plateforme de gestion agricole pour aviculteurs et éleveurs',
} as const;

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
  timeout: 30000, // 30 secondes
  retryAttempts: 3,
} as const;

export const STORAGE_KEYS = {
  auth: {
    token: 'auth_token',
    user: 'auth_user',
    session: 'auth_session',
  },
  offline: {
    queue: 'offline_queue',
    lastSync: 'last_sync',
  },
  preferences: {
    theme: 'theme',
    language: 'language',
  },
} as const;

export const CACHE_CONFIG = {
  ttl: {
    short: 5 * 60 * 1000, // 5 minutes
    medium: 30 * 60 * 1000, // 30 minutes
    long: 24 * 60 * 60 * 1000, // 24 heures
  },
} as const;

export const OFFLINE_CONFIG = {
  maxQueueSize: 100,
  syncInterval: 30000, // 30 secondes
  retryDelay: 5000, // 5 secondes
} as const;

export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

export const ALERT_THRESHOLDS = {
  poultry: {
    mortalityRate: 5, // % journalier
    feedConsumption: 0.8, // multiplicateur attendu
    waterConsumption: 1.2,
  },
  stock: {
    lowLevel: 10, // % du stock total
    expiryWarning: 30, // jours avant expiration
  },
} as const;
