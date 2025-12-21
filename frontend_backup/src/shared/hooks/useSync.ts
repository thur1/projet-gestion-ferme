/**
 * useSync - Hook pour gérer la synchronisation
 */

import { useState, useEffect } from 'react';
import { syncService } from '@/shared/services/offline';
import type { SyncStatus } from '@/shared/services/offline';

interface UseSyncReturn {
  status: SyncStatus;
  sync: () => Promise<void>;
  isSyncing: boolean;
}

export function useSync(): UseSyncReturn {
  const [status, setStatus] = useState<SyncStatus>({
    isSync: false,
    lastSyncTime: null,
    pendingChanges: 0,
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Charger le statut initial
  useEffect(() => {
    syncService.getStatus().then(setStatus);
  }, []);

  // Écouter les mises à jour
  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<SyncStatus>;
      setStatus(customEvent.detail);
      setIsSyncing(false);
    };

    window.addEventListener('sync-status-update', handleUpdate);

    return () => {
      window.removeEventListener('sync-status-update', handleUpdate);
    };
  }, []);

  const sync = async () => {
    setIsSyncing(true);
    try {
      await syncService.syncAll();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    status,
    sync,
    isSyncing,
  };
}
