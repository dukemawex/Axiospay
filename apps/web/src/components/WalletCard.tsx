import type { Wallet } from '@/types';

const CURRENCY_FLAGS: Record<string, string> = {
  NGN: '🇳🇬',
  UGX: '🇺🇬',
  KES: '🇰🇪',
  GHS: '🇬🇭',
};

const CURRENCY_COLORS: Record<string, string> = {
  NGN: 'from-green-500 to-emerald-600',
  UGX: 'from-yellow-500 to-amber-600',
  KES: 'from-red-500 to-rose-600',
  GHS: 'from-blue-500 to-indigo-600',
};

interface WalletCardProps {
  wallet: Wallet;
}

export function WalletCard({ wallet }: WalletCardProps) {
  const flag = CURRENCY_FLAGS[wallet.currency] ?? '💱';
  const gradient = CURRENCY_COLORS[wallet.currency] ?? 'from-gray-500 to-gray-600';

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{flag}</span>
        <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">{wallet.currency}</span>
      </div>
      <div>
        <p className="text-xs text-white/70 mb-1">Balance</p>
        <p className="text-2xl font-bold">{parseFloat(wallet.balance.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
    </div>
  );
}
