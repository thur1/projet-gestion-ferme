/**
 * IndexedDB Wrapper pour persistence offline
 * Stocke les données critiques localement
 */

const DB_NAME = 'farm-manager-db';
const DB_VERSION = 1;

// Stores
const STORES = {
  FARMS: 'farms',
  BATCHES: 'batches',
  DAILY_LOGS: 'daily_logs',
  STOCK_ITEMS: 'stock_items',
  OFFLINE_QUEUE: 'offline_queue',
  METADATA: 'metadata',
} as const;

interface DBStore {
  name: string;
  keyPath: string;
  autoIncrement?: boolean;
  indexes?: { name: string; keyPath: string; unique?: boolean }[];
}

const STORE_CONFIG: DBStore[] = [
  {
    name: STORES.FARMS,
    keyPath: 'id',
    indexes: [
      { name: 'user_id', keyPath: 'user_id' },
      { name: 'updated_at', keyPath: 'updated_at' },
    ],
  },
  {
    name: STORES.BATCHES,
    keyPath: 'id',
    indexes: [
      { name: 'farm_id', keyPath: 'farm_id' },
      { name: 'status', keyPath: 'status' },
      { name: 'updated_at', keyPath: 'updated_at' },
    ],
  },
  {
    name: STORES.DAILY_LOGS,
    keyPath: 'id',
    indexes: [
      { name: 'batch_id', keyPath: 'batch_id' },
      { name: 'log_date', keyPath: 'log_date' },
    ],
  },
  {
    name: STORES.STOCK_ITEMS,
    keyPath: 'id',
    indexes: [
      { name: 'farm_id', keyPath: 'farm_id' },
      { name: 'item_type', keyPath: 'item_type' },
    ],
  },
  {
    name: STORES.OFFLINE_QUEUE,
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'timestamp', keyPath: 'timestamp' },
      { name: 'status', keyPath: 'status' },
    ],
  },
  {
    name: STORES.METADATA,
    keyPath: 'key',
  },
];

class IndexedDBService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialiser la base de données
   */
  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Créer les stores
        STORE_CONFIG.forEach((storeConfig) => {
          // Supprimer le store s'il existe déjà
          if (db.objectStoreNames.contains(storeConfig.name)) {
            db.deleteObjectStore(storeConfig.name);
          }

          // Créer le store
          const store = db.createObjectStore(storeConfig.name, {
            keyPath: storeConfig.keyPath,
            autoIncrement: storeConfig.autoIncrement,
          });

          // Créer les indexes
          storeConfig.indexes?.forEach((index) => {
            store.createIndex(index.name, index.keyPath, {
              unique: index.unique || false,
            });
          });
        });

        console.log('IndexedDB schema created');
      };
    });

    return this.initPromise;
  }

  /**
   * Obtenir un object store
   */
  private async getStore(
    storeName: string,
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBObjectStore> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  /**
   * Ajouter un élément
   */
  async add<T>(storeName: string, data: T): Promise<IDBValidKey> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Mettre à jour un élément (ou l'ajouter s'il n'existe pas)
   */
  async put<T>(storeName: string, data: T): Promise<IDBValidKey> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Récupérer un élément par clé
   */
  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Récupérer tous les éléments
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Récupérer éléments par index
   */
  async getByIndex<T>(
    storeName: string,
    indexName: string,
    value: IDBValidKey
  ): Promise<T[]> {
    const store = await this.getStore(storeName);
    const index = store.index(indexName);
    return new Promise((resolve, reject) => {
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Supprimer un élément
   */
  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Vider un store
   */
  async clear(storeName: string): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Compter les éléments
   */
  async count(storeName: string): Promise<number> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Sauvegarder metadata
   */
  async setMetadata(key: string, value: unknown): Promise<void> {
    await this.put(STORES.METADATA, { key, value, timestamp: Date.now() });
  }

  /**
   * Récupérer metadata
   */
  async getMetadata<T>(key: string): Promise<T | undefined> {
    const data = await this.get<{ key: string; value: T; timestamp: number }>(
      STORES.METADATA,
      key
    );
    return data?.value;
  }

  /**
   * Fermer la connexion
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }
}

// Instance singleton
export const indexedDB = new IndexedDBService();

// Exports
export { STORES };
export default indexedDB;
