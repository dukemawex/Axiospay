import { SwapWidget } from '@/components/SwapWidget';

export default function SwapPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">FX Swap</h1>
      <div className="max-w-lg">
        <SwapWidget />
      </div>
    </div>
  );
}
