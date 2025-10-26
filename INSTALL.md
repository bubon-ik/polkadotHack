# Installation Instructions

## Quick Installation (Recommended)

The fastest way to get started:

```bash
# You're already in the project directory!
cd /home/user/Documents/polkadot/event-platform

# Run the automated setup script
./scripts/setup.sh

# Start the development server
npm run dev
```

Then open http://localhost:3000 in your browser! 🎉

## Manual Installation

If you prefer step-by-step:

### Step 1: Verify Prerequisites

```bash
# Check Node.js version (must be 18+)
node --version

# Check npm
npm --version
```

If Node.js is not installed or version is less than 18:
- Visit https://nodejs.org
- Download and install Node.js 18 LTS or higher

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- Next.js and React
- Polkadot.js libraries
- Zustand for state management
- Tailwind CSS for styling
- TypeScript and type definitions

**Time required**: 2-3 minutes depending on internet speed

### Step 3: Verify Environment Configuration

The `.env.local` file should already exist with:

```env
NEXT_PUBLIC_PASEO_RPC=wss://paseo-asset-hub-rpc.polkadot.io
NEXT_PUBLIC_NETWORK_NAME=Paseo Asset Hub
NEXT_PUBLIC_EXPLORER_URL=https://paseo-asset-hub.blockscout.com
```

If it doesn't exist, copy from example:
```bash
cp env.example .env.local
```

### Step 4: Install Polkadot.js Extension

**Chrome/Brave:**
1. Visit https://polkadot.js.org/extension/
2. Click "Install for Chrome"
3. Click "Add to Chrome" or "Add to Brave"

**Firefox:**
1. Visit https://polkadot.js.org/extension/
2. Click "Install for Firefox"
3. Click "Add to Firefox"

### Step 5: Create Paseo Account

1. Click the Polkadot.js extension icon
2. Click the "+" button
3. Select "Create new account"
4. Save your seed phrase securely
5. Name your account (e.g., "Paseo Test")
6. Set a password

### Step 6: Start Development Server

```bash
npm run dev
```

You should see:
```
   ▲ Next.js 14.x
   - Local:        http://localhost:3000
   - Environments: .env.local
   - Ready in X.Xs
```

### Step 7: Open Application

Open your browser and navigate to:
```
http://localhost:3000
```

### Step 8: Connect Wallet

1. Click the "Connect Wallet" button
2. Polkadot.js Extension will popup
3. Select your Paseo account
4. Click "Yes, allow this application access"

### Step 9: Test the Roulette

1. Click "🎲 Spin the Roulette"
2. Wait for the random project to appear
3. Explore the discovered project
4. Wait 10 seconds and spin again!

## Installation Verification

Run these commands to verify everything is working:

```bash
# Check if all dependencies are installed
npm list @polkadot/api @polkadot/extension-dapp next react zustand

# Run type checking
npm run type-check

# Run linter
npm run lint
```

All commands should complete without errors.

## Troubleshooting

### "Cannot find module" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use

```bash
# Use a different port
PORT=3001 npm run dev
```

### Polkadot.js Extension not detected

1. Ensure extension is installed
2. Refresh the page (Ctrl+R or Cmd+R)
3. Check extension is enabled in browser extensions page
4. Try incognito/private mode (ensure extension is allowed)

### WebSocket connection fails

1. Check internet connection
2. Verify firewall allows WebSocket connections
3. Try a different RPC endpoint in `.env.local`:
   ```env
   NEXT_PUBLIC_PASEO_RPC=wss://paseo-rpc.dwellir.com
   ```

### Build fails with memory error

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build
```

## Alternative Package Managers

### Using Yarn

```bash
yarn install
yarn dev
```

### Using pnpm

```bash
pnpm install
pnpm dev
```

### Using Bun

```bash
bun install
bun dev
```

## Development Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript checker |

## File Permissions (Linux/Mac)

If scripts don't execute:

```bash
chmod +x scripts/*.sh
```

## Next Steps

After successful installation:

1. ✅ Read [QUICKSTART.md](QUICKSTART.md) for usage guide
2. ✅ See [README.md](README.md) for full documentation
3. ✅ Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options
4. ✅ Review [CONTRIBUTING.md](CONTRIBUTING.md) to add projects

## Getting Help

- 📚 Documentation: See README.md
- 🐛 Issues: https://github.com/yourusername/polkadot-discovery-roulette/issues
- 💬 Discord: [Join our server]
- 📧 Email: your.email@example.com

## System Requirements

**Minimum:**
- Node.js 18.0+
- 4GB RAM
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Internet connection

**Recommended:**
- Node.js 20.0+
- 8GB RAM
- Latest browser version
- Stable internet connection

---

**Installation Time**: ~5 minutes
**Difficulty**: Easy ⭐

Happy coding! 🚀

