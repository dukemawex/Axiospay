'use client';

import { useRates } from '@/hooks/useRates';

const DISPLAY_PAIRS = ['NGN-UGX', 'NGN-KES', 'NGN-GHS', 'UGX-KES'];

export function RatesTicker() {
  const { rates, isLoading } = useRates();

  if (isLoading) return <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />;

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-6 overflow-x-auto">
      <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">LIVE RATES</span>
      {DISPLAY_PAIRS.map((pair) => {
        const rate = rates[pair];
        if (!rate) return null;
        const [from, to] = pair.split('-');
        return (
          <div key={pair} className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-xs font-medium text-gray-500">{from}/{to}</span>
            <span className="text-sm font-bold text-gray-900">{parseFloat(rate).toFixed(4)}</span>
          </div>
        );
      })}
    </div>
  );
}
