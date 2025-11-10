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
4. Run `npm start` - the app will use your local token

### Production Deployment (Netlify)

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add a new environment variable:
   - **Key**: `MAPBOX_ACCESS_TOKEN`
   - **Value**: Your Mapbox token (starts with `pk.`)
3. Redeploy your site

The production build will automatically use this environment variable.

### Environment Files

- `environment.local.ts` - Your local token (git-ignored, only for development)
- `environment.ts` - Production config, reads from `process.env` (committed)
- `environment.development.ts` - Development config, imports from `environment.local.ts` (committed)

### How It Works

- **Development** (`npm start` or `ng serve`): 
  - Uses `environment.development.ts` 
  - Imports your local token from `environment.local.ts`
  
- **Production** (`npm run build` or `ng build`): 
  - Uses `environment.ts` (default)
  - Reads `MAPBOX_ACCESS_TOKEN` from Netlify environment variables
  - Never tries to import `environment.local.ts`
