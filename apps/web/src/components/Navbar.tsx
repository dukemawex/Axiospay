'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import clsx from 'clsx';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/swap', label: 'Swap FX' },
  { href: '/wallet', label: 'Wallet' },
  { href: '/deposit', label: 'Deposit' },
  { href: '/profile', label: 'Profile' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="text-primary-700 font-bold text-xl tracking-tight">
            Axios Pay
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === href || pathname.startsWith(href + '/')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
