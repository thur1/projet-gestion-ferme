import { api } from '../lib/apiClient';

export interface EnterprisePayload { name: string }
export interface FarmPayload { enterprise: string; name: string; location?: string }
export interface UnitPayload { farm: string; species: string; name: string; capacity: number; conditions?: Record<string, unknown> }
export interface LotPayload {
  unit: string;
  species: string;
  code: string;
  entry_date: string;
  initial_count: number;
  status?: 'active' | 'closed';
  destination?: string;
}
export interface LotRecordPayload {
  lot: string;
  date: string;
  mortality?: number;
  feed_intake_kg?: string;
  milk_production_l?: string;
  eggs_count?: number;
  avg_weight_kg?: string;
  notes?: string;
}
export interface HealthEventPayload {
  lot: string;
  date: string;
  event_type: 'vaccination' | 'treatment' | 'disease';
  product?: string;
  dose?: string;
  veterinarian?: string;
  notes?: string;
}
export interface StockItemPayload {
  farm: string;
  name: string;
  item_type: 'feed' | 'med' | 'other';
  quantity?: string | number;
  unit?: string;
  alert_threshold?: string | number;
}
export interface StockMovementPayload {
  stock_item: string;
  movement_type: 'in' | 'out';
  quantity: string | number;
  date: string;
  lot?: string | null;
  reason?: string;
}

export const coreApi = {
  enterprises: {
    list: () => api.get('/enterprises/'),
    create: (data: EnterprisePayload) => api.post('/enterprises/', data),
  },
  farms: {
    list: (params: { enterprise_id?: string } = {}) => api.get('/farms/' + toQuery(params)),
    create: (data: FarmPayload) => api.post('/farms/', data),
  },
  species: {
    list: () => api.get('/species/'),
  },
  units: {
    list: (params: { farm_id?: string; species?: string } = {}) => api.get('/units/' + toQuery(params)),
    create: (data: UnitPayload) => api.post('/units/', data),
  },
  lots: {
    list: (params: { farm_id?: string; unit_id?: string; species?: string; status?: string } = {}) => api.get('/lots/' + toQuery(params)),
    get: (id: string) => api.get(`/lots/${id}/`),
    create: (data: LotPayload) => api.post('/lots/', data),
  },
  lotRecords: {
    list: (params: { lot_id?: string; date_from?: string; date_to?: string } = {}) => api.get('/lot-records/' + toQuery(params)),
    create: (data: LotRecordPayload) => api.post('/lot-records/', data),
  },
  health: {
    list: (params: { lot_id?: string } = {}) => api.get('/health-events/' + toQuery(params)),
    create: (data: HealthEventPayload) => api.post('/health-events/', data),
  },
  stock: {
    list: (params: { farm_id?: string } = {}) => api.get('/stock-items/' + toQuery(params)),
    create: (data: StockItemPayload) => api.post('/stock-items/', data),
  },
  stockMovements: {
    list: (params: { farm_id?: string; stock_item_id?: string } = {}) => api.get('/stock-movements/' + toQuery(params)),
    create: (data: StockMovementPayload) => api.post('/stock-movements/', data),
  },
  dashboard: {
    summary: (farmId: string) => api.get(`/dashboard/summary/?farm_id=${farmId}`),
  },
};

function toQuery(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (entries.length === 0) return '';
  const usp = new URLSearchParams(entries as [string, string][]);
  return `?${usp.toString()}`;
}
