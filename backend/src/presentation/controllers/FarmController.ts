// Presentation Layer - Controller
import { Request, Response } from 'express';
import { GetAllFarmsUseCase } from '../../application/use-cases/GetAllFarms.js';
import { CreateFarmUseCase } from '../../application/use-cases/CreateFarm.js';

export class FarmController {
  constructor(
    private getAllFarmsUseCase: GetAllFarmsUseCase,
    private createFarmUseCase: CreateFarmUseCase
  ) {}

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const farms = await this.getAllFarmsUseCase.execute();
      res.json(farms);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, location } = req.body;
      
      if (!name || !location) {
        res.status(400).json({ error: 'Name and location are required' });
        return;
      }

      const farm = await this.createFarmUseCase.execute({ name, location });
      res.status(201).json(farm);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
