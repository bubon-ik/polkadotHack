import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Polkadot Discovery Roulette',
  description: 'Discover quality Polkadot ecosystem projects through blockchain-powered roulette on Paseo testnet',
  keywords: ['Polkadot', 'Blockchain', 'DeFi', 'NFT', 'Parachains', 'Web3', 'Discovery'],
  authors: [{ name: 'Polkadot Community' }],
  openGraph: {
    title: 'Polkadot Discovery Roulette',
    description: 'Discover quality Polkadot ecosystem projects',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

