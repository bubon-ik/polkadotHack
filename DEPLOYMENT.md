# Deployment Guide

This guide covers different deployment options for Polkadot Discovery Roulette.

## Prerequisites

- Node.js 18+ installed
- Git repository set up
- Polkadot.js Extension for testing
- Environment variables configured

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `event-platform` directory as root

3. **Configure Environment Variables**
   
   Add these in Vercel dashboard:
   ```
   NEXT_PUBLIC_PASEO_RPC=wss://paseo-asset-hub-rpc.polkadot.io
   NEXT_PUBLIC_NETWORK_NAME=Paseo Asset Hub
   NEXT_PUBLIC_EXPLORER_URL=https://paseo-asset-hub.blockscout.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-app.vercel.app`

#### Continuous Deployment

Vercel automatically redeploys when you push to GitHub:
```bash
git add .
git commit -m "feat: update feature"
git push origin main
# Vercel automatically deploys
```

### Option 2: Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

2. **Environment Variables**
   
   Add in Netlify dashboard under Site settings > Environment variables

3. **Deploy**
   - Connect GitHub repository
   - Configure settings
   - Deploy

### Option 3: Self-Hosted (VPS/Cloud)

For deployment on your own server:

#### Requirements
- Ubuntu 20.04+ or similar
- Node.js 18+
- Nginx (recommended)
- PM2 (process manager)
- SSL certificate (Let's Encrypt)

#### Setup Steps

1. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/polkadot-discovery-roulette.git
   cd polkadot-discovery-roulette/event-platform
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your values
   ```

4. **Build Application**
   ```bash
   npm run build
   ```

5. **Install PM2**
   ```bash
   npm install -g pm2
   ```

6. **Start with PM2**
   ```bash
   pm2 start npm --name "polkadot-roulette" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   
   Create `/etc/nginx/sites-available/polkadot-roulette`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable and restart:
   ```bash
   sudo ln -s /etc/nginx/sites-available/polkadot-roulette /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Option 4: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t polkadot-roulette .
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_PASEO_RPC=wss://paseo-asset-hub-rpc.polkadot.io \
     -e NEXT_PUBLIC_NETWORK_NAME="Paseo Asset Hub" \
     -e NEXT_PUBLIC_EXPLORER_URL=https://paseo-asset-hub.blockscout.com \
     polkadot-roulette
   ```

3. **Docker Compose** (Optional)
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_PASEO_RPC=wss://paseo-asset-hub-rpc.polkadot.io
         - NEXT_PUBLIC_NETWORK_NAME=Paseo Asset Hub
         - NEXT_PUBLIC_EXPLORER_URL=https://paseo-asset-hub.blockscout.com
       restart: unless-stopped
   ```

## Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads correctly
- [ ] Wallet connection works
- [ ] Roulette spins successfully
- [ ] Projects display properly
- [ ] Cooldown timer functions
- [ ] Session persistence works
- [ ] Mobile responsive design
- [ ] All links work
- [ ] Environment variables loaded
- [ ] No console errors

## Testing on Different Networks

### Mainnet Deployment

To deploy on Polkadot mainnet instead of Paseo:

```env
NEXT_PUBLIC_PASEO_RPC=wss://rpc.polkadot.io
NEXT_PUBLIC_NETWORK_NAME=Polkadot
NEXT_PUBLIC_EXPLORER_URL=https://polkadot.subscan.io
```

⚠️ **Warning**: Test thoroughly before mainnet deployment!

### Kusama Deployment

For Kusama network:

```env
NEXT_PUBLIC_PASEO_RPC=wss://kusama-rpc.polkadot.io
NEXT_PUBLIC_NETWORK_NAME=Kusama
NEXT_PUBLIC_EXPLORER_URL=https://kusama.subscan.io
```

## Performance Optimization

### 1. Enable Next.js Output Standalone

In `next.config.js`:
```javascript
module.exports = {
  output: 'standalone',
  // ... other config
}
```

### 2. Configure Caching

Add cache headers in Nginx:
```nginx
location /_next/static {
    alias /var/www/app/.next/static;
    expires 365d;
    access_log off;
}
```

### 3. Enable Compression

In Nginx:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

## Monitoring

### PM2 Monitoring

```bash
pm2 status
pm2 logs polkadot-roulette
pm2 monit
```

### Vercel Analytics

Enable in Vercel dashboard:
- Analytics tab
- Enable Web Analytics
- View performance metrics

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### WebSocket Connection Issues

Check firewall allows WebSocket connections:
```bash
sudo ufw allow 3000/tcp
```

### Environment Variables Not Loading

- Ensure `.env.local` exists and is not in `.gitignore`
- Restart server after changes
- Check Vercel/Netlify dashboard for correct values

### Memory Issues

Increase Node.js memory:
```bash
NODE_OPTIONS="--max_old_space_size=4096" npm run build
```

## Security Best Practices

1. **Use HTTPS**: Always deploy with SSL/TLS
2. **Environment Variables**: Never commit `.env.local`
3. **CORS**: Configure properly if using custom API
4. **Rate Limiting**: Consider adding rate limits
5. **Updates**: Keep dependencies updated

## Updating Deployment

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart (PM2)
pm2 restart polkadot-roulette

# Or redeploy (Vercel)
# Vercel automatically deploys on git push
```

## Cost Estimates

- **Vercel (Free tier)**: $0/month (perfect for hackathon)
- **Netlify (Free tier)**: $0/month
- **DigitalOcean Droplet**: $5-10/month
- **AWS Lightsail**: $3.50-10/month

## Support

If you encounter issues:
1. Check the [GitHub Issues](https://github.com/yourusername/polkadot-discovery-roulette/issues)
2. Join our Discord server
3. Email support

---

**Happy Deploying!** 🚀

