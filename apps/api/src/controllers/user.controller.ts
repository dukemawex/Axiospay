import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/auth.service';

export const userController = {
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getProfile(req.user!.id);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateProfile(req.user!.id, req.body);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  async submitKyc(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.submitKyc(req.user!.id, req.body.documentUrl);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
