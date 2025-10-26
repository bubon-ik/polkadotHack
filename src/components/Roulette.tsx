'use client';

import { useEffect } from 'react';
import { useRouletteStore } from '@/store/useRouletteStore';
import { useWalletStore } from '@/store/useWalletStore';
import ProjectCard from './ProjectCard';

export default function Roulette() {
  const { account } = useWalletStore();
  const {
    currentProject,
    isSpinning,
    canSpin,
    cooldownRemaining,
    discoveredProjects,
    error,
    spin,
    resetSession,
    clearError,
  } = useRouletteStore();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSpin = async () => {
    if (!account) return;
    await spin(account.address);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto px-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        <div className="glass-panel rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-polkadot-pink">
            {discoveredProjects.length}
          </div>
          <div className="text-xs text-gray-400 mt-1">Discovered</div>
        </div>
        
        <div className="glass-panel rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-polkadot-purple">
            {20 - discoveredProjects.length}
          </div>
          <div className="text-xs text-gray-400 mt-1">Remaining</div>
        </div>

        <div className="glass-panel rounded-xl p-4 text-center col-span-2 sm:col-span-1">
          <div className={`text-3xl font-bold ${canSpin ? 'text-green-400' : 'text-yellow-400'}`}>
            {canSpin ? '✓' : cooldownRemaining}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {canSpin ? 'Ready' : 'Cooldown'}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-panel px-6 py-4 rounded-xl bg-red-500/20 border border-red-500/30 text-sm text-center max-w-md w-full">
          {error}
        </div>
      )}

      {/* Project Display */}
      {currentProject && !isSpinning && (
        <div className="w-full animate-fadeIn">
          <ProjectCard project={currentProject} />
        </div>
      )}

      {/* Spinning State */}
      {isSpinning && (
        <div className="glass-panel rounded-2xl p-12 max-w-2xl w-full flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-polkadot-pink/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-polkadot-pink border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-xl font-semibold text-center">
            Discovering your next project...
          </div>
          <div className="text-sm text-gray-400 text-center">
            Using Paseo block hash for randomness
          </div>
        </div>
      )}

      {/* No Project Yet */}
      {!currentProject && !isSpinning && (
        <div className="glass-panel rounded-2xl p-12 max-w-2xl w-full flex flex-col items-center justify-center gap-4">
          <div className="text-6xl">🎰</div>
          <div className="text-xl font-semibold text-center">
            Ready to Discover?
          </div>
          <div className="text-sm text-gray-400 text-center max-w-md">
            Click the spin button to discover a quality project from the Polkadot ecosystem.
            Each spin is powered by on-chain randomness from Paseo testnet!
          </div>
        </div>
      )}

      {/* Spin Button */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handleSpin}
          disabled={!canSpin || isSpinning || !account}
          className="polkadot-button px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[200px]"
        >
          {isSpinning ? (
            <span className="flex items-center gap-2 justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Spinning...
            </span>
          ) : !canSpin ? (
            `Wait ${cooldownRemaining}s`
          ) : (
            '🎲 Spin the Roulette'
          )}
        </button>

        {discoveredProjects.length > 0 && (
          <button
            onClick={resetSession}
            disabled={isSpinning}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Session
          </button>
        )}
      </div>

      {/* Info */}
      <div className="glass-panel rounded-xl p-6 max-w-2xl w-full">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span>ℹ️</span>
          How it works
        </h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-polkadot-pink">•</span>
            <span>Connect your Polkadot.js wallet to start discovering projects</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-polkadot-pink">•</span>
            <span>Each spin uses Paseo block hash for true on-chain randomness</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-polkadot-pink">•</span>
            <span>10-second cooldown between spins prevents abuse</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-polkadot-pink">•</span>
            <span>No duplicate projects - discover all 20 unique projects!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

