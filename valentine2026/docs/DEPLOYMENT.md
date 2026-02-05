# DEPLOYMENT GUIDE (Cloudflare Pages)

## Overview
This project is optimized for deployment using Cloudflare Pages.

## Direct Deployment
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages**.
3. Connect your repository and select the `valentine2026` project.
4. Keep the build settings empty (since it's a static project).
5. Click **Save and Deploy**.

## Using Wrangler (CLI)
If you have `wrangler` installed:
```bash
npx wrangler pages deploy . --project-name valentine2026
```

## Environment Variables
- Ensure that the project name in `wrangler.toml` matches your Cloudflare project name.
