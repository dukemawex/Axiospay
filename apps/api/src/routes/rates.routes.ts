import { Router } from 'express';
import { ratesController } from '../controllers/rates.controller';

export const ratesRoutes = Router();

ratesRoutes.get('/', ratesController.getRates);
ratesRoutes.get('/:from/:to', ratesController.getRate);
