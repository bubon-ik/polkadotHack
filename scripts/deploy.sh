#!/bin/bash

# Polkadot Discovery Roulette - Deployment Helper Script
# Helps prepare the app for deployment

set -e  # Exit on error

echo "🚀 Polkadot Discovery Roulette - Deployment Helper"
echo "=================================================="
echo ""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
echo "✅ Clean complete"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm ci
echo "✅ Dependencies installed"
echo ""

# Type checking
echo "🔍 Running type check..."
npm run type-check
echo "✅ Type check passed"
echo ""

# Build the application
echo "🏗️  Building application..."
npm run build
echo "✅ Build complete"
echo ""

# Check build output
if [ -d ".next" ]; then
    BUILD_SIZE=$(du -sh .next | cut -f1)
    echo "📊 Build size: $BUILD_SIZE"
else
    echo "❌ Build failed - .next directory not found"
    exit 1
fi

echo ""
echo "=================================================="
echo "✅ Deployment preparation complete!"
echo "=================================================="
echo ""
echo "Your app is ready to deploy!"
echo ""
echo "Deployment options:"
echo ""
echo "1. Vercel (Recommended):"
echo "   - Push to GitHub"
echo "   - Import project in Vercel"
echo "   - Deploy automatically"
echo ""
echo "2. Netlify:"
echo "   - Connect repository"
echo "   - Set build command: npm run build"
echo "   - Deploy"
echo ""
echo "3. Self-hosted:"
echo "   npm run start (runs on port 3000)"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
echo ""




