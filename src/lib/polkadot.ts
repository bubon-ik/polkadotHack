'use client';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

// Use a more stable RPC endpoint for Paseo
// Fallback endpoints in case primary fails
const RPC_ENDPOINTS = [
  process.env.NEXT_PUBLIC_PASEO_RPC || 'wss://paseo-asset-hub-rpc.polkadot.io',
  'wss://paseo-rpc.polkadot.io',
  'wss://paseo-rpc.dwellir.com',
];

const RPC_ENDPOINT = RPC_ENDPOINTS[0];

let apiInstance: ApiPromise | null = null;

/**
 * Initialize and connect to Polkadot API
 */
export async function initializeApi(): Promise<ApiPromise> {
  if (apiInstance && apiInstance.isConnected) {
    return apiInstance;
  }

  // Try each endpoint until one works
  let lastError: Error | null = null;
  
  for (const endpoint of RPC_ENDPOINTS) {
    try {
      console.log(`🔌 Attempting to connect to ${endpoint}...`);
      
      const wsProvider = new WsProvider(endpoint, 10000); // 10 second timeout
      apiInstance = await ApiPromise.create({ 
        provider: wsProvider,
        noInitWarn: true, // Suppress initialization warnings
      });
      
      // Set up error handlers
      apiInstance.on('error', (error) => {
        console.warn('⚠️ API connection error:', error);
      });
      
      apiInstance.on('disconnected', () => {
        console.warn('⚠️ API disconnected, will attempt to reconnect...');
      });
      
      await apiInstance.isReady;
      
      const chainName = await apiInstance.rpc.system.chain();
      console.log(`✅ Connected to ${chainName} via ${endpoint}`);
      
      return apiInstance;
    } catch (error) {
      console.warn(`❌ Failed to connect to ${endpoint}:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Clean up failed instance
      if (apiInstance) {
        try {
          await apiInstance.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
        apiInstance = null;
      }
      
      // Try next endpoint
      continue;
    }
  }
  
  // If all endpoints failed
  const errorMessage = lastError 
    ? `Failed to connect to any RPC endpoint. Last error: ${lastError.message}`
    : 'Failed to connect to any RPC endpoint';
  console.error('❌', errorMessage);
  throw new Error(errorMessage);
}

/**
 * Get the current API instance
 */
export function getApi(): ApiPromise | null {
  return apiInstance;
}

/**
 * Disconnect from the API
 */
export async function disconnectApi(): Promise<void> {
  if (apiInstance) {
    try {
      await apiInstance.disconnect();
    } catch (error) {
      console.error('Error disconnecting API:', error);
    }
    apiInstance = null;
  }
}

/**
 * Check if Polkadot.js extension is available
 */
export function isExtensionAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if window.injectedWeb3 exists
  return typeof (window as any).injectedWeb3 !== 'undefined';
}

/**
 * Enable Polkadot.js extension and get accounts
 */
export async function connectWallet(): Promise<InjectedAccountWithMeta[]> {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('Wallet connection is only available in browser');
    }

    // Check if extension is available
    if (!isExtensionAvailable()) {
      throw new Error('Polkadot.js Extension не найден. Пожалуйста, установите расширение из https://polkadot.js.org/extension/ и обновите страницу.');
    }

    console.log('🔌 Attempting to enable Polkadot.js extension...');
    
    // Enable the extension
    const extensions = await web3Enable('Polkadot Discovery Roulette');
    
    console.log(`📦 Found ${extensions.length} extension(s):`, extensions.map(ext => ext.name));
    
    if (extensions.length === 0) {
      throw new Error('Расширение Polkadot.js не ответило. Убедитесь, что расширение установлено и включено в браузере. Затем обновите страницу.');
    }

    // Get all accounts
    console.log('🔍 Fetching accounts...');
    const accounts = await web3Accounts();
    
    console.log(`📋 Found ${accounts.length} account(s)`);
    
    if (accounts.length === 0) {
      throw new Error('Аккаунты не найдены. Пожалуйста, создайте или импортируйте аккаунт в расширении Polkadot.js.');
    }

    console.log(`✅ Successfully connected ${accounts.length} account(s)`);
    return accounts;
  } catch (error) {
    console.error('❌ Failed to connect wallet:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      // Re-throw with the same message if it's already user-friendly
      if (error.message.includes('не найден') || 
          error.message.includes('не ответило') || 
          error.message.includes('не найдены')) {
        throw error;
      }
      
      // Handle specific error cases
      if (error.message.includes('User rejected')) {
        throw new Error('Подключение отклонено. Пожалуйста, разрешите доступ приложению в расширении Polkadot.js.');
      }
      
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        throw new Error('Таймаут подключения. Убедитесь, что расширение Polkadot.js активно и обновите страницу.');
      }
    }
    
    throw error;
  }
}

/**
 * Get random number from latest block hash
 * This uses the block hash as entropy for on-chain randomness
 */
export async function getBlockRandomness(): Promise<number> {
  try {
    const api = await initializeApi();
    
    // Get the latest finalized block hash
    const finalizedHash = await api.rpc.chain.getFinalizedHead();
    const block = await api.rpc.chain.getBlock(finalizedHash);
    
    // Use the parent hash for randomness (more stable)
    const blockHash = block.block.header.parentHash.toHex();
    
    // Convert hash to a number (use last 8 bytes for better distribution)
    const hashBytes = blockHash.slice(-16); // Last 8 bytes (16 hex chars)
    const randomValue = parseInt(hashBytes, 16);
    
    console.log(`🎲 Block randomness from block ${block.block.header.number}: ${randomValue}`);
    
    return randomValue;
  } catch (error) {
    console.error('Failed to get block randomness:', error);
    // Fallback to Math.random if blockchain connection fails
    return Math.floor(Math.random() * 1000000);
  }
}

/**
 * Get current block number
 */
export async function getCurrentBlockNumber(): Promise<number> {
  try {
    const api = await initializeApi();
    const header = await api.rpc.chain.getHeader();
    return header.number.toNumber();
  } catch (error) {
    console.error('Failed to get block number:', error);
    return 0;
  }
}

/**
 * Get account balance
 */
export async function getAccountBalance(address: string): Promise<string> {
  try {
    const api = await initializeApi();
    const accountInfo: any = await api.query.system.account(address);
    
    // Convert to human-readable format (PAS has 10 decimals on Paseo)
    const free = accountInfo.data.free.toString();
    const formatted = (Number(free) / 1e10).toFixed(4);
    
    return formatted;
  } catch (error) {
    console.error('Failed to get account balance:', error);
    return '0.0000';
  }
}

/**
 * Sign a message with the connected wallet
 */
export async function signMessage(address: string, message: string): Promise<string> {
  try {
    const injector = await web3FromAddress(address);
    
    if (!injector.signer.signRaw) {
      throw new Error('Signer does not support raw signing');
    }

    const { signature } = await injector.signer.signRaw({
      address,
      data: message,
      type: 'bytes',
    });

    return signature;
  } catch (error) {
    console.error('Failed to sign message:', error);
    throw error;
  }
}
