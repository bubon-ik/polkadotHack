export interface PolkadotProject {
  id: string;
  name: string;
  description: string;
  category: 'Parachain' | 'DeFi' | 'NFT' | 'Developer Tools' | 'Infrastructure' | 'Governance';
  url: string;
  logo: string;
  tags: string[];
}

export interface UserSession {
  address: string;
  lastSpinTime: number;
  discoveredProjects: string[];
}

export interface WalletAccount {
  address: string;
  name?: string;
  source: string;
}

export interface RouletteState {
  isSpinning: boolean;
  currentProject: PolkadotProject | null;
  canSpin: boolean;
  cooldownRemaining: number;
  error: string | null;
}




