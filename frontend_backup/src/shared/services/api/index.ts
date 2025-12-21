/**
 * Export centralisé des services API
 */

export { apiClient, ApiError } from './client';
export { default as farmsApi } from './farms';
export { default as batchesApi } from './batches';
export { default as stockApi } from './stock';

// Réexporter pour faciliter les imports
import farmsApi from './farms';
import batchesApi from './batches';
import stockApi from './stock';

export default {
  farms: farmsApi,
  batches: batchesApi,
  stock: stockApi,
} as const;
