// Application Layer - Use Case
import { Farm } from '../../domain/entities/Farm.js';
import { IFarmRepository } from '../../domain/repositories/IFarmRepository.js';

export class GetAllFarmsUseCase {
  constructor(private farmRepository: IFarmRepository) {}

  async execute(): Promise<Farm[]> {
    return await this.farmRepository.findAll();
  }
}
