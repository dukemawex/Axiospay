import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { AppError } from '../middleware/error.middleware';

const RATES_CACHE_KEY = 'exchange_rates';
const RATES_CACHE_TTL = 300;

const FALLBACK_RATES: Record<string, number> = {
  'NGN-UGX': 2.85,
  'UGX-NGN': 0.35,
  'NGN-KES': 0.22,
  'KES-NGN': 4.55,
  'NGN-GHS': 0.019,
  'GHS-NGN': 52.6,
  'UGX-KES': 0.077,
  'KES-UGX': 12.97,
};

export const ratesService = {
  async getAllRates() {
    const cached = await redis.get(RATES_CACHE_KEY);
    if (cached) return JSON.parse(cached) as typeof FALLBACK_RATES;

    const dbRates = await prisma.exchangeRate.findMany();
    if (dbRates.length === 0) {
      await this.seedRates();
      return FALLBACK_RATES;
    }

    const rateMap: Record<string, string> = {};
    for (const r of dbRates) {
      rateMap[`${r.fromCurrency}-${r.toCurrency}`] = r.rate.toString();
    }

    await redis.setex(RATES_CACHE_KEY, RATES_CACHE_TTL, JSON.stringify(rateMap));
    return rateMap;
  },

  async getRate(fromCurrency: string, toCurrency: string) {
    const rates = await this.getAllRates();
    const key = `${fromCurrency}-${toCurrency}`;
    const rate = rates[key];
    if (!rate) {
      throw new AppError(404, `Exchange rate for ${fromCurrency}/${toCurrency} not found`, 'RATE_NOT_FOUND');
    }
    return { fromCurrency, toCurrency, rate, key };
  },

  async seedRates() {
    const ops = Object.entries(FALLBACK_RATES).map(([pair, rate]) => {
      const [from, to] = pair.split('-') as [string, string];
      return prisma.exchangeRate.upsert({
        where: { fromCurrency_toCurrency: { fromCurrency: from, toCurrency: to } },
        create: { fromCurrency: from, toCurrency: to, rate },
        update: { rate, fetchedAt: new Date() },
      });
    });
    await Promise.all(ops);
    await redis.del(RATES_CACHE_KEY);
  },

  async updateRate(fromCurrency: string, toCurrency: string, rate: number) {
    await prisma.exchangeRate.upsert({
      where: { fromCurrency_toCurrency: { fromCurrency, toCurrency } },
      create: { fromCurrency, toCurrency, rate },
      update: { rate, fetchedAt: new Date() },
    });
    await redis.del(RATES_CACHE_KEY);
  },
};
