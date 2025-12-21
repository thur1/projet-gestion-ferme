/**
 * Service API pour les lots (aviculture/porcin)
 */

import apiClient from './client';
import type { Batch, BatchDailyLog } from '@/shared/types';

export const batchesApi = {
  // Gestion des lots
  getAll: (params?: { farm_id?: string; animal_type?: string; status?: string }) =>
    apiClient.get<Batch[]>('/lots/', { params }),
  
  getById: (id: string) => apiClient.get<Batch>(`/lots/${id}/`),
  
  create: (batch: Omit<Batch, 'id' | 'created_at' | 'updated_at'>) =>
    apiClient.post<Batch>('/lots/', batch),
  
  update: (id: string, batch: Partial<Batch>) =>
    apiClient.put<Batch>(`/lots/${id}/`, batch),
  
  delete: (id: string) => apiClient.delete(`/lots/${id}/`),

  // Logs journaliers
  getDailyLogs: (batchId: string) =>
    apiClient.get<BatchDailyLog[]>(`/lots/${batchId}/logs/`),
  
  createDailyLog: (batchId: string, log: Omit<BatchDailyLog, 'id' | 'batch_id' | 'created_at'>) =>
    apiClient.post<BatchDailyLog>(`/lots/${batchId}/logs/`, log),
};

export default batchesApi;
