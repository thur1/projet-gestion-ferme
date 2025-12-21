/**
 * Types spécifiques au module Stock
 */

import type { StockItem } from '@/shared/types';

export interface StockAlert extends StockItem {
  alert_type: 'low_stock' | 'expiring_soon' | 'expired';
  days_until_expiry?: number;
}

export interface StockSummary {
  total_items: number;
  total_value: number;
  low_stock_count: number;
  expiring_soon_count: number;
  by_category: Record<string, number>;
}
