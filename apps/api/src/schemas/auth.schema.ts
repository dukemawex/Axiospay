import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  nationality: z.string().length(2),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const verifyPhoneSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6),
});

export const resendOtpSchema = z.object({
  identifier: z.string().min(1),
  type: z.enum(['EMAIL_VERIFY', 'PHONE_VERIFY']),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
