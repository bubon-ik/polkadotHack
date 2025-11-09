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
          <p className="font-semibold mb-1">⚠️ Расширение не найдено</p>
          <p className="text-xs">
            Установите <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer" className="underline hover:text-polkadot-pink">Polkadot.js Extension</a> и обновите страницу
          </p>
        </div>
      )}
      
      {error && (
        <div className="glass-panel px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-sm max-w-md">
          <p className="font-semibold mb-1">❌ Ошибка подключения</p>
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
            Подключение...
          </span>
        ) : (
          'Подключить кошелек'
        )}
      </button>
      
      <p className="text-xs text-gray-400 text-center max-w-xs">
        {extensionAvailable === false 
          ? 'Установите расширение Polkadot.js для продолжения'
          : 'Подключите ваш Polkadot.js кошелек для начала'
        }
      </p>
    </div>
  );
}




