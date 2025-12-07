// Presentation Layer - Routes
import { Router } from 'express';
import { FarmController } from '../controllers/FarmController.js';

export function createFarmRoutes(farmController: FarmController): Router {
  const router = Router();

  router.get('/farms', (req, res) => farmController.getAll(req, res));
  router.post('/farms', (req, res) => farmController.create(req, res));

  return router;
}
