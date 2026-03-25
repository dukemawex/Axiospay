import { Decimal } from '@prisma/client/runtime/library';
import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { ratesService } from './rates.service';
import { walletService } from './wallet.service';
import { v4 as uuidv4 } from 'uuid';
import type { SwapInput } from '../schemas/wallet.schema';

const SUPPORTED_PAIRS = new Set([
  'NGN-UGX', 'UGX-NGN',
  'NGN-KES', 'KES-NGN',
  'NGN-GHS', 'GHS-NGN',
  'UGX-KES', 'KES-UGX',
]);

const FEE_RATE = 0.015;

export const swapService = {
  async executeSwap(userId: string, input: SwapInput) {
    const pairKey = `${input.fromCurrency}-${input.toCurrency}`;
    if (!SUPPORTED_PAIRS.has(pairKey)) {
      throw new AppError(400, `Currency pair ${pairKey} not supported`, 'UNSUPPORTED_PAIR');
    }

    const rateData = await ratesService.getRate(input.fromCurrency, input.toCurrency);
    const rate = new Decimal(rateData.rate);
    const fromAmount = new Decimal(input.amount);
    const fee = fromAmount.mul(FEE_RATE).toDecimalPlaces(8);
    const netAmount = fromAmount.minus(fee);
    const toAmount = netAmount.mul(rate).toDecimalPlaces(8);
    const reference = `SWP-${uuidv4().replace(/-/g, '').slice(0, 16).toUpperCase()}`;

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const fromWallet = await tx.wallet.findUnique({
        where: { userId_currency: { userId, currency: input.fromCurrency } },
      });
      if (!fromWallet) throw new AppError(404, `No ${input.fromCurrency} wallet`, 'WALLET_NOT_FOUND');
      if (fromWallet.balance.lessThan(fromAmount)) {
        throw new AppError(400, 'Insufficient balance', 'INSUFFICIENT_BALANCE');
      }

      await tx.wallet.update({
        where: { id: fromWallet.id },
        data: { balance: { decrement: fromAmount } },
      });

      let toWallet = await tx.wallet.findUnique({
        where: { userId_currency: { userId, currency: input.toCurrency } },
      });
      if (!toWallet) {
        toWallet = await tx.wallet.create({ data: { userId, currency: input.toCurrency } });
      }
      await tx.wallet.update({
        where: { id: toWallet.id },
        data: { balance: { increment: toAmount } },
      });

      await tx.transaction.create({
        data: {
          type: 'SWAP',
          status: 'COMPLETED',
          fromCurrency: input.fromCurrency,
          toCurrency: input.toCurrency,
          fromAmount,
          toAmount,
          exchangeRate: rate,
          feeAmount: fee,
          feeCurrency: input.fromCurrency,
          reference,
          senderId: userId,
          receiverId: userId,
          fromWalletId: fromWallet.id,
          toWalletId: toWallet.id,
          description: `Swap ${input.fromCurrency} → ${input.toCurrency}`,
        },
      });
    });

    return {
      reference,
      fromCurrency: input.fromCurrency,
      toCurrency: input.toCurrency,
      fromAmount: fromAmount.toFixed(2),
      toAmount: toAmount.toFixed(2),
      exchangeRate: rate.toFixed(4),
      fee: fee.toFixed(2),
    };
  },
};
