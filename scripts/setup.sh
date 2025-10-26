#!/bin/bash

# Polkadot Discovery Roulette - Setup Script
# This script helps you get started quickly

set -e  # Exit on error

echo "🎰 Polkadot Discovery Roulette - Setup Script"
echo "=============================================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version 18 or higher is required"
    echo "   Current version: $(node --version)"
    echo "   Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "   This may take 2-3 minutes..."
echo ""

npm install

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ Environment file created"
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "=============================================="
echo "🎉 Setup complete!"
echo "=============================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Install Polkadot.js Extension:"
echo "   https://polkadot.js.org/extension/"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "4. Connect your wallet and start discovering!"
echo ""
echo "Need help? Check QUICKSTART.md or README.md"
echo ""

