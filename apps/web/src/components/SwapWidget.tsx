'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { useRates } from '@/hooks/useRates';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const CURRENCIES = ['NGN', 'UGX', 'KES', 'GHS'] as const;

const schema = z.object({
  fromCurrency: z.enum(CURRENCIES),
  toCurrency: z.enum(CURRENCIES),
  amount: z.coerce.number().positive('Enter valid amount'),
});

type FormData = z.infer<typeof schema>;

export function SwapWidget() {
  const [result, setResult] = useState<{ toAmount: string; exchangeRate: string; fee: string } | null>(null);
  const [error, setError] = useState('');
  const { rates } = useRates();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fromCurrency: 'NGN', toCurrency: 'UGX', amount: 0 },
  });

  const [from, to] = [watch('fromCurrency'), watch('toCurrency')];
  const rateKey = `${from}-${to}`;
  const currentRate = rates[rateKey];

  const onSubmit = async (data: FormData) => {
    if (data.fromCurrency === data.toCurrency) {
      setError('Source and destination currency must differ');
      return;
    }
    setError('');
    try {
      const res = await api.post<{ data: typeof result }>('/wallets/swap', data);
      setResult(res.data.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Swap failed';
      setError(message);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-semibold text-gray-800 mb-4">Exchange Currency</h2>

      {result ? (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 font-semibold text-lg">Swap Successful! ✅</p>
            <p className="text-green-600 mt-1">You received <strong>{result.toAmount}</strong></p>
            <p className="text-xs text-green-500 mt-1">Rate: {result.exchangeRate} · Fee: {result.fee}</p>
          </div>
          <Button variant="outline" onClick={() => setResult(null)} className="w-full">New Swap</Button>
        </div>
      ) : (
        <>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                <select {...register('fromCurrency')} className="input-base">
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                <select {...register('toCurrency')} className="input-base">
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <Input label="Amount" type="number" step="any" min="1" error={errors.amount?.message} {...register('amount')} />

            {currentRate && (
              <p className="text-xs text-gray-400">1 {from} = {currentRate} {to}</p>
            )}

            <Button type="submit" loading={isSubmitting} className="w-full">Swap Now</Button>
          </form>
        </>
      )}
    </div>
  );
}
