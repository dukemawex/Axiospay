'use client';

import { WalletCard } from '@/components/WalletCard';
import { TransactionRow } from '@/components/TransactionRow';
import { useWallets } from '@/hooks/useWallets';
import { Spinner } from '@/components/ui/Spinner';

export default function WalletPage() {
  const { wallets, transactions, isLoading, hasMore, loadMore } = useWallets();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Wallets & History</h1>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Balances</h2>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {wallets.map((wallet) => (
              <WalletCard key={wallet.id} wallet={wallet} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Transaction History</h2>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} />
          ))}
          {transactions.length === 0 && !isLoading && (
            <div className="py-12 text-center text-gray-400">No transactions yet</div>
          )}
        </div>

        {hasMore && (
          <button onClick={loadMore} className="mt-4 w-full py-3 text-primary-600 font-medium hover:bg-primary-50 rounded-xl transition-colors">
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
