import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { walletRoutes } from './wallet.routes';
import { ratesRoutes } from './rates.routes';
import { webhookRoutes } from './webhook.routes';
import { defaultRateLimit } from '../middleware/rateLimit.middleware';

export const router = Router();

router.use(defaultRateLimit);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/wallets', walletRoutes);
router.use('/rates', ratesRoutes);
router.use('/webhooks', webhookRoutes);
