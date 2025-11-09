'use client';

import { useEffect, useState } from 'react';
import WalletConnect from '@/components/WalletConnect';
import Roulette from '@/components/Roulette';
import { useWalletStore } from '@/store/useWalletStore';

export default function Home() {
  const { isConnected } = useWalletStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-polkadot-darkPurple via-gray-900 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-polkadot-pink/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-polkadot-purple/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🎰</div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-polkadot-pink to-polkadot-purple bg-clip-text text-transparent">
                    Polkadot Discovery Roulette
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Powered by Paseo Testnet (Relay Chain)
                  </p>
                </div>
              </div>
              
              <WalletConnect />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {isConnected ? (
            <Roulette />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-8">
              <div className="glass-panel rounded-2xl p-12 max-w-2xl text-center">
                <div className="text-6xl mb-6">🌐</div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-polkadot-pink to-polkadot-purple bg-clip-text text-transparent">
                  Welcome to Polkadot Discovery Roulette
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Discover quality projects from the Polkadot ecosystem through a fun,
                  blockchain-powered roulette system. Each spin is verifiably random,
                  using Paseo testnet block hashes for true on-chain randomness.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mt-8">
                  <div className="glass-panel rounded-xl p-4">
                    <div className="text-3xl mb-2">🔗</div>
                    <div className="text-sm font-semibold mb-1">Parachains</div>
                    <div className="text-xs text-gray-400">Discover layer-1 blockchains</div>
                  </div>
                  <div className="glass-panel rounded-xl p-4">
                    <div className="text-3xl mb-2">💎</div>
                    <div className="text-sm font-semibold mb-1">DeFi & NFTs</div>
                    <div className="text-xs text-gray-400">Explore financial protocols</div>
                  </div>
                  <div className="glass-panel rounded-xl p-4">
                    <div className="text-3xl mb-2">🛠️</div>
                    <div className="text-sm font-semibold mb-1">Dev Tools</div>
                    <div className="text-xs text-gray-400">Find builder resources</div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-4">
                    Connect your Polkadot.js wallet to get started
                  </p>
                  <WalletConnect />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 backdrop-blur-sm mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <div>
                <p>Built for Polkadot Builder Party Hackathon 2025</p>
                <p className="text-xs mt-1">Theme: User-centric Apps / Polkadot Tinkerers</p>
              </div>
              <div className="flex gap-6">
                <a
                  href="https://github.com/yourusername/polkadot-discovery-roulette"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-polkadot-pink transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://polkadot.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-polkadot-pink transition-colors"
                >
                  Polkadot
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_EXPLORER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-polkadot-pink transition-colors"
                >
                  Explorer
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

