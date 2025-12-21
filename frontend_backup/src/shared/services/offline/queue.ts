/**
 * Offline Queue - Gère les actions en attente de synchronisation
 */

import { indexedDB, STORES } from '../storage/indexedDB';
import { apiClient } from '../api/client';

export interface OfflineAction {
  id?: number;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: unknown;
  timestamp: number;
  retries: number;
  status: 'pending' | 'processing' | 'failed' | 'completed';
  error?: string;
}

class OfflineQueueService {
  private isProcessing = false;
  private maxRetries = 3;
  private processingTimer: ReturnType<typeof setInterval> | null = null;

  /**
   * Ajouter une action à la queue
   */
  async enqueue(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retries' | 'status'>): Promise<void> {
    const offlineAction: Omit<OfflineAction, 'id'> = {
      ...action,
      timestamp: Date.now(),
      retries: 0,
      status: 'pending',
    };

    await indexedDB.add(STORES.OFFLINE_QUEUE, offlineAction);
    console.log('Action added to offline queue:', action.type, action.endpoint);

    // Notifier l'UI
    this.dispatchQueueUpdate();
  }

  /**
   * Récupérer toutes les actions en attente
   */
  async getPendingActions(): Promise<OfflineAction[]> {
    const allActions = await indexedDB.getAll<OfflineAction>(STORES.OFFLINE_QUEUE);
    return allActions
      .filter(action => action.status === 'pending' || action.status === 'failed')
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Compter les actions en attente
   */
  async getPendingCount(): Promise<number> {
    const pending = await this.getPendingActions();
    return pending.length;
  }

  /**
   * Traiter une action
   */
  private async processAction(action: OfflineAction): Promise<boolean> {
    try {
      // Marquer comme en cours
      await indexedDB.put(STORES.OFFLINE_QUEUE, {
        ...action,
        status: 'processing',
      });

      // Exécuter la requête
      switch (action.method) {
        case 'POST':
          await apiClient.post(action.endpoint, action.data);
          break;
        case 'PUT':
          await apiClient.put(action.endpoint, action.data);
          break;
        case 'PATCH':
          await apiClient.patch(action.endpoint, action.data);
          break;
        case 'DELETE':
          await apiClient.delete(action.endpoint);
          break;
      }

      // Succès - marquer comme complété
      await indexedDB.put(STORES.OFFLINE_QUEUE, {
        ...action,
        status: 'completed',
      });

      console.log('Action processed successfully:', action.type, action.endpoint);
      return true;
    } catch (error) {
      console.error('Failed to process action:', error);

      // Incrémenter les tentatives
      const newRetries = action.retries + 1;
      const newStatus = newRetries >= this.maxRetries ? 'failed' : 'pending';

      await indexedDB.put(STORES.OFFLINE_QUEUE, {
        ...action,
        retries: newRetries,
        status: newStatus,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return false;
    }
  }

  /**
   * Traiter toute la queue
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing) {
      console.log('Queue processing already in progress');
      return;
    }

    // Vérifier la connexion
    if (!navigator.onLine) {
      console.log('Offline - skipping queue processing');
      return;
    }

    this.isProcessing = true;
    console.log('Starting queue processing...');

    try {
      const pendingActions = await this.getPendingActions();

      if (pendingActions.length === 0) {
        console.log('No pending actions');
        return;
      }

      console.log(`Processing ${pendingActions.length} pending actions`);

      for (const action of pendingActions) {
        await this.processAction(action);
        
        // Petit délai entre les requêtes pour éviter de surcharger
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Nettoyer les actions complétées (garder 50 dernières pour historique)
      await this.cleanup();

      console.log('Queue processing completed');
      this.dispatchQueueUpdate();
    } catch (error) {
      console.error('Error processing queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Nettoyer les anciennes actions complétées
   */
  private async cleanup(): Promise<void> {
    const allActions = await indexedDB.getAll<OfflineAction>(STORES.OFFLINE_QUEUE);
    const completed = allActions
      .filter(action => action.status === 'completed')
      .sort((a, b) => b.timestamp - a.timestamp);

    // Garder seulement les 50 dernières complétées
    const toDelete = completed.slice(50);

    for (const action of toDelete) {
      if (action.id) {
        await indexedDB.delete(STORES.OFFLINE_QUEUE, action.id);
      }
    }

    if (toDelete.length > 0) {
      console.log(`Cleaned up ${toDelete.length} old actions`);
    }
  }

  /**
   * Démarrer le traitement automatique
   */
  startAutoProcessing(intervalMs: number = 30000): void {
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
    }

    // Traiter immédiatement
    this.processQueue();

    // Puis à intervalle régulier
    this.processingTimer = setInterval(() => {
      this.processQueue();
    }, intervalMs);

    console.log(`Auto-processing started (interval: ${intervalMs}ms)`);
  }

  /**
   * Arrêter le traitement automatique
   */
  stopAutoProcessing(): void {
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
      this.processingTimer = null;
      console.log('Auto-processing stopped');
    }
  }

  /**
   * Vider complètement la queue
   */
  async clearQueue(): Promise<void> {
    await indexedDB.clear(STORES.OFFLINE_QUEUE);
    console.log('Queue cleared');
    this.dispatchQueueUpdate();
  }

  /**
   * Réessayer les actions échouées
   */
  async retryFailed(): Promise<void> {
    const allActions = await indexedDB.getAll<OfflineAction>(STORES.OFFLINE_QUEUE);
    const failed = allActions.filter(action => action.status === 'failed');

    for (const action of failed) {
      await indexedDB.put(STORES.OFFLINE_QUEUE, {
        ...action,
        status: 'pending',
        retries: 0,
        error: undefined,
      });
    }

    console.log(`Reset ${failed.length} failed actions`);
    this.dispatchQueueUpdate();
    this.processQueue();
  }

  /**
   * Notifier l'UI des changements de la queue
   */
  private dispatchQueueUpdate(): void {
    window.dispatchEvent(new CustomEvent('offline-queue-update'));
  }
}

// Instance singleton
export const offlineQueue = new OfflineQueueService();

export default offlineQueue;
