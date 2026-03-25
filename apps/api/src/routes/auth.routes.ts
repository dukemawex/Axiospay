import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authRateLimit, otpRateLimit } from '../middleware/rateLimit.middleware';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
  resendOtpSchema,
} from '../schemas/auth.schema';

export const authRoutes = Router();

authRoutes.post('/register', authRateLimit, validate(registerSchema), authController.register);
authRoutes.post('/login', authRateLimit, validate(loginSchema), authController.login);
authRoutes.post('/verify-email', otpRateLimit, validate(verifyEmailSchema), authController.verifyEmail);
authRoutes.post('/verify-phone', otpRateLimit, validate(verifyPhoneSchema), authController.verifyPhone);
authRoutes.post('/resend-otp', otpRateLimit, validate(resendOtpSchema), authController.resendOtp);
authRoutes.post('/refresh', authController.refresh);
