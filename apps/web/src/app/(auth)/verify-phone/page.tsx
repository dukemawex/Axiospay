'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Suspense } from 'react';

const schema = z.object({ otp: z.string().length(6, 'Enter 6-digit code') });
type FormData = z.infer<typeof schema>;

function VerifyPhoneForm() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get('phone') ?? '';
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await api.post('/auth/verify-phone', { phone, otp: data.otp });
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="text-5xl mb-4">📱</div>
          <h1 className="text-3xl font-bold text-gray-900">Verify Phone</h1>
          <p className="text-gray-500 mt-2">Enter the 6-digit code sent to <strong>{phone}</strong></p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {success ? (
            <div className="text-green-600 font-medium">✅ Phone verified! Redirecting...</div>
          ) : (
            <>
              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Verification Code" placeholder="000000" maxLength={6} error={errors.otp?.message} {...register('otp')} />
                <Button type="submit" loading={isSubmitting} className="w-full">Verify Phone</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPhonePage() {
  return (
    <Suspense>
      <VerifyPhoneForm />
    </Suspense>
  );
}
