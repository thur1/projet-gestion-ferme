/**
 * useOfflineQueue - Hook pour gérer la queue offline
 */

import { useState, useEffect } from 'react';
import { offlineQueue } from '@/shared/services/offline';
import type { OfflineAction } from '@/shared/services/offline';

interface UseOfflineQueueReturn {
  pendingCount: number;
  actions: OfflineAction[];
  isProcessing: boolean;
  retryFailed: () => Promise<void>;
  clearQueue: () => Promise<void>;
}

export function useOfflineQueue(): UseOfflineQueueReturn {
  const [pendingCount, setPendingCount] = useState(0);
  const [actions, setActions] = useState<OfflineAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Charger les actions
  const loadActions = async () => {
    const pending = await offlineQueue.getPendingActions();
    setActions(pending);
    setPendingCount(pending.length);
  };

  useEffect(() => {
    loadActions();

    // Écouter les mises à jour
    const handleUpdate = () => {
      loadActions();
    };

    window.addEventListener('offline-queue-update', handleUpdate);

    return () => {
      window.removeEventListener('offline-queue-update', handleUpdate);
    };
  }, []);

  const retryFailed = async () => {
    setIsProcessing(true);
    try {
      await offlineQueue.retryFailed();
    } finally {
      setIsProcessing(false);
    }
  };

  const clearQueue = async () => {
    await offlineQueue.clearQueue();
  };

  return {
    pendingCount,
    actions,
    isProcessing,
    retryFailed,
    clearQueue,
  };
}
