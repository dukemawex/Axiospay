'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const CURRENCIES = ['NGN', 'UGX', 'KES', 'GHS'] as const;

const schema = z.object({
  amount: z.coerce.number().positive('Enter valid amount'),
  currency: z.enum(CURRENCIES),
});

type FormData = z.infer<typeof schema>;

export default function DepositPage() {
  const [paymentUrl, setPaymentUrl] = useState('');
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'NGN' },
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await api.post<{ data: { paymentUrl: string } }>('/wallets/deposit', data);
      setPaymentUrl(res.data.data.paymentUrl);
      window.location.href = res.data.data.paymentUrl;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initiate deposit';
      setError(message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Fund Wallet</h1>

      <div className="max-w-md bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">Deposit Funds via Interswitch</h2>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select {...register('currency')} className="input-base">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <Input label="Amount" type="number" min="100" step="any" error={errors.amount?.message} {...register('amount')} />

          <Button type="submit" loading={isSubmitting} className="w-full">
            Continue to Payment
          </Button>
        </form>
      </div>
    </div>
  );
}
