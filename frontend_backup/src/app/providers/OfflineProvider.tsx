/**
 * OfflineProvider - Initialise et gère les services offline
 */

import { useEffect, type ReactNode } from 'react';
import { indexedDB } from '@/shared/services/storage/indexedDB';
import { offlineQueue } from '@/shared/services/offline/queue';
import { syncService } from '@/shared/services/offline/sync';

interface OfflineProviderProps {
  children: ReactNode;
}

export function OfflineProvider({ children }: OfflineProviderProps) {
  useEffect(() => {
    let isInitialized = false;

    async function initialize() {
      try {
        console.log('🚀 Initializing offline services...');

        // 1. Initialiser IndexedDB
        await indexedDB.init();
        console.log('✅ IndexedDB initialized');

        // 2. Démarrer le traitement automatique de la queue
        offlineQueue.startAutoProcessing(30000); // Toutes les 30 secondes
        console.log('✅ Offline queue started');

        // 3. Démarrer la synchronisation automatique
        syncService.startAutoSync(60000); // Toutes les 60 secondes
        console.log('✅ Auto-sync started');

        isInitialized = true;
        console.log('🎉 Offline services ready!');
      } catch (error) {
        console.error('❌ Failed to initialize offline services:', error);
      }
    }

    initialize();

    // Cleanup on unmount
    return () => {
      if (isInitialized) {
        offlineQueue.stopAutoProcessing();
        syncService.stopAutoSync();
        console.log('🛑 Offline services stopped');
      }
    };
  }, []);

  return <>{children}</>;
}
