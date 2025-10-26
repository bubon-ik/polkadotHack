# 🚀 Quick Start Guide

Get Polkadot Discovery Roulette running in 5 minutes!

## Prerequisites Check

Before you begin, ensure you have:
- ✅ Node.js 18 or higher ([Download](https://nodejs.org))
- ✅ npm, yarn, or pnpm
- ✅ Polkadot.js Extension ([Install](https://polkadot.js.org/extension/))
- ✅ Git

### Verify Node.js Version
```bash
node --version  # Should be v18.x or higher
npm --version
```

### Install Polkadot.js Extension
1. Visit https://polkadot.js.org/extension/
2. Install for your browser (Chrome, Firefox, or Brave)
3. Create or import a Paseo testnet account

## Installation Steps

### 1. Clone the Repository
```bash
cd ~/Documents/polkadot/event-platform
```

You're already in the right directory! 

### 2. Install Dependencies
```bash
npm install
```

This will install:
- Next.js 14
- React 18
- @polkadot/api
- @polkadot/extension-dapp
- Zustand (state management)
- Tailwind CSS
- TypeScript

**Estimated time**: 2-3 minutes

### 3. Environment Setup

The `.env.local` file is already created with Paseo testnet configuration:

```env
NEXT_PUBLIC_PASEO_RPC=wss://paseo-asset-hub-rpc.polkadot.io
NEXT_PUBLIC_NETWORK_NAME=Paseo Asset Hub
NEXT_PUBLIC_EXPLORER_URL=https://paseo-asset-hub.blockscout.com
```

No changes needed! ✅

### 4. Start Development Server
```bash
npm run dev
```

You should see:
```
   ▲ Next.js 14.x
   - Local:        http://localhost:3000
   - Ready in 2.5s
```

### 5. Open in Browser

Navigate to: **http://localhost:3000**

## First Time Usage

### 1. Connect Wallet
1. Click **"Connect Wallet"** button
2. Polkadot.js Extension popup will appear
3. Select your Paseo account
4. Click "Yes, allow this application access"

### 2. Spin the Roulette
1. Click **"🎲 Spin the Roulette"** button
2. Wait 2 seconds for on-chain randomness
3. Discover a random Polkadot project!
4. Click **"Visit Project"** to learn more

### 3. Discover More Projects
1. Wait for 10-second cooldown
2. Spin again to discover another project
3. No duplicate projects - discover all 20!

## Troubleshooting

### Issue: "Cannot find module 'next'"
**Solution**: Run `npm install` first
```bash
npm install
```

### Issue: "No Polkadot.js extension found"
**Solution**: Install the extension
1. Visit https://polkadot.js.org/extension/
2. Install for your browser
3. Refresh the page

### Issue: "Failed to connect wallet"
**Solution**: Check extension permissions
1. Click extension icon in browser
2. Ensure it's unlocked
3. Make sure you have at least one account

### Issue: "WebSocket connection failed"
**Solution**: Check internet connection
- The app needs to connect to Paseo RPC
- Ensure firewall allows WebSocket connections
- Try a different RPC endpoint if needed

### Issue: Port 3000 already in use
**Solution**: Use a different port
```bash
PORT=3001 npm run dev
```

### Issue: Build errors after installation
**Solution**: Clear cache and reinstall
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Lint code
npm run lint
```

## Project Structure Overview

```
event-platform/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── lib/             # Polkadot integration
│   ├── store/           # State management
│   ├── data/            # Project database
│   └── types/           # TypeScript types
├── public/              # Static assets
└── package.json         # Dependencies
```

## What's Next?

- 📚 Read the full [README.md](README.md)
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options
- 🤝 See [CONTRIBUTING.md](CONTRIBUTING.md) to add projects
- 🏆 Review [HACKATHON.md](HACKATHON.md) for hackathon details

## Testing Features

### Test Wallet Connection
- Connect with multiple accounts
- Switch between accounts
- Disconnect and reconnect

### Test Roulette
- Spin multiple times
- Verify cooldown timer
- Check for duplicate projects
- Test reset session

### Test Responsive Design
- Open DevTools (F12)
- Toggle device toolbar
- Test on mobile sizes

### Test Error Handling
- Disconnect extension mid-session
- Close extension
- Reject connection request

## Get Help

- 📝 [Open an issue](https://github.com/yourusername/polkadot-discovery-roulette/issues)
- 💬 Join our Discord
- 📧 Email support

## Success Indicators

You'll know it's working when:
- ✅ Wallet connects successfully
- ✅ Projects appear after spinning
- ✅ Cooldown timer counts down
- ✅ No duplicate projects appear
- ✅ Session persists after refresh
- ✅ Mobile view looks good

---

**Ready to discover the Polkadot ecosystem?** 🎰✨

Start with `npm install && npm run dev`

