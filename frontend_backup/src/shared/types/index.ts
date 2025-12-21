/**
 * Types globaux partagés entre features
 */

// ====== Entités métier ======

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'manager';
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Farm {
  id: string;
  user_id: string;
  name: string;
  location?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  area_hectares?: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  farm_id: string;
  building_id?: string;
  batch_number: string;
  animal_type: 'poultry' | 'pig';
  breed?: string;
  initial_count: number;
  current_count: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'archived';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BatchDailyLog {
  id: string;
  batch_id: string;
  log_date: string;
  mortality: number;
  feed_consumed_kg?: number;
  water_consumed_liters?: number;
  avg_weight_kg?: number;
  temperature_celsius?: number;
  humidity_percent?: number;
  observations?: string;
  created_at: string;
}

export interface StockItem {
  id: string;
  farm_id: string;
  item_type: 'feed' | 'supplement' | 'medication' | 'equipment';
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unit_price?: number;
  alert_threshold?: number;
  expiry_date?: string;
  supplier?: string;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  stock_item_id: string;
  movement_type: 'in' | 'out';
  quantity: number;
  unit_price?: number;
  reason?: string;
  reference_number?: string;
  created_at: string;
}

// ====== Types UI ======

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ====== Types offline ======

export interface OfflineAction {
  id: string;
  type: string;
  payload: unknown;
  timestamp: number;
  retries: number;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync?: Date;
  pendingActions: number;
}

// ====== Types formulaires ======

export interface FormFieldError {
  field: string;
  message: string;
}

export type ValidationResult = {
  isValid: boolean;
  errors: FormFieldError[];
};
