/**
 * React Query Hooks - Farms
 * Hooks pour gérer les fermes avec cache automatique
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/react-query';
import { toast } from 'sonner';

// Types
interface Farm {
  id: string;
  name: string;
  location?: string;
  size?: number;
  type?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface CreateFarmDto {
  name: string;
  location?: string;
  size?: number;
  type?: string;
}

// Hooks
export function useFarms() {
  return useQuery({
    queryKey: queryKeys.farms,
    queryFn: () => api.get<Farm[]>('/farms'),
  });
}

export function useFarm(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.farm(id!),
    queryFn: () => api.get<Farm>(`/farms/${id}`),
    enabled: !!id,
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFarmDto) => api.post<Farm>('/farms', data),
    onSuccess: (newFarm) => {
      // Invalidate et refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
      
      // Optimistic update
      queryClient.setQueryData<Farm[]>(queryKeys.farms, (old) => {
        return old ? [...old, newFarm] : [newFarm];
      });
      
      toast.success('Ferme créée avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });
}

export function useUpdateFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateFarmDto> }) =>
      api.put<Farm>(`/farms/${id}`, data),
    onSuccess: (updatedFarm) => {
      // Update cache
      queryClient.setQueryData(queryKeys.farm(updatedFarm.id), updatedFarm);
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
      
      toast.success('Ferme mise à jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });
}

export function useDeleteFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/farms/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
      queryClient.removeQueries({ queryKey: queryKeys.farm(id) });
      
      toast.success('Ferme supprimée');
    },
    onError: (error: Error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });
}
