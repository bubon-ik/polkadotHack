'use client';

import { useEffect, useState } from 'react';
import { useWalletStore } from '@/store/useWalletStore';

export default function WalletConnect() {
  const { isConnected, isConnecting, account, accounts, error, connect, disconnect, selectAccount, clearError } = useWalletStore();
  const [extensionAvailable, setExtensionAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if extension is available
    const checkExtension = async () => {
      if (typeof window !== 'undefined') {
        const { isExtensionAvailable } = await import('@/lib/polkadot');
        setExtensionAvailable(isExtensionAvailable());
      }
    };
    checkExtension();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (isConnected && account) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {accounts.length > 1 && (
          <select
            value={account.address}
            onChange={(e) => {
              const selected = accounts.find(acc => acc.address === e.target.value);
              if (selected) selectAccount(selected);
            }}
            className="glass-panel px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-polkadot-pink"
          >
            {accounts.map((acc) => (
              <option key={acc.address} value={acc.address}>
                {acc.meta.name || 'Account'}
              </option>
            ))}
          </select>
        )}
        
        <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {account.meta.name || 'Account'}
            </span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:inline">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </span>
        </div>

        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all duration-200 text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {extensionAvailable === false && (
        <div className="glass-panel px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-sm max-w-md">
          <p className="font-semibold mb-1">⚠️ Extension Not Found</p>
          <p className="text-xs">
            Install <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer" className="underline hover:text-polkadot-pink">Polkadot.js Extension</a> and refresh the page
          </p>
        </div>
      )}
      
      {extensionAvailable !== false && (
        <div className="glass-panel px-4 py-3 rounded-lg bg-green-500/20 border border-green-500/30 text-sm max-w-md">
          <p className="font-semibold mb-2">✅ Ready to Use!</p>
          <p className="text-xs text-left mb-2">
            <strong>Important:</strong> You <strong>don't need</strong> to add Paseo network to your wallet!
          </p>
          <p className="text-xs text-left">
            The app will connect to Paseo network via RPC automatically. Just select any account from your wallet and click "Connect Wallet".
          </p>
          <div className="mt-2 pt-2 border-t border-green-500/30">
            <p className="text-xs text-yellow-300 mb-1">
              💡 You need PAS tokens for transactions. Get them from{' '}
              <a 
                href="https://paritytech.github.io/polkadot-testnet-faucet/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-yellow-200"
              >
                faucet
              </a>
            </p>
            <p className="text-xs text-orange-300">
              ⚠️ If transaction signing fails, you may need to add Paseo network manually in extension settings
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="glass-panel px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-sm max-w-md">
          <p className="font-semibold mb-1">❌ Connection Error</p>
          <p className="text-xs">{error}</p>
        </div>
      )}
      
      <button
        onClick={connect}
        disabled={isConnecting || extensionAvailable === false}
        className="polkadot-button px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Connecting...
          </span>
        ) : (
          'Connect Wallet'
        )}
      </button>
      
      <p className="text-xs text-gray-400 text-center max-w-xs">
        {extensionAvailable === false 
          ? 'Install Polkadot.js extension to continue'
          : 'Connect your Polkadot.js wallet. You can use any account!'
        }
      </p>
    </div>
  );
}




