import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { env } from '../config/env';

function generateNumericOtp(length = 6): string {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

export const otpService = {
  async createOtp(userId: string, type: string): Promise<string> {
    const code = generateNumericOtp(6);
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.otpToken.updateMany({
      where: { userId, type, used: false },
      data: { used: true },
    });

    await prisma.otpToken.create({
      data: { userId, type, code, expiresAt },
    });

    return code;
  },

  async verifyOtp(userId: string, type: string, code: string): Promise<void> {
    const token = await prisma.otpToken.findFirst({
      where: { userId, type, code, used: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!token) throw new AppError(400, 'Invalid OTP', 'INVALID_OTP');
    if (token.expiresAt < new Date()) {
      throw new AppError(400, 'OTP has expired', 'OTP_EXPIRED');
    }

    await prisma.otpToken.update({ where: { id: token.id }, data: { used: true } });
  },
};
