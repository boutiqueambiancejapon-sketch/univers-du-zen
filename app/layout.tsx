import type { Metadata } from 'next';
import { Fraunces, DM_Sans } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Univers du Zen',
    template: '%s | Univers du Zen',
  },
  description: 'Votre boutique de bien-être : aromathérapie, bougies, encens, pierres & déco. Livraison France, Belgique, Luxembourg.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://universduzen.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
