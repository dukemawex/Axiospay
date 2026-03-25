import { Router } from 'express';
import { walletController } from '../controllers/wallet.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { depositSchema, swapSchema } from '../schemas/wallet.schema';

export const walletRoutes = Router();

walletRoutes.use(authMiddleware);
walletRoutes.get('/', walletController.getWallets);
walletRoutes.get('/transactions', walletController.getTransactions);
walletRoutes.post('/deposit', validate(depositSchema), walletController.initiateDeposit);
walletRoutes.post('/swap', validate(swapSchema), walletController.swap);
