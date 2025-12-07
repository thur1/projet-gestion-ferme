// Infrastructure Layer - In-Memory Repository Implementation
import { Farm } from '../../domain/entities/Farm.js';
import { IFarmRepository } from '../../domain/repositories/IFarmRepository.js';

export class InMemoryFarmRepository implements IFarmRepository {
  private farms: Farm[] = [];

  async findAll(): Promise<Farm[]> {
    return this.farms;
  }

  async findById(id: string): Promise<Farm | null> {
    return this.farms.find(farm => farm.id === id) || null;
  }

  async create(data: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>): Promise<Farm> {
    const farm: Farm = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.farms.push(farm);
    return farm;
  }

  async update(id: string, data: Partial<Farm>): Promise<Farm | null> {
    const index = this.farms.findIndex(farm => farm.id === id);
    if (index === -1) return null;
    
    this.farms[index] = {
      ...this.farms[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.farms[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.farms.findIndex(farm => farm.id === id);
    if (index === -1) return false;
    
    this.farms.splice(index, 1);
    return true;
  }
}
