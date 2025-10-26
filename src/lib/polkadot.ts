// Polkadot.js integration for Paseo testnet
// This module must only be imported on client side

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_PASEO_RPC || 'wss://paseo-asset-hub-rpc.polkadot.io';

// Lazy-load Polkadot modules only on client side
let ApiPromise: any;
let WsProvider: any;
let web3Accounts: any;
let web3Enable: any;
let web3FromAddress: any;
let InjectedAccountWithMeta: any;

async function loadPolkadotModules(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  if (!ApiPromise) {
    try {
      // Dynamically import only on client
      const apiModule = await import('@polkadot/api');
      ApiPromise = apiModule.ApiPromise;
      WsProvider = apiModule.WsProvider;

      const extModule = await import('@polkadot/extension-dapp');
      web3Accounts = extModule.web3Accounts;
      web3Enable = extModule.web3Enable;
      web3FromAddress = extModule.web3FromAddress;

      const typesModule = await import('@polkadot/extension-inject/types');
      InjectedAccountWithMeta = typesModule.InjectedAccountWithMeta;
    } catch (e) {
      console.error('Failed to load Polkadot modules:', e);
      return false;
    }
  }

  return true;
}

let apiInstance: ApiPromise | null = null;

/**
 * Initialize and connect to Polkadot API
 */
export async function initializeApi(): Promise<any> {
  if (!(await loadPolkadotModules())) {
    throw new Error('Polkadot API is only available on client side');
  }

  if (apiInstance && apiInstance.isConnected) {
    return apiInstance;
  }

  const wsProvider = new WsProvider(RPC_ENDPOINT);
  apiInstance = await ApiPromise.create({ provider: wsProvider });
  
  await apiInstance.isReady;
  
  console.log(`Connected to ${await apiInstance.rpc.system.chain()} via ${RPC_ENDPOINT}`);
  
  return apiInstance;
}

/**
 * Get the current API instance
 */
export function getApi(): any {
  return apiInstance;
}

/**
 * Disconnect from the API
 */
export async function disconnectApi(): Promise<void> {
  if (apiInstance) {
    await apiInstance.disconnect();
    apiInstance = null;
  }
}

/**
 * Enable Polkadot.js extension and get accounts
 */
export async function connectWallet(): Promise<any[]> {
  if (!(await loadPolkadotModules())) {
    throw new Error('Wallet connection is only available on client side');
  }

  // Enable the extension
  const extensions = await web3Enable('Polkadot Discovery Roulette');
  
  if (extensions.length === 0) {
    throw new Error('No Polkadot.js extension found. Please install it from polkadot.js.org/extension/');
  }

  // Get all accounts
  const accounts = await web3Accounts();
  
  if (accounts.length === 0) {
    throw new Error('No accounts found. Please create an account in your Polkadot.js extension.');
  }

  return accounts;
}

/**
 * Get random number from latest block hash
 * This uses the block hash as entropy for on-chain randomness
 */
export async function getBlockRandomness(): Promise<number> {
  if (!(await loadPolkadotModules())) {
    throw new Error('Blockchain randomness is only available on client side');
  }

  const api = await initializeApi();
  
  // Get the latest finalized block hash
  const finalizedHash = await api.rpc.chain.getFinalizedHead();
  const block = await api.rpc.chain.getBlock(finalizedHash);
  
  // Use the parent hash for randomness (more stable)
  const blockHash = block.block.header.parentHash.toHex();
  
  // Convert hash to a number (use last 8 bytes for better distribution)
  const hashBytes = blockHash.slice(-16); // Last 8 bytes (16 hex chars)
  const randomValue = parseInt(hashBytes, 16);
  
  console.log(`Block randomness from block ${block.block.header.number}: ${randomValue}`);
  
  return randomValue;
}

/**
 * Get current block number
 */
export async function getCurrentBlockNumber(): Promise<number> {
  if (!(await loadPolkadotModules())) {
    throw new Error('Block number is only available on client side');
  }

  const api = await initializeApi();
  const header = await api.rpc.chain.getHeader();
  return header.number.toNumber();
}

/**
 * Get account balance
 */
export async function getAccountBalance(address: string): Promise<string> {
  if (!(await loadPolkadotModules())) {
    throw new Error('Account balance is only available on client side');
  }

  const api = await initializeApi();
  const accountInfo: any = await api.query.system.account(address);
  
  // Convert to human-readable format (PAS has 10 decimals on Paseo)
  const free = accountInfo.data.free.toString();
  const formatted = (Number(free) / 1e10).toFixed(4);
  
  return formatted;
}

/**
 * Sign a message with the connected wallet
 */
export async function signMessage(address: string, message: string): Promise<string> {
  if (!(await loadPolkadotModules())) {
    throw new Error('Message signing is only available on client side');
  }

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
}
