// Main Application Entry Point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { InMemoryFarmRepository } from './infrastructure/repositories/InMemoryFarmRepository.js';
import { GetAllFarmsUseCase } from './application/use-cases/GetAllFarms.js';
import { CreateFarmUseCase } from './application/use-cases/CreateFarm.js';
import { FarmController } from './presentation/controllers/FarmController.js';
import { createFarmRoutes } from './presentation/routes/farmRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Dependency Injection
const farmRepository = new InMemoryFarmRepository();
const getAllFarmsUseCase = new GetAllFarmsUseCase(farmRepository);
const createFarmUseCase = new CreateFarmUseCase(farmRepository);
const farmController = new FarmController(getAllFarmsUseCase, createFarmUseCase);

// Routes
app.use('/api', createFarmRoutes(farmController));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌾 API: http://localhost:${PORT}/api/farms`);
});
