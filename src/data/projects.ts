import { PolkadotProject } from '@/types';

/**
 * Curated list of quality Polkadot ecosystem projects
 * This database can be expanded by the community
 */
export const polkadotProjects: PolkadotProject[] = [
  // Parachains
  {
    id: 'acala',
    name: 'Acala',
    description: 'DeFi hub and stablecoin platform for Polkadot, providing a suite of financial applications including a decentralized stablecoin (aUSD), staking derivative (LDOT), and a DEX.',
    category: 'Parachain',
    url: 'https://acala.network',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/acala.svg',
    tags: ['DeFi', 'Stablecoin', 'DEX'],
  },
  {
    id: 'moonbeam',
    name: 'Moonbeam',
    description: 'Ethereum-compatible smart contract parachain on Polkadot. Allows developers to deploy existing Solidity smart contracts with minimal changes.',
    category: 'Parachain',
    url: 'https://moonbeam.network',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/moonbeam.svg',
    tags: ['Smart Contracts', 'EVM', 'DApp Platform'],
  },
  {
    id: 'astar',
    name: 'Astar Network',
    description: 'Multi-chain smart contract platform supporting both EVM and WASM, with a unique dApp staking mechanism that rewards developers.',
    category: 'Parachain',
    url: 'https://astar.network',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/astar.png',
    tags: ['Smart Contracts', 'WASM', 'EVM', 'dApp Staking'],
  },
  {
    id: 'polkadex',
    name: 'Polkadex',
    description: 'Decentralized exchange combining orderbook and AMM models with high-speed trading and low fees.',
    category: 'DeFi',
    url: 'https://polkadex.trade',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/polkadex.svg',
    tags: ['DEX', 'Trading', 'Orderbook'],
  },
  {
    id: 'hydradx',
    name: 'HydraDX',
    description: 'Next-gen AMM protocol designed to bring liquidity to the Polkadot ecosystem with its innovative Omnipool design.',
    category: 'DeFi',
    url: 'https://hydradx.io',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/hydradx.svg',
    tags: ['DEX', 'AMM', 'Liquidity'],
  },
  {
    id: 'unique',
    name: 'Unique Network',
    description: 'NFT-focused blockchain with advanced features like sponsored transactions, nested NFTs, and customizable properties.',
    category: 'NFT',
    url: 'https://unique.network',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/unique.svg',
    tags: ['NFT', 'Digital Assets', 'Gaming'],
  },
  {
    id: 'rmrk',
    name: 'RMRK',
    description: 'Advanced NFT system with features like nested NFTs, conditional rendering, NFT ownership by NFTs, and more.',
    category: 'NFT',
    url: 'https://rmrk.app',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/nodes/rmrk.svg',
    tags: ['NFT', 'Standards', 'Innovation'],
  },
  {
    id: 'subscan',
    name: 'Subscan',
    description: 'High-precision blockchain explorer for Polkadot and Substrate-based chains with detailed analytics and APIs.',
    category: 'Developer Tools',
    url: 'https://www.subscan.io',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/external/subscan.svg',
    tags: ['Explorer', 'Analytics', 'API'],
  },
  {
    id: 'polkadot-js',
    name: 'Polkadot.js',
    description: 'Collection of tools, utilities and libraries for interacting with Polkadot, including the most popular wallet extension.',
    category: 'Developer Tools',
    url: 'https://polkadot.js.org',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/external/polkadot-js.svg',
    tags: ['Wallet', 'SDK', 'Tools'],
  },
  {
    id: 'substrate',
    name: 'Substrate',
    description: 'Modular framework for building blockchains, the foundation of Polkadot and all parachains.',
    category: 'Developer Tools',
    url: 'https://substrate.io',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/external/substrate.svg',
    tags: ['Framework', 'SDK', 'Blockchain'],
  },
  {
    id: 'phala',
    name: 'Phala Network',
    description: 'Privacy-preserving cloud computing service built on Polkadot, enabling confidential smart contracts.',
    category: 'Infrastructure',
    url: 'https://phala.network',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/phala.svg',
    tags: ['Privacy', 'Cloud', 'TEE'],
  },
  {
    id: 'zeitgeist',
    name: 'Zeitgeist',
    description: 'Decentralized prediction markets protocol for Polkadot, enabling forecasting and trading on future events.',
    category: 'DeFi',
    url: 'https://zeitgeist.pm',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/zeitgeist.png',
    tags: ['Prediction Markets', 'Trading', 'Forecasting'],
  },
  {
    id: 'bifrost',
    name: 'Bifrost',
    description: 'Liquid staking protocol providing staking derivatives for multiple chains, allowing users to earn staking rewards while maintaining liquidity.',
    category: 'DeFi',
    url: 'https://bifrost.finance',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/bifrost.svg',
    tags: ['Staking', 'Liquid Staking', 'Derivatives'],
  },
  {
    id: 'parallel',
    name: 'Parallel Finance',
    description: 'DeFi super app offering lending, staking, and borrowing services with a focus on capital efficiency.',
    category: 'DeFi',
    url: 'https://parallel.fi',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/parallel.svg',
    tags: ['Lending', 'Borrowing', 'Yield'],
  },
  {
    id: 'interlay',
    name: 'Interlay',
    description: 'Trustless Bitcoin bridge to Polkadot, allowing Bitcoin to be used in DeFi applications.',
    category: 'Infrastructure',
    url: 'https://interlay.io',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/interlay.svg',
    tags: ['Bridge', 'Bitcoin', 'Interoperability'],
  },
  {
    id: 'composable',
    name: 'Composable Finance',
    description: 'Cross-chain infrastructure layer enabling seamless communication and composability between DeFi protocols.',
    category: 'Infrastructure',
    url: 'https://composable.finance',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/composable.svg',
    tags: ['Cross-chain', 'Interoperability', 'Infrastructure'],
  },
  {
    id: 'kilt',
    name: 'KILT Protocol',
    description: 'Decentralized identity protocol for creating verifiable, self-sovereign credentials on the blockchain.',
    category: 'Infrastructure',
    url: 'https://kilt.io',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/kilt.svg',
    tags: ['Identity', 'Credentials', 'Privacy'],
  },
  {
    id: 'subsquid',
    name: 'Subsquid',
    description: 'Decentralized data lake and indexing framework for blockchain data, enabling efficient querying and analytics.',
    category: 'Developer Tools',
    url: 'https://subsquid.io',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/external/subsquid.svg',
    tags: ['Indexing', 'Data', 'API'],
  },
  {
    id: 'polkassembly',
    name: 'Polkassembly',
    description: 'Governance platform for Polkadot and Kusama, facilitating community discussion and on-chain voting.',
    category: 'Governance',
    url: 'https://polkadot.polkassembly.io',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/external/polkassembly.svg',
    tags: ['Governance', 'Voting', 'Community'],
  },
  {
    id: 'subsocial',
    name: 'Subsocial',
    description: 'Decentralized social network built on Polkadot, giving users control over their content and social graph.',
    category: 'Parachain',
    url: 'https://subsocial.network',
    logo: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/ui/logos/chains/subsocial.svg',
    tags: ['Social', 'Content', 'Web3'],
  },
];

/**
 * Get a random project based on block hash randomness
 */
export function getRandomProject(
  randomSeed: number,
  excludedIds: string[] = []
): PolkadotProject | null {
  // Filter out already discovered projects
  const availableProjects = polkadotProjects.filter(
    (project) => !excludedIds.includes(project.id)
  );

  if (availableProjects.length === 0) {
    return null;
  }

  // Use the random seed to select a project
  const index = randomSeed % availableProjects.length;
  return availableProjects[index];
}

/**
 * Get all projects by category
 */
export function getProjectsByCategory(category: string): PolkadotProject[] {
  return polkadotProjects.filter((project) => project.category === category);
}

/**
 * Search projects by name or tags
 */
export function searchProjects(query: string): PolkadotProject[] {
  const lowerQuery = query.toLowerCase();
  return polkadotProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}




