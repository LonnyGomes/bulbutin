# Environment Setup

## Mapbox Access Token

This project uses Mapbox for map visualization. Different environment files are used for local development vs production deployment.

### Local Development Setup

1. Get a free Mapbox access token from [mapbox.com](https://www.mapbox.com/)
2. Create `src/environments/environment.local.ts`:

```typescript
export const environment = {
  production: false,
  mapboxAccessToken: 'pk.your-actual-token-here',
};
```

3. The `environment.local.ts` file is in `.gitignore` and won't be committed

### Production Deployment (Netlify)

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add a new environment variable:
   - **Key**: `MAPBOX_ACCESS_TOKEN`
   - **Value**: Your Mapbox token (starts with `pk.`)
3. Redeploy your site

The production build will automatically use this environment variable.

### Environment Files

- `environment.local.ts` - Your local token (git-ignored, not committed)
- `environment.ts` - Default/fallback (committed)
- `environment.development.ts` - Development config, imports from local (committed)
- `environment.prod.ts` - Production config, reads from `process.env` (committed)

### How It Works

- **Development** (`ng serve`): Uses `environment.development.ts` → imports `environment.local.ts`
- **Production** (`ng build`): Uses `environment.prod.ts` → reads from Netlify environment variables
