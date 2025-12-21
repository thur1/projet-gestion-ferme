/**
 * Sync Service - Synchronise les données entre IndexedDB et l'API
 */

import { indexedDB, STORES } from '../storage/indexedDB';
import { offlineQueue } from './queue';
import { farmsApi, batchesApi, stockApi } from '../api';

export interface SyncStatus {
  isSync: boolean;
  lastSyncTime: number | null;
  pendingChanges: number;
  error?: string;
}

class SyncService {
  private isSyncing = false;
  private syncInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Synchroniser toutes les données
   */
  async syncAll(): Promise<void> {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    if (!navigator.onLine) {
      console.log('Offline - skipping sync');
      return;
    }

    this.isSyncing = true;
    console.log('Starting full sync...');

    try {
      // 1. Traiter la queue offline d'abord
      await offlineQueue.processQueue();

      // 2. Synchroniser les données depuis l'API
      await this.syncFarms();
      await this.syncBatches();
      await this.syncStock();

      // 3. Mettre à jour l'horodatage
      await this.updateLastSyncTime();

      console.log('Full sync completed');
      this.dispatchSyncUpdate({ isSync: true, lastSyncTime: Date.now(), pendingChanges: 0 });
    } catch (error) {
      console.error('Sync error:', error);
      const pendingCount = await offlineQueue.getPendingCount();
      this.dispatchSyncUpdate({
        isSync: false,
        lastSyncTime: await this.getLastSyncTime(),
        pendingChanges: pendingCount,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Synchroniser les fermes
   */
  private async syncFarms(): Promise<void> {
    try {
      const response = await farmsApi.getAll();
      const farms = response.data || [];
      
      // Remplacer toutes les fermes locales
      await indexedDB.clear(STORES.FARMS);
      
      for (const farm of farms) {
        await indexedDB.add(STORES.FARMS, farm);
      }

      console.log(`Synced ${farms.length} farms`);
    } catch (error) {
      console.error('Failed to sync farms:', error);
      throw error;
    }
  }

  /**
   * Synchroniser les lots
   */
  private async syncBatches(): Promise<void> {
    try {
      const response = await batchesApi.getAll();
      const batches = response.data || [];
      
      // Remplacer tous les lots locaux
      await indexedDB.clear(STORES.BATCHES);
      
      for (const batch of batches) {
        await indexedDB.add(STORES.BATCHES, batch);
      }

      console.log(`Synced ${batches.length} batches`);
    } catch (error) {
      console.error('Failed to sync batches:', error);
      throw error;
    }
  }

  /**
   * Synchroniser le stock
   */
  private async syncStock(): Promise<void> {
    try {
      const response = await stockApi.getAll();
      const items = response.data || [];
      
      // Remplacer tous les items locaux
      await indexedDB.clear(STORES.STOCK_ITEMS);
      
      for (const item of items) {
        await indexedDB.add(STORES.STOCK_ITEMS, item);
      }

      console.log(`Synced ${items.length} stock items`);
    } catch (error) {
      console.error('Failed to sync stock:', error);
      throw error;
    }
  }

  /**
   * Récupérer les données locales (mode offline)
   */
  async getLocalFarms(): Promise<unknown[]> {
    return indexedDB.getAll(STORES.FARMS);
  }

  async getLocalBatches(): Promise<unknown[]> {
    return indexedDB.getAll(STORES.BATCHES);
  }

  async getLocalStock(): Promise<unknown[]> {
    return indexedDB.getAll(STORES.STOCK_ITEMS);
  }

  async getLocalBatch(batchId: string): Promise<unknown | undefined> {
    return indexedDB.getByIndex(STORES.BATCHES, 'id', batchId);
  }

  async getLocalDailyLogs(batchId: string): Promise<unknown[]> {
    const allLogs = await indexedDB.getAll(STORES.DAILY_LOGS);
    return allLogs.filter((log: any) => log.batch_id === batchId);
  }

  /**
   * Sauvegarder localement et ajouter à la queue
   */
  async createOffline<T>(
    store: string,
    endpoint: string,
    data: T,
    method: 'POST' | 'PUT' | 'DELETE' = 'POST'
  ): Promise<void> {
    // Sauvegarder localement avec un ID temporaire
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const localData = { ...data, id: tempId, _isLocal: true };
    
    await indexedDB.add(store, localData);

    // Ajouter à la queue pour sync ultérieure
    await offlineQueue.enqueue({
      type: 'CREATE',
      endpoint,
      method,
      data,
    });

    console.log('Created offline:', store, tempId);
  }

  async updateOffline<T>(
    store: string,
    endpoint: string,
    id: string | number,
    data: T
  ): Promise<void> {
    // Mettre à jour localement
    await indexedDB.put(store, { ...data, id, _isLocal: true });

    // Ajouter à la queue
    await offlineQueue.enqueue({
      type: 'UPDATE',
      endpoint,
      method: 'PUT',
      data,
    });

    console.log('Updated offline:', store, id);
  }

  async deleteOffline(
    store: string,
    endpoint: string,
    id: string | number
  ): Promise<void> {
    // Supprimer localement
    await indexedDB.delete(store, id);

    // Ajouter à la queue
    await offlineQueue.enqueue({
      type: 'DELETE',
      endpoint,
      method: 'DELETE',
    });

    console.log('Deleted offline:', store, id);
  }

  /**
   * Obtenir le statut de synchronisation
   */
  async getStatus(): Promise<SyncStatus> {
    const pendingChanges = await offlineQueue.getPendingCount();
    const lastSyncTime = await this.getLastSyncTime();

    return {
      isSync: pendingChanges === 0 && navigator.onLine,
      lastSyncTime,
      pendingChanges,
    };
  }

  /**
   * Gestion de l'horodatage de sync
   */
  private async getLastSyncTime(): Promise<number | null> {
    const metadata = await indexedDB.getMetadata('lastSyncTime');
    return metadata ? Number(metadata) : null;
  }

  private async updateLastSyncTime(): Promise<void> {
    await indexedDB.setMetadata('lastSyncTime', Date.now().toString());
  }

  /**
   * Démarrer la synchronisation automatique
   */
  startAutoSync(intervalMs: number = 60000): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Sync initial
    this.syncAll();

    // Sync périodique
    this.syncInterval = setInterval(() => {
      this.syncAll();
    }, intervalMs);

    // Sync sur retour en ligne
    window.addEventListener('online', this.handleOnline);

    console.log(`Auto-sync started (interval: ${intervalMs}ms)`);
  }

  /**
   * Arrêter la synchronisation automatique
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    window.removeEventListener('online', this.handleOnline);
    console.log('Auto-sync stopped');
  }

  /**
   * Handler pour retour en ligne
   */
  private handleOnline = (): void => {
    console.log('Connection restored - triggering sync');
    setTimeout(() => this.syncAll(), 1000); // Délai pour stabilité
  };

  /**
   * Notifier l'UI des changements
   */
  private dispatchSyncUpdate(status: SyncStatus): void {
    window.dispatchEvent(new CustomEvent('sync-status-update', { detail: status }));
  }

  /**
   * Nettoyer toutes les données locales
   */
  async clearLocalData(): Promise<void> {
    await indexedDB.clear(STORES.FARMS);
    await indexedDB.clear(STORES.BATCHES);
    await indexedDB.clear(STORES.DAILY_LOGS);
    await indexedDB.clear(STORES.STOCK_ITEMS);
    await indexedDB.clear(STORES.OFFLINE_QUEUE);
    await indexedDB.clear(STORES.METADATA);
    console.log('All local data cleared');
  }
}

// Instance singleton
export const syncService = new SyncService();

export default syncService;
