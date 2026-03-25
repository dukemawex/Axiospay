import { Request, Response, NextFunction } from 'express';
import { ratesService } from '../services/rates.service';

export const ratesController = {
  async getRates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rates = await ratesService.getAllRates();
      res.json({ success: true, data: rates });
    } catch (err) {
      next(err);
    }
  },

  async getRate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { from, to } = req.params;
      const rate = await ratesService.getRate(from!.toUpperCase(), to!.toUpperCase());
      res.json({ success: true, data: rate });
    } catch (err) {
      next(err);
    }
  },
};
