/**
 * Service API pour les stocks
 */

import apiClient from './client';
import type { StockItem, StockMovement } from '@/shared/types';

export const stockApi = {
  // Gestion stock items
  getAll: (params?: { farm_id?: string; item_type?: string }) =>
    apiClient.get<StockItem[]>('/stock-items/', { params }),
  
  getById: (id: string) => apiClient.get<StockItem>(`/stock-items/${id}/`),
  
  create: (item: Omit<StockItem, 'id' | 'created_at' | 'updated_at'>) =>
    apiClient.post<StockItem>('/stock-items/', item),
  
  update: (id: string, item: Partial<StockItem>) =>
    apiClient.put<StockItem>(`/stock-items/${id}/`, item),
  
  delete: (id: string) => apiClient.delete(`/stock-items/${id}/`),

  // Mouvements
  getMovements: (stockItemId: string) =>
    apiClient.get<StockMovement[]>(`/stock-items/${stockItemId}/movements/`),
  
  createMovement: (movement: Omit<StockMovement, 'id' | 'created_at'>) =>
    apiClient.post<StockMovement>('/stock-movements/', movement),

  // Alertes
  getAlerts: () => apiClient.get<StockItem[]>('/stock-items/alerts/'),
};

export default stockApi;
