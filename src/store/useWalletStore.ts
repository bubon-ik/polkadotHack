'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  account: InjectedAccountWithMeta | null;
  accounts: InjectedAccountWithMeta[];
  error: string | null;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  selectAccount: (account: InjectedAccountWithMeta) => void;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      isConnecting: false,
      account: null,
      accounts: [],
      error: null,

      connect: async () => {
        set({ isConnecting: true, error: null });
        
        try {
          // Dynamically import Polkadot functions only on client side
          const { connectWallet } = await import('@/lib/polkadot');
          
          // Connect to wallet (doesn't require API connection)
          // API will be initialized lazily when needed (e.g., for roulette)
          const accounts = await connectWallet();
          
          set({
            accounts,
            account: accounts[0], // Select first account by default
            isConnected: true,
            isConnecting: false,
          });
          
          // Initialize API in background (non-blocking)
          // This allows wallet to connect even if RPC is temporarily unavailable
          import('@/lib/polkadot').then(({ initializeApi }) => {
            initializeApi().catch((err) => {
              console.warn('⚠️ Background API initialization failed (non-critical):', err);
            });
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
          set({
            error: errorMessage,
            isConnecting: false,
            isConnected: false,
          });
          throw error;
        }
      },

      disconnect: () => {
        set({
          isConnected: false,
          account: null,
          accounts: [],
          error: null,
        });
      },

      selectAccount: (account) => {
        set({ account });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        // Only persist the account address, not the full object
        accountAddress: state.account?.address,
      }),
    }
  )
);

