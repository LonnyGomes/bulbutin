// Production environment - uses environment variables set in Netlify
// Set MAPBOX_ACCESS_TOKEN in Netlify's environment variables
export const environment = {
  production: true,
  // @ts-ignore - process.env is defined at build time by Angular
  mapboxAccessToken: process.env['MAPBOX_ACCESS_TOKEN'] || '',
};
