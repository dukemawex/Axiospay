import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { otpService } from './otp.service';
import { emailService } from './email.service';
import type { RegisterInput, LoginInput, VerifyEmailInput, VerifyPhoneInput, ResendOtpInput } from '../schemas/auth.schema';

const SALT_ROUNDS = 12;

function signToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRY } as jwt.SignOptions);
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: input.email }, { phone: input.phone }] },
    });
    if (existing) {
      throw new AppError(409, 'Email or phone already registered', 'DUPLICATE_USER');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        nationality: input.nationality,
        wallets: {
          create: [
            { currency: input.nationality === 'NG' ? 'NGN' : input.nationality === 'UG' ? 'UGX' : input.nationality === 'KE' ? 'KES' : 'GHS' },
          ],
        },
      },
      select: { id: true, email: true, phone: true, firstName: true, lastName: true, nationality: true, emailVerified: true, phoneVerified: true },
    });

    const emailOtp = await otpService.createOtp(user.id, 'EMAIL_VERIFY');
    await emailService.sendVerificationEmail(user.email, user.firstName, emailOtp);

    return { user, message: 'Registration successful. Please verify your email.' };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');

    const token = signToken(user.id, user.email);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        kycStatus: user.kycStatus,
      },
    };
  },

  async verifyEmail(input: VerifyEmailInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    if (user.emailVerified) throw new AppError(400, 'Email already verified', 'ALREADY_VERIFIED');

    await otpService.verifyOtp(user.id, 'EMAIL_VERIFY', input.otp);

    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
  },

  async verifyPhone(input: VerifyPhoneInput) {
    const user = await prisma.user.findUnique({ where: { phone: input.phone } });
    if (!user) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    if (user.phoneVerified) throw new AppError(400, 'Phone already verified', 'ALREADY_VERIFIED');

    await otpService.verifyOtp(user.id, 'PHONE_VERIFY', input.otp);

    await prisma.user.update({ where: { id: user.id }, data: { phoneVerified: true } });
  },

  async resendOtp(input: ResendOtpInput) {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: input.identifier }, { phone: input.identifier }] },
    });
    if (!user) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');

    if (input.type === 'EMAIL_VERIFY') {
      if (user.emailVerified) throw new AppError(400, 'Email already verified', 'ALREADY_VERIFIED');
      const otp = await otpService.createOtp(user.id, 'EMAIL_VERIFY');
      await emailService.sendVerificationEmail(user.email, user.firstName, otp);
    } else {
      if (user.phoneVerified) throw new AppError(400, 'Phone already verified', 'ALREADY_VERIFIED');
      const otp = await otpService.createOtp(user.id, 'PHONE_VERIFY');
      await emailService.sendSmsOtp(user.phone, otp);
    }
  },

  async refreshToken(token: string) {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string; email: string };
      const newToken = signToken(payload.userId, payload.email);
      return { token: newToken };
    } catch {
      throw new AppError(401, 'Invalid token', 'INVALID_TOKEN');
    }
  },
};

export const userService = {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        nationality: true,
        emailVerified: true,
        phoneVerified: true,
        kycStatus: true,
        kycDocumentUrl: true,
        createdAt: true,
      },
    });
    if (!user) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    return user;
  },

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data: { firstName: data.firstName, lastName: data.lastName },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        nationality: true,
        emailVerified: true,
        phoneVerified: true,
        kycStatus: true,
      },
    });
  },

  async submitKyc(userId: string, documentUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { kycDocumentUrl: documentUrl, kycStatus: 'SUBMITTED' },
      select: { id: true, kycStatus: true, kycDocumentUrl: true },
    });
  },
};
