import { Request, Response, NextFunction } from 'express';
import { walletService } from '../services/wallet.service';
import { swapService } from '../services/swap.service';

export const walletController = {
  async getWallets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const wallets = await walletService.getWallets(req.user!.id);
      res.json({ success: true, data: wallets });
    } catch (err) {
      next(err);
    }
  },

  async getTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 20;
      const result = await walletService.getTransactions(req.user!.id, page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async initiateDeposit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await walletService.initiateDeposit(req.user!.id, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async swap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await swapService.executeSwap(req.user!.id, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
