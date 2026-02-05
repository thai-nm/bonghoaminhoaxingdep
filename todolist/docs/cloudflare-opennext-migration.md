# Cloudflare OpenNext Migration Guide

## Overview

The Todo Garden frontend has been successfully migrated from a standard Next.js deployment to Cloudflare OpenNext. This enables deployment to Cloudflare's edge network for improved performance and cost efficiency.

## What Changed

### Dependencies Added
- `@opennextjs/cloudflare` - OpenNext adapter for Cloudflare Workers
- `wrangler` - Cloudflare CLI tool for deployment

### Configuration Files
- `open-next.config.ts` - OpenNext configuration for Cloudflare
- `wrangler.toml` - Cloudflare Workers deployment configuration
- Updated `next.config.js` - Added standalone output mode
- Updated `package.json` - New build and deployment scripts

### Next.js Version
- Upgraded from Next.js 14.0.0 to 15.5.4 (required for OpenNext compatibility)

## New Build Process

### Development
```bash
npm run dev  # Same as before - local development
```

### Production Build
```bash
npm run build:open-next  # Builds Next.js app and generates Cloudflare Worker
```

### Deployment
```bash
npm run deploy          # Deploy to production
npm run deploy:preview  # Deploy to preview environment
```

## Deployment Setup

### Prerequisites
1. Cloudflare account (already set up)
2. Wrangler CLI authenticated

### First-time Setup
```bash
npm run cf:login  # Authenticate with Cloudflare
```

### Environment Variables
Update `wrangler.toml` with your environment variables:
```toml
[env.production.vars]
NEXT_PUBLIC_API_URL = "your-production-api-url"

[env.preview.vars]
NEXT_PUBLIC_API_URL = "your-preview-api-url"
```

## Benefits of OpenNext Migration

1. **Edge Performance** - App runs on Cloudflare's global edge network
2. **Serverless Functions** - API routes become Cloudflare Workers
3. **Cost Efficiency** - Pay-per-use pricing model
4. **Global CDN** - Static assets served from Cloudflare's CDN
5. **Integration** - Works seamlessly with existing Cloudflare Worker backend

## File Structure

```
frontend/
├── .open-next/          # Generated OpenNext build output
├── open-next.config.ts  # OpenNext configuration
├── wrangler.toml        # Cloudflare deployment config
├── next.config.js       # Updated Next.js config
└── package.json         # Updated with new scripts
```

## Deployment Commands

| Command | Description |
|---------|-------------|
| `npm run build:open-next` | Build for Cloudflare deployment |
| `npm run deploy` | Deploy to production environment |
| `npm run deploy:preview` | Deploy to preview environment |
| `npm run cf:login` | Authenticate with Cloudflare |

## Next Steps

1. Configure environment variables in `wrangler.toml`
2. Run `npm run cf:login` to authenticate
3. Deploy with `npm run deploy:preview` to test
4. Deploy to production with `npm run deploy`

## Troubleshooting

- Ensure Next.js version is 14.2 or higher
- Check Cloudflare account permissions
- Verify Wrangler authentication with `wrangler whoami`
