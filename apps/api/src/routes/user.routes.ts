import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema, uploadKycSchema } from '../schemas/user.schema';

export const userRoutes = Router();

userRoutes.use(authMiddleware);
userRoutes.get('/me', userController.getMe);
userRoutes.patch('/me', validate(updateProfileSchema), userController.updateProfile);
userRoutes.post('/kyc', validate(uploadKycSchema), userController.submitKyc);
