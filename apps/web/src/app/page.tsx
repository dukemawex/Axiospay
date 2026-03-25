import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-700 to-accent-500">
      <nav className="flex items-center justify-between px-8 py-6">
        <span className="text-white text-2xl font-bold tracking-tight">Axios Pay</span>
        <div className="flex gap-4">
          <Link href="/login" className="text-white/80 hover:text-white font-medium transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="bg-white text-primary-700 px-5 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-4 pt-24 pb-32">
        <span className="bg-white/10 text-white text-sm px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
          🌍 Cross-Border African FX Platform
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          Cross-Border FX,
          <br />
          <span className="text-accent-500">Unlocked.</span>
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mb-10">
          Send and exchange money across Africa instantly. NGN, UGX, KES, GHS — all in one platform with live rates and zero hidden fees.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="bg-accent-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent-600 transition-colors">
            Start Exchanging →
          </Link>
          <Link href="/login" className="bg-white/10 text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors backdrop-blur-sm">
            Sign In
          </Link>
        </div>
      </section>

      <section className="bg-white/5 backdrop-blur-sm py-16 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { pair: 'NGN → UGX', flag: '🇳🇬 → 🇺🇬' },
            { pair: 'NGN → KES', flag: '🇳🇬 → 🇰🇪' },
            { pair: 'NGN → GHS', flag: '🇳🇬 → 🇬🇭' },
            { pair: 'UGX → KES', flag: '🇺🇬 → 🇰🇪' },
          ].map(({ pair, flag }) => (
            <div key={pair} className="bg-white/10 rounded-xl p-5 text-center text-white">
              <div className="text-2xl mb-2">{flag}</div>
              <div className="font-semibold text-sm">{pair}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
