'use client';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

// Comprehensive list of Paseo RPC endpoints with priority order
// Using Paseo Relay Chain endpoints (not Asset Hub)
// Based on official Paseo documentation: https://github.com/paseo-network
const RPC_ENDPOINTS = [
  // Use environment variable if set, otherwise use official Paseo Relay Chain endpoint
  process.env.NEXT_PUBLIC_PASEO_RPC || 'wss://paseo-rpc.polkadot.io',
  // Official Paseo Relay Chain endpoints
  'wss://paseo-rpc.polkadot.io',
  // Dwellir endpoints (more stable, may require API key)
  'wss://paseo-rpc.dwellir.com',
  // Alternative endpoints
  'wss://paseo.public.curie.radiumblock.co/ws',
  // Fallback to Asset Hub if Relay Chain is unavailable
  'wss://paseo-asset-hub-rpc.polkadot.io',
];

let apiInstance: ApiPromise | null = null;
let connectionPromise: Promise<ApiPromise> | null = null;
let isConnecting = false;

/**
 * Initialize and connect to Polkadot API with robust retry logic
 * Uses connection pooling to avoid multiple simultaneous connection attempts
 */
export async function initializeApi(forceReconnect = false): Promise<ApiPromise> {
  // Return existing connection if valid
  if (!forceReconnect && apiInstance && apiInstance.isConnected) {
    try {
      // Quick health check
      await apiInstance.rpc.system.chain();
      return apiInstance;
    } catch (e) {
      // Connection is stale, force reconnect
      console.warn('⚠️ Stale connection detected, reconnecting...');
      apiInstance = null;
    }
  }

  // If already connecting, return the existing promise
  if (connectionPromise && !forceReconnect) {
    return connectionPromise;
  }

  // Create new connection promise
  connectionPromise = (async () => {
    isConnecting = true;
    let lastError: Error | null = null;
    
    // Try each endpoint with timeout
    for (let i = 0; i < RPC_ENDPOINTS.length; i++) {
      const endpoint = RPC_ENDPOINTS[i];
      
      try {
        console.log(`🔌 [${i + 1}/${RPC_ENDPOINTS.length}] Connecting to ${endpoint}...`);
        
        // Create provider with shorter timeout for faster failover
        const wsProvider = new WsProvider(endpoint, 8000);
        
        // Create API instance with optimized settings
        const newApi = await Promise.race([
          ApiPromise.create({ 
            provider: wsProvider,
            noInitWarn: true,
            throwOnConnect: false, // Don't throw on initial connection issues
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 12000)
          )
        ]);
        
        // Set up error handlers BEFORE isReady
        newApi.on('error', (error) => {
          console.warn(`⚠️ API error on ${endpoint}:`, error);
          // Mark as disconnected but don't throw - let retry logic handle it
          if (apiInstance === newApi) {
            apiInstance = null;
          }
        });
        
        newApi.on('disconnected', () => {
          console.warn(`⚠️ Disconnected from ${endpoint}`);
          // Mark as disconnected
          if (apiInstance === newApi) {
            apiInstance = null;
          }
        });
        
        // Wait for API to be ready with timeout
        await Promise.race([
          newApi.isReady,
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('API ready timeout')), 10000)
          )
        ]);
        
        // Verify connection with a quick RPC call
        const chainName = await Promise.race([
          newApi.rpc.system.chain(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('RPC call timeout')), 5000)
          )
        ]);
        
        // Verify we're connected to Paseo network
        const chainNameStr = chainName.toString();
        console.log(`🔍 Connected to chain: ${chainNameStr}`);
        
        // Warn if not connected to Paseo (but don't fail)
        if (!chainNameStr.toLowerCase().includes('paseo') && 
            !chainNameStr.toLowerCase().includes('testnet')) {
          console.warn(`⚠️ Warning: Connected to ${chainNameStr}, expected Paseo testnet`);
        }
        
        apiInstance = newApi;
        isConnecting = false;
        connectionPromise = null;
        
        console.log(`✅ Successfully connected to ${chainNameStr} via ${endpoint}`);
        return apiInstance;
        
      } catch (error) {
        console.warn(`❌ Failed to connect to ${endpoint}:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Clean up failed instance
        if (apiInstance) {
          try {
            await apiInstance.disconnect();
          } catch (e) {
            // Ignore cleanup errors
          }
          apiInstance = null;
        }
        
        // Continue to next endpoint
        continue;
      }
    }
    
    // All endpoints failed
    isConnecting = false;
    connectionPromise = null;
    
    const errorMessage = lastError 
      ? `Failed to connect to any RPC endpoint. Last error: ${lastError.message}`
      : 'Failed to connect to blockchain';
    
    console.error('❌', errorMessage);
    throw new Error(errorMessage);
  })();

  return connectionPromise;
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
 * 
 * NOTE: You don't need to have Paseo network added in the wallet!
 * The wallet can work with any account - the app connects to Paseo via RPC.
 * However, for better UX, users can add Paseo network through Polkadot.js Apps.
 */
export async function connectWallet(): Promise<InjectedAccountWithMeta[]> {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('Wallet connection is only available in browser');
    }

    // Check if extension is available
    if (!isExtensionAvailable()) {
      throw new Error('Polkadot.js Extension not found. Please install it from https://polkadot.js.org/extension/ and refresh the page.');
    }

    console.log('🔌 Attempting to enable Polkadot.js extension...');
    console.log('💡 Note: Any account will work - app connects to Paseo via RPC');
    
    // Enable the extension
    const extensions = await web3Enable('Polkadot Discovery Roulette');
    
    console.log(`📦 Found ${extensions.length} extension(s):`, extensions.map(ext => ext.name));
    
    if (extensions.length === 0) {
      throw new Error('Polkadot.js Extension did not respond. Make sure the extension is installed and enabled in your browser. Then refresh the page.');
    }

    // Get all accounts (works with any network account)
    console.log('🔍 Fetching accounts...');
    const accounts = await web3Accounts();
    
    console.log(`📋 Found ${accounts.length} account(s)`);
    
    if (accounts.length === 0) {
      throw new Error('No accounts found. Please create or import an account in Polkadot.js Extension.');
    }

    console.log(`✅ Successfully connected ${accounts.length} account(s)`);
    console.log('💡 App will connect to Paseo network via RPC, regardless of wallet network setting');
    return accounts;
  } catch (error) {
    console.error('❌ Failed to connect wallet:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      // Re-throw with the same message if it's already user-friendly
      if (error.message.includes('not found') || 
          error.message.includes('did not respond') || 
          error.message.includes('No accounts')) {
        throw error;
      }
      
      // Handle specific error cases
      if (error.message.includes('User rejected')) {
        throw new Error('Connection rejected. Please allow access to the application in Polkadot.js Extension.');
      }
      
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        throw new Error('Connection timeout. Make sure Polkadot.js Extension is active and refresh the page.');
      }
    }
    
    throw error;
  }
}

/**
 * Get random number from latest block hash
 * This uses the block hash as entropy for on-chain randomness
 * Falls back to local randomness if blockchain is unavailable
 * 
 * This function is designed to always succeed, even if blockchain is down
 */
export async function getBlockRandomness(): Promise<number> {
  // Enhanced timeout wrapper with better error handling
  const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  };

  try {
    console.log('🎲 Attempting to get block randomness from blockchain...');
    
    // Try to get randomness from blockchain with aggressive timeout
    // If this fails, we'll use fallback immediately
    let api: ApiPromise;
    try {
      api = await withTimeout(initializeApi(false), 6000, 'API initialization');
    } catch (error) {
      throw new Error('Cannot connect to blockchain');
    }
    
    // Quick health check
    if (!api) {
      throw new Error('API instance is null');
    }
    
    // Try to verify connection is still alive
    try {
      await withTimeout(api.rpc.system.chain(), 3000, 'Health check');
    } catch (e) {
      // Connection died, try to reconnect once
      console.warn('⚠️ Connection lost, attempting reconnect...');
      try {
        api = await withTimeout(initializeApi(true), 5000, 'Reconnection');
      } catch (reconnectError) {
        throw new Error('Reconnection failed');
      }
    }
    
    // Get the latest finalized block hash with timeout
    const finalizedHash = await withTimeout(
      api.rpc.chain.getFinalizedHead(), 
      4000, 
      'Get finalized head'
    );
    
    const block = await withTimeout(
      api.rpc.chain.getBlock(finalizedHash), 
      4000, 
      'Get block'
    );
    
    // Use the parent hash for randomness (more stable)
    const blockHash = block.block.header.parentHash.toHex();
    
    // Convert hash to a number (use last 8 bytes for better distribution)
    const hashBytes = blockHash.slice(-16); // Last 8 bytes (16 hex chars)
    const randomValue = parseInt(hashBytes, 16);
    
    console.log(`✅ Block randomness from block ${block.block.header.number}: ${randomValue}`);
    
    return randomValue;
  } catch (error) {
    console.warn('⚠️ Failed to get block randomness from blockchain, using fallback:', error);
    
    // Enhanced fallback: combine timestamp, Math.random, and crypto for better randomness
    const timestamp = Date.now();
    const randomPart = Math.random();
    const cryptoArray = new Uint32Array(2);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(cryptoArray);
    }
    const cryptoValue = cryptoArray[0] || Math.floor(Math.random() * 1000000);
    
    const fallbackValue = Math.floor(
      (timestamp % 1000000) + 
      (randomPart * 1000000) + 
      (cryptoValue % 1000000)
    ) % 2000000;
    
    console.log(`🎲 Using enhanced fallback randomness: ${fallbackValue}`);
    return fallbackValue;
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

/**
 * Send a transaction to record roulette spin result on-chain
 * Uses system.remark to store the project ID and random seed
 * 
 * This function handles connection failures gracefully and provides
 * clear error messages to the user
 */
export async function recordSpinOnChain(
  address: string,
  projectId: string,
  randomSeed: number
): Promise<string> {
  const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error(`Operation timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  };

  try {
    console.log('📝 Preparing transaction to record spin on-chain...');
    
    // Try to get API connection with timeout (shorter timeout for faster failover)
    let api: ApiPromise;
    let connectionAttempts = 0;
    const maxAttempts = 2;
    
    while (connectionAttempts < maxAttempts) {
      try {
        console.log(`🔌 Connection attempt ${connectionAttempts + 1}/${maxAttempts}...`);
        api = await withTimeout(initializeApi(connectionAttempts > 0), 6000);
        
        // Verify API is connected and healthy
        if (!api) {
          throw new Error('API instance is null');
        }
        
        // Quick health check
        try {
          await withTimeout(api.rpc.system.chain(), 2000);
          console.log('✅ API connection verified');
          break; // Success, exit loop
        } catch (healthError) {
          console.warn('⚠️ Health check failed, will retry...');
          if (connectionAttempts === maxAttempts - 1) {
            throw new Error('Failed to establish stable connection to blockchain');
          }
        }
      } catch (error) {
        connectionAttempts++;
        if (connectionAttempts >= maxAttempts) {
          throw new Error('Failed to connect to blockchain after multiple attempts. Check your internet connection.');
        }
        console.warn(`⚠️ Connection attempt ${connectionAttempts} failed, retrying...`);
        // Wait a bit before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!api) {
      throw new Error('API instance is null after connection attempts');
    }

    // Get the injector for signing
    console.log('🔑 Getting wallet injector for address:', address);
    const injector = await web3FromAddress(address);
    
    if (!injector || !injector.signer) {
      throw new Error('Failed to get signing device from wallet. Make sure the wallet is connected and unlocked.');
    }
    
    console.log('✅ Injector obtained:', {
      hasSigner: !!injector.signer,
      hasSignPayload: !!injector.signer.signPayload,
      hasSignRaw: !!injector.signer.signRaw,
    });
    
    // Get chain info for better error messages
    const chainInfo = await api.rpc.system.chain();
    const chainName = chainInfo.toString();
    console.log('🔗 Chain info:', chainName);
    
    // Create remark data: JSON string with project info
    const remarkData = JSON.stringify({
      type: 'roulette_spin',
      projectId,
      randomSeed,
      timestamp: Date.now(),
    });

    // Convert to bytes
    const remarkBytes = api.createType('Bytes', remarkData);

    // Create transaction
    const tx = api.tx.system.remark(remarkBytes);
    
    // Get transaction details for logging
    const txDetails = {
      method: tx.method.method,
      section: tx.method.section,
      args: tx.method.args.length,
    };
    console.log('📝 Transaction created:', txDetails);
    console.log('   Project ID:', projectId);
    console.log('   Random seed:', randomSeed);
    console.log('   Chain:', chainName);
    console.log('   ⚠️ Please sign the transaction in your wallet');
    console.log('   💡 If the signing window did not appear, check that Paseo network is added to the wallet');
    
    // Send transaction and wait for it to be included in a block
    return new Promise((resolve, reject) => {
      let resolved = false;
      let unsubscribeFn: (() => void) | null = null;
      let signPromptShown = false;
      
      // Set overall timeout for transaction (90 seconds - shorter for faster feedback)
      const overallTimeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          if (unsubscribeFn) unsubscribeFn();
          reject(new Error('Timeout: transaction was not confirmed. There may be a blockchain connection issue.'));
        }
      }, 90000);
      
      // Set timeout for sign prompt (30 seconds)
      const signPromptTimeout = setTimeout(() => {
        if (!signPromptShown && !resolved) {
          console.warn('⚠️ Sign prompt timeout - wallet may not be responding');
        }
      }, 30000);
      
      console.log('📤 Sending transaction to wallet for signing...');
      
      tx.signAndSend(
        address,
        { signer: injector.signer },
        ({ status, txHash, events }) => {
          signPromptShown = true;
          clearTimeout(signPromptTimeout);
          console.log('📡 Transaction status:', status.type);
          
          if (status.isInBlock || status.isFinalized) {
            console.log(`✅ Transaction included in block: ${status.asInBlock.toString()}`);
            console.log(`   Transaction hash: ${txHash.toString()}`);
            
            const hash = txHash.toString();
            
            if (status.isFinalized && !resolved) {
              resolved = true;
              clearTimeout(overallTimeout);
              if (unsubscribeFn) unsubscribeFn();
              resolve(hash);
            }
          } else if (status.isError) {
            console.error('❌ Transaction error:', status);
            if (!resolved) {
              resolved = true;
              clearTimeout(overallTimeout);
              clearTimeout(signPromptTimeout);
              if (unsubscribeFn) unsubscribeFn();
              reject(new Error('Transaction rejected by blockchain'));
            }
          }
        }
      ).then((unsubscribe) => {
        unsubscribeFn = unsubscribe;
        console.log('✅ Transaction sent to wallet, waiting for signature...');
        console.log('   💡 Check your wallet window - a transaction signing window should appear');
        console.log('   💡 If the window did not appear, Paseo network may not be added to the wallet');
      }).catch((error) => {
        clearTimeout(overallTimeout);
        clearTimeout(signPromptTimeout);
        console.error('❌ Failed to send transaction:', error);
        console.error('   Error details:', {
          message: error?.message,
          name: error?.name,
          stack: error?.stack?.split('\n').slice(0, 3).join('\n'),
        });
        
        // Handle user rejection
        if (error && error.message && (
          error.message.includes('User rejected') || 
          error.message.includes('cancelled') ||
          error.message.includes('Cancelled') ||
          error.message.includes('Rejected') ||
          error.message.includes('rejected')
        )) {
          reject(new Error('Transaction rejected by user'));
        } else if (error && error.message && (
          error.message.includes('not connected') ||
          error.message.includes('disconnected') ||
          error.message.includes('connection')
        )) {
          reject(new Error('Failed to connect to blockchain for transaction. Check your internet connection.'));
        } else if (error && error.message && (
          error.message.includes('timeout') ||
          error.message.includes('Timeout')
        )) {
          reject(new Error('Transaction timeout. Possible blockchain connection issue or wallet not responding.'));
        } else if (error && error.message && (
          error.message.includes('signer') ||
          error.message.includes('Signer') ||
          error.message.includes('injector')
        )) {
          reject(new Error('Wallet issue. Make sure the wallet is unlocked and Paseo network is added.'));
        } else {
          const errorMsg = error?.message || 'Unknown error sending transaction';
          console.error('   Full error:', error);
          reject(new Error(`Error: ${errorMsg}. Check console for details.`));
        }
      });
    });
  } catch (error) {
    console.error('Failed to record spin on-chain:', error);
    
    // Provide user-friendly error message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error sending transaction');
  }
}
