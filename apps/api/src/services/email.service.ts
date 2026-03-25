import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../lib/logger';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
});

export const emailService = {
  async sendVerificationEmail(to: string, firstName: string, otp: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to,
        subject: 'Verify your Axios Pay email',
        html: `
          <h2>Welcome to Axios Pay, ${firstName}!</h2>
          <p>Your email verification code is:</p>
          <h1 style="letter-spacing:6px;font-size:36px;">${otp}</h1>
          <p>This code expires in ${env.OTP_EXPIRY_MINUTES} minutes.</p>
          <p>If you did not register, please ignore this email.</p>
        `,
      });
      logger.info({ to }, 'Verification email sent');
    } catch (err) {
      logger.error(err, 'Failed to send verification email');
    }
  },

  async sendSmsOtp(phone: string, otp: string): Promise<void> {
    logger.info({ phone, otp }, 'SMS OTP (logged in dev mode)');
  },

  async sendTransactionNotification(to: string, firstName: string, description: string, amount: string, currency: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to,
        subject: 'Axios Pay Transaction Notification',
        html: `
          <h2>Hi ${firstName},</h2>
          <p>${description}</p>
          <p><strong>${amount} ${currency}</strong></p>
          <p>Thank you for using Axios Pay.</p>
        `,
      });
    } catch (err) {
      logger.error(err, 'Failed to send transaction email');
    }
  },
};
