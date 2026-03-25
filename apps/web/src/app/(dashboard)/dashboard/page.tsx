'use client';

import { WalletCard } from '@/components/WalletCard';
import { RatesTicker } from '@/components/RatesTicker';
import { TransactionRow } from '@/components/TransactionRow';
import { useWallets } from '@/hooks/useWallets';
import Link from 'next/link';

export default function DashboardPage() {
  const { wallets, transactions, isLoading } = useWallets();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/deposit" className="btn-outline text-sm">+ Deposit</Link>
          <Link href="/swap" className="btn-primary text-sm">Swap FX</Link>
        </div>
      </div>

      <RatesTicker />

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Wallets</h2>
        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {wallets.map((wallet) => (
              <WalletCard key={wallet.id} wallet={wallet} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Recent Transactions</h2>
          <Link href="/wallet" className="text-primary-600 text-sm font-medium hover:underline">View all</Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
          {transactions.slice(0, 5).map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} />
          ))}
          {transactions.length === 0 && (
            <div className="py-12 text-center text-gray-400">No transactions yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
