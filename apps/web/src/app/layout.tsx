import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Axios Pay — Cross-Border FX, Unlocked',
  description: 'Send and exchange money across African borders instantly.',
  keywords: ['payment', 'Africa', 'FX', 'exchange', 'currency'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
