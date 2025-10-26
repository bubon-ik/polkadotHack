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
          // Dynamically import Polkadot functions only on client side
          const { getBlockRandomness } = await import('@/lib/polkadot');
          
          // Get random number from block hash
          const randomSeed = await getBlockRandomness();
          
          // Simulate spinning animation
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Get a random project that hasn't been discovered yet
          const project = getRandomProject(randomSeed, state.discoveredProjects);
          
          if (!project) {
            set({ 
              error: 'Congratulations! You\'ve discovered all projects!',
              isSpinning: false,
              canSpin: false,
            });
            return;
          }

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
          const errorMessage = error instanceof Error ? error.message : 'Failed to spin roulette';
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

