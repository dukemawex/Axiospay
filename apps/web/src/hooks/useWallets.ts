'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import type { Wallet, Transaction, PaginatedResponse } from '@/types';

export function useWallets() {
  const [page, setPage] = useState(1);

  const { data: walletsData, isLoading: walletsLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const res = await api.get<{ data: Wallet[] }>('/wallets');
      return res.data.data;
    },
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ['transactions', page],
    queryFn: async () => {
      const res = await api.get<{ data: PaginatedResponse<Transaction> }>(`/wallets/transactions?page=${page}&limit=20`);
      return res.data.data;
    },
  });

  return {
    wallets: walletsData ?? [],
    transactions: txData?.transactions ?? [],
    isLoading: walletsLoading || txLoading,
    hasMore: txData ? page < txData.totalPages : false,
    loadMore: () => setPage((p) => p + 1),
  };
}
