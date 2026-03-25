import { z } from 'zod';

const SUPPORTED_CURRENCIES = ['NGN', 'UGX', 'KES', 'GHS'] as const;

export const depositSchema = z.object({
  amount: z.number().positive().max(10_000_000),
  currency: z.enum(SUPPORTED_CURRENCIES),
});

export const swapSchema = z.object({
  fromCurrency: z.enum(SUPPORTED_CURRENCIES),
  toCurrency: z.enum(SUPPORTED_CURRENCIES),
  amount: z.number().positive().max(10_000_000),
});

export type DepositInput = z.infer<typeof depositSchema>;
export type SwapInput = z.infer<typeof swapSchema>;
