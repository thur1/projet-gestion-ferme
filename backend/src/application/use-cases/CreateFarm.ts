// Application Layer - Use Case
import { Farm } from '../../domain/entities/Farm.js';
import { IFarmRepository } from '../../domain/repositories/IFarmRepository.js';

export class CreateFarmUseCase {
  constructor(private farmRepository: IFarmRepository) {}

  async execute(data: { name: string; location: string }): Promise<Farm> {
    return await this.farmRepository.create(data);
  }
}
