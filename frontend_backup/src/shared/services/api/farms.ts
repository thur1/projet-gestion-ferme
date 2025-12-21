/**
 * Service API pour les fermes
 */

import apiClient from './client';
import type { Farm } from '@/shared/types';

export const farmsApi = {
  getAll: () => apiClient.get<Farm[]>('/farms/'),
  
  getById: (id: string) => apiClient.get<Farm>(`/farms/${id}/`),
  
  create: (farm: Omit<Farm, 'id' | 'created_at' | 'updated_at'>) =>
    apiClient.post<Farm>('/farms/', farm),
  
  update: (id: string, farm: Partial<Farm>) =>
    apiClient.put<Farm>(`/farms/${id}/`, farm),
  
  delete: (id: string) => apiClient.delete(`/farms/${id}/`),
};

export default farmsApi;
