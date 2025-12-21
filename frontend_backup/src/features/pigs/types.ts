/**
 * Types spécifiques au module Porcin
 */

import type { Batch } from '@/shared/types';

export interface PigBatch extends Batch {
  animal_type: 'pig';
}

export interface PigAnimal {
  id: string;
  batch_id?: string;
  ear_tag: string;
  birth_date: string;
  sex: 'male' | 'female';
  breed?: string;
  weight_kg?: number;
  status: 'active' | 'sold' | 'dead';
  notes?: string;
}

export interface PigHealthRecord {
  id: string;
  animal_id: string;
  record_type: 'vaccination' | 'treatment' | 'checkup';
  date: string;
  product?: string;
  dosage?: string;
  veterinarian?: string;
  notes?: string;
}

export interface PigReproduction {
  id: string;
  sow_id: string;
  boar_id?: string;
  heat_date?: string;
  mating_date?: string;
  expected_farrowing?: string;
  actual_farrowing?: string;
  piglets_born?: number;
  piglets_alive?: number;
}
