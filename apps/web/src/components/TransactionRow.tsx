import { Badge } from './ui/Badge';
import type { Transaction } from '@/types';

const TYPE_ICONS: Record<string, string> = {
  DEPOSIT: '⬇️',
  WITHDRAWAL: '⬆️',
  SWAP: '🔄',
  FEE: '💸',
};

const STATUS_VARIANTS: Record<string, 'green' | 'yellow' | 'red' | 'gray'> = {
  COMPLETED: 'green',
  PENDING: 'yellow',
  PROCESSING: 'yellow',
  FAILED: 'red',
  REVERSED: 'gray',
};

interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction: tx }: TransactionRowProps) {
  const icon = TYPE_ICONS[tx.type] ?? '💱';
  const statusVariant = STATUS_VARIANTS[tx.status] ?? 'gray';
  const date = new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-800">{tx.description ?? tx.type}</p>
          <p className="text-xs text-gray-400">{date} · {tx.reference}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">
          {tx.fromAmount ? `${tx.fromAmount} ${tx.fromCurrency}` : '—'}
        </p>
        <Badge variant={statusVariant} className="mt-0.5">{tx.status}</Badge>
      </div>
    </div>
  );
}
