'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PolkadotProject } from '@/types';
import { getRandomProject } from '@/data/projects';

const COOLDOWN_SECONDS = 10;

interface RouletteState {
  currentProject: PolkadotProject | null;
  isSpinning: boolean;
  canSpin: boolean;
  cooldownRemaining: number;
  lastSpinTime: number;
  discoveredProjects: string[];
  error: string | null;
  
  // Actions
  spin: (userAddress: string) => Promise<void>;
  updateCooldown: () => void;
  resetSession: () => void;
  clearError: () => void;
}

export const useRouletteStore = create<RouletteState>()(
  persist(
    (set, get) => ({
      currentProject: null,
      isSpinning: false,
      canSpin: true,
      cooldownRemaining: 0,
      lastSpinTime: 0,
      discoveredProjects: [],
      error: null,

      spin: async (userAddress: string) => {
        const state = get();
        
        // Check if still in cooldown
        const timeSinceLastSpin = Date.now() - state.lastSpinTime;
        if (timeSinceLastSpin < COOLDOWN_SECONDS * 1000) {
          set({ 
            error: `Please wait ${Math.ceil((COOLDOWN_SECONDS * 1000 - timeSinceLastSpin) / 1000)} seconds before spinning again` 
          });
          return;
        }

        set({ isSpinning: true, canSpin: false, error: null });

        try {
          console.log('🎰 Starting roulette spin...');
          
          // Dynamically import Polkadot functions only on client side
          const { getBlockRandomness } = await import('@/lib/polkadot');
          
          // Get random number from block hash (with fallback)
          // This will always succeed, even if blockchain is unavailable
          let randomSeed: number;
          try {
            randomSeed = await getBlockRandomness();
            console.log('✅ Got randomness:', randomSeed);
          } catch (error) {
            console.warn('⚠️ Error getting block randomness, using fallback:', error);
            // Fallback randomness if blockchain fails
            randomSeed = Math.floor(Math.random() * 1000000);
          }
          
          // Simulate spinning animation
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Get a random project that hasn't been discovered yet
          const project = getRandomProject(randomSeed, state.discoveredProjects);
          
          if (!project) {
            set({ 
              error: '🎉 Congratulations! You\'ve discovered all projects!',
              isSpinning: false,
              canSpin: false,
            });
            return;
          }

          console.log('✅ Selected project:', project.name);

          // Record spin on-chain via transaction (non-blocking)
          // This requires user to sign the transaction in their wallet
          // We don't wait for this to complete before showing the project
          (async () => {
            try {
              const { recordSpinOnChain, getApi } = await import('@/lib/polkadot');
              
              // Check if we have a stable connection before attempting transaction
              const api = getApi();
              if (!api || !api.isConnected) {
                console.warn('⚠️ No stable API connection, skipping transaction');
                set({ 
                  error: 'Project discovered! Transaction not sent due to blockchain connection issues. Try again later.' 
                });
                return;
              }
              
              console.log('📝 Sending transaction to record spin on-chain...');
              console.log('   Please sign the transaction in your wallet');
              
              const txHash = await recordSpinOnChain(userAddress, project.id, randomSeed);
              console.log('✅ Transaction successfully sent:', txHash);
              
              // Clear any previous error messages
              const currentState = get();
              if (currentState.error && currentState.error.includes('transaction')) {
                set({ error: null });
              }
            } catch (txError) {
              console.error('❌ Failed to send transaction:', txError);
              
              // Provide user-friendly error message
              let errorMsg = 'Project discovered, but transaction was not sent.';
              if (txError instanceof Error) {
                const msg = txError.message.toLowerCase();
                if (msg.includes('rejected')) {
                  errorMsg = 'Transaction rejected. Project discovered, but not recorded on-chain.';
                } else if (msg.includes('connection') || msg.includes('disconnected')) {
                  errorMsg = 'Project discovered! Failed to connect to blockchain for transaction. Check your internet.';
                } else if (msg.includes('timeout')) {
                  errorMsg = 'Transaction timeout. Project discovered, but transaction was not sent.';
                } else {
                  errorMsg = `Project discovered! Transaction not sent: ${txError.message}`;
                }
              }
              
              // Don't fail the spin if transaction fails - user can still see the result
              // Only show error if it's not already showing
              const currentState = get();
              if (!currentState.error || !currentState.error.includes('transaction')) {
                set({ error: errorMsg });
              }
            }
          })(); // Fire and forget - don't block the UI

          // Update state with new project
          set({
            currentProject: project,
            isSpinning: false,
            lastSpinTime: Date.now(),
            discoveredProjects: [...state.discoveredProjects, project.id],
            cooldownRemaining: COOLDOWN_SECONDS,
          });

          // Start cooldown timer
          get().updateCooldown();
        } catch (error) {
          console.error('❌ Error in spin:', error);
          const errorMessage = error instanceof Error 
            ? `Error: ${error.message}` 
            : 'Failed to spin roulette. Please try again.';
          set({
            error: errorMessage,
            isSpinning: false,
            canSpin: true,
          });
        }
      },

      updateCooldown: () => {
        const state = get();
        const timeSinceLastSpin = Date.now() - state.lastSpinTime;
        const remaining = Math.max(0, COOLDOWN_SECONDS - Math.floor(timeSinceLastSpin / 1000));
        
        set({ 
          cooldownRemaining: remaining,
          canSpin: remaining === 0,
        });

        if (remaining > 0) {
          setTimeout(() => {
            get().updateCooldown();
          }, 1000);
        }
      },

      resetSession: () => {
        set({
          currentProject: null,
          discoveredProjects: [],
          lastSpinTime: 0,
          cooldownRemaining: 0,
          canSpin: true,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'roulette-storage',
      partialize: (state) => ({
        discoveredProjects: state.discoveredProjects,
        lastSpinTime: state.lastSpinTime,
      }),
    }
  )
);

