import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.verifyEmail(req.body);
      res.json({ success: true, message: 'Email verified successfully' });
    } catch (err) {
      next(err);
    }
  },

  async verifyPhone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.verifyPhone(req.body);
      res.json({ success: true, message: 'Phone verified successfully' });
    } catch (err) {
      next(err);
    }
  },

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.resendOtp(req.body);
      res.json({ success: true, message: 'OTP sent' });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Missing token' });
        return;
      }
      const result = await authService.refreshToken(authHeader.slice(7));
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
