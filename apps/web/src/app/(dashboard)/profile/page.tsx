'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

const schema = z.object({
  documentUrl: z.string().url('Enter valid document URL'),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [kycError, setKycError] = useState('');
  const [kycSuccess, setKycSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onKycSubmit = async (data: FormData) => {
    setKycError('');
    try {
      await api.post('/users/kyc', data);
      setKycSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'KYC submission failed';
      setKycError(message);
    }
  };

  const kycStatusColor: Record<string, 'green' | 'yellow' | 'red' | 'gray'> = {
    APPROVED: 'green',
    SUBMITTED: 'yellow',
    REJECTED: 'red',
    PENDING: 'gray',
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Profile & KYC</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm max-w-lg">
        <h2 className="font-semibold text-gray-800 mb-4">Account Details</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{user?.firstName} {user?.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">KYC Status</span>
            <Badge variant={kycStatusColor[user?.kycStatus ?? 'PENDING'] ?? 'gray'}>
              {user?.kycStatus ?? 'PENDING'}
            </Badge>
          </div>
        </div>
      </div>

      {user?.kycStatus === 'PENDING' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm max-w-lg">
          <h2 className="font-semibold text-gray-800 mb-1">Submit KYC Documents</h2>
          <p className="text-sm text-gray-500 mb-4">Upload a government-issued ID to verify your identity.</p>

          {kycSuccess ? (
            <div className="text-green-600 font-medium text-sm">✅ KYC submitted for review.</div>
          ) : (
            <>
              {kycError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{kycError}</div>}
              <form onSubmit={handleSubmit(onKycSubmit)} className="space-y-4">
                <Input label="Document URL" placeholder="https://..." error={errors.documentUrl?.message} {...register('documentUrl')} />
                <Button type="submit" loading={isSubmitting}>Submit KYC</Button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
