// Development environment - imports from local file (git-ignored)
// Create environment.local.ts with your actual token for local development
import { environment as localEnv } from './environment.local';

export const environment = {
  production: false,
  mapboxAccessToken: localEnv.mapboxAccessToken || '',
};
