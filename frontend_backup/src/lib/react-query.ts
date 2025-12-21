/**
 * React Query Configuration
 * Gestion globale du cache et des requêtes API
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache par défaut : 5 minutes
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000, // Garbage collection : 10 min
      
      // Retry strategy
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch strategy
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      
      // Network mode
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
});

// Query Keys - Centralisés pour cohérence
export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  currentUser: ['auth', 'user'] as const,
  
  // Farms
  farms: ['farms'] as const,
  farm: (id: string) => ['farms', id] as const,
  
  // Batches
  batches: ['batches'] as const,
  batch: (id: string) => ['batches', id] as const,
  batchLogs: (batchId: string) => ['batches', batchId, 'logs'] as const,
  
  // Stock
  stock: ['stock'] as const,
  stockItem: (id: string) => ['stock', id] as const,
  stockMovements: (id: string) => ['stock', id, 'movements'] as const,
  
  // Analytics
  analytics: ['analytics'] as const,
  kpis: ['analytics', 'kpis'] as const,
  financials: ['analytics', 'financials'] as const,
};

// Type-safe query key helper
export type QueryKey = typeof queryKeys[keyof typeof queryKeys];
