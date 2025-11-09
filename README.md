# 🎰 Polkadot Discovery Roulette

> Discover quality Polkadot ecosystem projects through blockchain-powered roulette on Paseo testnet

[![Polkadot](https://img.shields.io/badge/Polkadot-E6007A?style=for-the-badge&logo=polkadot&logoColor=white)](https://polkadot.network)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

## 📝 Overview

**Polkadot Discovery Roulette** is an interactive web application that helps users discover high-quality projects in the Polkadot ecosystem through a gamified roulette system. The app uses blockchain-powered randomness from Paseo testnet to ensure fair and verifiable project selection.

## ✨ Features

### Core Functionality

- **Blockchain-Powered Randomness**: Uses Paseo testnet block hashes for verifiable randomness
- **Wallet Integration**: Seamless connection with Polkadot.js Extension
- **Smart Cooldown System**: 10-second cooldown between spins to ensure fair usage
- **No Duplicates**: Each project appears only once per session
- **Custom Projects**: Users can add their own projects to the roulette
- **Session Persistence**: Progress saved locally across page reloads

### User Experience

- **Glassmorphism UI**: Modern, elegant interface with glass-morphic design elements
- **Real-time Updates**: Instant feedback and state updates
- **Mobile Responsive**: Works beautifully on all devices
- **Project Database**: Curated Polkadot ecosystem projects across multiple categories

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Polkadot.js Extension ([Install here](https://polkadot.js.org/extension/))
- A Paseo testnet account (optional, for transactions)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/bubon-ik/polkadotHack.git
cd polkadotHack/event-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
```

The default configuration uses Paseo Asset Hub:
```env
NEXT_PUBLIC_PASEO_RPC=wss://paseo-rpc.polkadot.io
NEXT_PUBLIC_NETWORK_NAME=Paseo Testnet
NEXT_PUBLIC_EXPLORER_URL=https://paseo.subscan.io
```

4. **Run the development server**
```bash
npm run dev
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
│   │   ├── ProjectCard.tsx    # Project display card
│   │   └── AddProjectForm.tsx # Form to add custom projects
│   ├── lib/                   # Core libraries
│   │   └── polkadot.ts       # Polkadot API integration
│   ├── store/                 # Zustand state management
│   │   ├── useWalletStore.ts  # Wallet state
│   │   └── useRouletteStore.ts # Roulette state
│   ├── data/                  # Project database
│   │   └── projects.ts        # Curated + user projects
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
- **RPC**: Multiple endpoints with fallback (Asset Hub, Relay Chain)
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

If blockchain connection fails, the app falls back to enhanced local randomness (timestamp + crypto + Math.random).

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

### Custom Projects

Users can add their own projects:

1. Click "Add Project" button
2. Fill in project details (name, description, URL, logo, category, tags)
3. Project is saved to local storage
4. Appears in roulette on next spin

Custom projects are stored locally and persist across sessions.

## 🎯 Project Categories

The app includes curated projects across 6 categories:

- **Parachains**: Layer-1 blockchains in Polkadot ecosystem
- **DeFi**: Decentralized finance protocols
- **NFT**: Non-fungible token platforms
- **Developer Tools**: Tools for building on Polkadot
- **Infrastructure**: Core infrastructure projects
- **Governance**: Governance and DAO platforms

## 📦 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# Paseo RPC endpoint (optional, defaults to Asset Hub)
NEXT_PUBLIC_PASEO_RPC=wss://paseo-asset-hub-rpc.polkadot.io

# Network name for display
NEXT_PUBLIC_NETWORK_NAME=Paseo Testnet

# Explorer URL
NEXT_PUBLIC_EXPLORER_URL=https://paseo.subscan.io
```

### RPC Endpoints

The app tries multiple RPC endpoints in order:
1. Paseo Asset Hub (most stable)
2. Paseo Relay Chain
3. Alternative endpoints (Dwellir, etc.)

If all fail, the app continues to work but uses fallback randomness.

## 🐛 Troubleshooting

### WebSocket Connection Issues

If you see "WebSocket connection failed" errors:

1. **Check firewall/VPN**: Some networks block WebSocket connections
2. **Try different network**: Use mobile hotspot or different Wi-Fi
3. **App still works**: The roulette continues to function with fallback randomness

### Wallet Connection Issues

1. **Install Polkadot.js Extension**: Required for wallet functionality
2. **Create/Import Account**: You need at least one account in the extension
3. **Network not required**: The app connects to Paseo via RPC, wallet network setting doesn't matter

### Transaction Signing Issues

If transactions don't appear for signing:

1. **Update metadata**: Go to Polkadot.js Apps → Settings → Metadata → Update
2. **Check wallet**: Make sure wallet is unlocked
3. **Network issues**: If WebSocket is blocked, transactions won't work (but app still functions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **GitHub**: https://github.com/bubon-ik/polkadotHack
- **Polkadot**: https://polkadot.network
- **Paseo Explorer**: https://paseo.subscan.io
- **Polkadot.js Extension**: https://polkadot.js.org/extension/
- **Polkadot.js Apps**: https://polkadot.js.org/apps

---

Built with ❤️ for the Polkadot ecosystem
