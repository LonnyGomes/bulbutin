// Development environment - imports from local file (git-ignored)
// Create environment.local.ts with your actual token for local development
// This file is ONLY used in development mode (ng serve)
import { environment as localEnv } from './environment.local';

export const environment = {
  production: false,
  mapboxAccessToken: localEnv.mapboxAccessToken || '',
};
