// Domain Layer - Repository Interface
import { Farm } from '../entities/Farm.js';

export interface IFarmRepository {
  findAll(): Promise<Farm[]>;
  findById(id: string): Promise<Farm | null>;
  create(farm: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>): Promise<Farm>;
  update(id: string, farm: Partial<Farm>): Promise<Farm | null>;
  delete(id: string): Promise<boolean>;
}
