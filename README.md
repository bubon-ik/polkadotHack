# 🎰 Polkadot Discovery Roulette

> Discover quality Polkadot ecosystem projects through blockchain-powered roulette on Paseo testnet

[![Polkadot](https://img.shields.io/badge/Polkadot-E6007A?style=for-the-badge&logo=polkadot&logoColor=white)](https://polkadot.network)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

## 📝 Overview

**Polkadot Discovery Roulette** is an interactive web application that helps users discover high-quality projects in the Polkadot ecosystem through a gamified roulette system. Built for the **Polkadot Builder Party Hackathon 2025**, this app demonstrates:

- 🔗 Polkadot.js wallet integration
- 🎲 On-chain randomness using Paseo block hashes
- ⏱️ Fair cooldown mechanism to prevent abuse
- 🎨 Beautiful glassmorphism UI
- 📱 Fully responsive design

## ✨ Features

### Core Functionality

- **Blockchain-Powered Randomness**: Uses Paseo testnet block hashes for verifiable randomness
- **Wallet Integration**: Seamless connection with Polkadot.js Extension
- **Smart Cooldown System**: 10-second cooldown between spins to ensure fair usage
- **No Duplicates**: Each project appears only once per session
- **Curated Project Database**: 20 high-quality Polkadot ecosystem projects across multiple categories

### User Experience

- **Glassmorphism UI**: Modern, elegant interface with glass-morphic design elements
- **Real-time Updates**: Instant feedback and state updates
- **Session Persistence**: Your progress is saved locally
- **Mobile Responsive**: Works beautifully on all devices
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🎯 Hackathon Compliance

### Polkadot Builder Party Hackathon 2025

- ✅ **Theme**: User-centric Apps / Polkadot Tinkerers
- ✅ **Polkadot Stack**: Uses @polkadot/api and Paseo testnet
- ✅ **Public Repository**: Fully open source on GitHub
- ✅ **Demo Video**: See [demo video link]
- ✅ **Submission Deadline**: Before November 17, 2025

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Polkadot.js Extension ([Install here](https://polkadot.js.org/extension/))
- A Paseo testnet account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/polkadot-discovery-roulette.git
cd polkadot-discovery-roulette/event-platform
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
```

The default configuration uses Paseo Asset Hub:
```env
NEXT_PUBLIC_PASEO_RPC=wss://paseo-asset-hub-rpc.polkadot.io
NEXT_PUBLIC_NETWORK_NAME=Paseo Asset Hub
NEXT_PUBLIC_EXPLORER_URL=https://paseo-asset-hub.blockscout.com
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
event-platform/
├── src/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles with glassmorphism
│   ├── components/            # React components
│   │   ├── WalletConnect.tsx  # Wallet connection UI
│   │   ├── Roulette.tsx       # Main roulette component
│   │   └── ProjectCard.tsx    # Project display card
│   ├── lib/                   # Core libraries
│   │   └── polkadot.ts       # Polkadot API integration
│   ├── store/                 # Zustand state management
│   │   ├── useWalletStore.ts  # Wallet state
│   │   └── useRouletteStore.ts # Roulette state
│   ├── data/                  # Project database
│   │   └── projects.ts        # Curated Polkadot projects
│   └── types/                 # TypeScript definitions
│       └── index.ts          
├── public/                    # Static assets
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.js        # Tailwind CSS config
├── next.config.js            # Next.js config
└── README.md                 # This file
```

## 🎨 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism
- **State Management**: Zustand with persistence

### Blockchain
- **Network**: Polkadot Paseo Testnet
- **RPC**: Paseo Asset Hub (`wss://paseo-asset-hub-rpc.polkadot.io`)
- **API Library**: @polkadot/api v12.4+
- **Wallet**: @polkadot/extension-dapp
- **Randomness**: Block hash from Paseo finalized blocks

### Key Dependencies
```json
{
  "@polkadot/api": "^12.4.2",
  "@polkadot/extension-dapp": "^0.50.1",
  "@polkadot/util": "^13.1.1",
  "@polkadot/util-crypto": "^13.1.1",
  "next": "^14.2.5",
  "react": "^18.3.1",
  "zustand": "^4.5.2"
}
```

## 🔧 How It Works

### On-Chain Randomness

The roulette uses **true blockchain randomness** from Paseo testnet:

1. User clicks "Spin the Roulette"
2. App fetches the latest finalized block from Paseo
3. Extracts the parent block hash as entropy source
4. Converts hash to a number and uses modulo to select a project
5. Displays the randomly selected project

```typescript
// Simplified randomness logic
const finalizedHash = await api.rpc.chain.getFinalizedHead();
const block = await api.rpc.chain.getBlock(finalizedHash);
const blockHash = block.block.header.parentHash.toHex();
const randomValue = parseInt(blockHash.slice(-16), 16);
const projectIndex = randomValue % availableProjects.length;
```

### Cooldown Mechanism

To prevent abuse and ensure fair usage:

- **10-second cooldown** between spins
- Timer persisted in local storage
- Visual countdown in the UI
- Button disabled during cooldown

### Session Management

- Discovered projects tracked per wallet session
- No duplicate projects shown
- Reset button to start fresh
- Data persisted across page reloads

## 🎯 Featured Projects

The app includes 20 curated projects across 6 categories:

- **Parachains**: Acala, Moonbeam, Astar, Subsocial
- **DeFi**: Polkadex, HydraDX, Zeitgeist, Bifrost, Parallel, Interlay
- **NFT**: Unique Network, RMRK
- **Developer Tools**: Subscan, Polkadot.js, Substrate, Subsquid
- **Infrastructure**: Phala, Interlay, Composable, KILT
- **Governance**: Polkassembly

Each project includes:
- Name and logo
- Detailed description
- Category and tags
- Direct link to project website

## 🧪 Testing

### Manual Testing Steps

1. **Wallet Connection**
   - Install Polkadot.js Extension
   - Create/import a Paseo account
   - Connect wallet to the app

2. **Roulette Functionality**
   - Click "Spin the Roulette"
   - Verify random project appears
   - Check cooldown timer activates
   - Spin again after cooldown
   - Verify no duplicate projects

3. **Session Management**
   - Discover multiple projects
   - Refresh page (session should persist)
   - Click "Reset Session"
   - Verify fresh start

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Self-Hosting

```bash
# Build production bundle
npm run build

# Start production server
npm run start
```

## 🎥 Demo Video

[Link to demo video - 2-5 minutes showing:]
- Wallet connection process
- Spinning the roulette
- Project discovery
- Cooldown mechanism
- Session management

## 🤝 Contributing

We welcome contributions from the community! To add new projects:

1. Fork the repository
2. Edit `src/data/projects.ts`
3. Add your project following the existing format
4. Submit a pull request

### Project Guidelines

Projects must:
- Be part of the Polkadot ecosystem
- Have a working website/product
- Provide value to users or developers
- Include accurate information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Polkadot**: For the amazing blockchain framework
- **Parity Technologies**: For Substrate and Polkadot.js
- **Paseo Testnet**: For providing a reliable test environment
- **All Featured Projects**: For building in the Polkadot ecosystem

## 🔗 Links

- **Live Demo**: [Add your deployment URL]
- **GitHub**: https://github.com/yourusername/polkadot-discovery-roulette
- **Polkadot**: https://polkadot.network
- **Paseo Explorer**: https://paseo-asset-hub.blockscout.com
- **Polkadot.js Extension**: https://polkadot.js.org/extension/

---

Built with ❤️ for the Polkadot Builder Party Hackathon 2025

