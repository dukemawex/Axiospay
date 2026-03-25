import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { interswitchService } from './interswitch.service';
import { v4 as uuidv4 } from 'uuid';
import type { DepositInput } from '../schemas/wallet.schema';

export const walletService = {
  async getWallets(userId: string) {
    return prisma.wallet.findMany({
      where: { userId },
      orderBy: { currency: 'asc' },
    });
  },

  async getTransactions(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      }),
    ]);
    return { transactions, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getOrCreateWallet(userId: string, currency: string) {
    const existing = await prisma.wallet.findUnique({
      where: { userId_currency: { userId, currency } },
    });
    if (existing) return existing;
    return prisma.wallet.create({ data: { userId, currency } });
  },

  async initiateDeposit(userId: string, input: DepositInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    if (!user.emailVerified) throw new AppError(403, 'Email not verified', 'EMAIL_NOT_VERIFIED');

    const wallet = await this.getOrCreateWallet(userId, input.currency);
    const reference = `DEP-${uuidv4().replace(/-/g, '').slice(0, 16).toUpperCase()}`;

    const transaction = await prisma.transaction.create({
      data: {
        type: 'DEPOSIT',
        status: 'PENDING',
        fromCurrency: input.currency,
        toCurrency: input.currency,
        fromAmount: new Decimal(input.amount),
        toAmount: new Decimal(input.amount),
        reference,
        senderId: userId,
        receiverId: userId,
        toWalletId: wallet.id,
        description: `Deposit ${input.currency}`,
      },
    });

    const paymentUrl = await interswitchService.initiatePayment({
      reference,
      amount: input.amount,
      currency: input.currency,
      email: user.email,
      callbackUrl: `${process.env['FRONTEND_URL']}/deposit/callback`,
    });

    return { transaction, paymentUrl };
  },

  async confirmDeposit(reference: string, amount: number, currency: string) {
    const transaction = await prisma.transaction.findUnique({ where: { reference } });
    if (!transaction) throw new AppError(404, 'Transaction not found', 'NOT_FOUND');
    if (transaction.status !== 'PENDING') return;

    await prisma.$transaction(async (tx) => {
      await tx.transaction.update({
        where: { reference },
        data: { status: 'COMPLETED' },
      });

      if (transaction.toWalletId) {
        await tx.wallet.update({
          where: { id: transaction.toWalletId },
          data: { balance: { increment: amount } },
        });
      }
    });
  },

  async debitWallet(userId: string, currency: string, amount: Decimal) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId_currency: { userId, currency } },
    });
    if (!wallet) throw new AppError(404, `No ${currency} wallet found`, 'WALLET_NOT_FOUND');
    if (wallet.balance.lessThan(amount)) {
      throw new AppError(400, 'Insufficient balance', 'INSUFFICIENT_BALANCE');
    }
    return prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amount } },
    });
  },

  async creditWallet(userId: string, currency: string, amount: Decimal) {
    const wallet = await this.getOrCreateWallet(userId, currency);
    return prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } },
    });
  },
};
