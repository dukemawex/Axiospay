import { Router, Request, Response } from 'express';
import { walletService } from '../services/wallet.service';
import { logger } from '../lib/logger';

export const webhookRoutes = Router();

webhookRoutes.post('/interswitch', async (req: Request, res: Response): Promise<void> => {
  try {
    const { transactionReference, responseCode, amount, currency } = req.body as {
      transactionReference: string;
      responseCode: string;
      amount: string;
      currency: string;
    };

    if (responseCode === '00') {
      await walletService.confirmDeposit(transactionReference, parseFloat(amount), currency);
    }

    res.json({ status: 'received' });
  } catch (err) {
    logger.error(err, 'Webhook processing error');
    res.status(500).json({ status: 'error' });
  }
});
