/**
 * Types spécifiques au module Aviculture
 */

import type { Batch, BatchDailyLog } from '@/shared/types';

export interface PoultryBatch extends Batch {
  animal_type: 'poultry';
}

export interface PoultryDailyLog extends BatchDailyLog {
  // Champs spécifiques aviculture
}

export interface PoultryMetrics {
  totalMortality: number;
  mortalityRate: number;
  feedConversionRate: number;
  avgWeight: number;
  daysInProduction: number;
}

export interface PoultryAlert {
  id: string;
  batch_id: string;
  type: 'high_mortality' | 'low_feed' | 'abnormal_weight';
  severity: 'warning' | 'critical';
  message: string;
  created_at: string;
}
