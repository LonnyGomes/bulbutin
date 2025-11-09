import type { FeatureCollection } from "geojson";

export interface ImageResult {
  image: string;
  altitude?: number;
  timestamp: Date;
  speed: number;
  make: string;
  model: string;
  latitude: number;
  longitude: number;
  geoName: string;
  formattedName: string;
  countryCode: string;
  countryName: string;
  flag: string;
  adminName1: string;
  adminName2?: string;
  geoDistance: number;
  distance: number;
}

export interface CountryInfo {
  countryCode: string;
  countryName: string;
  flag: string;
}

export interface AltitudeStats {
  min: number;
  max: number;
  average: number;
}

export interface ImageDataResults {
  altitudeStats: AltitudeStats;
  countryTotals: CountryInfo[];
  images: ImageResult[];
  imagesPoints: FeatureCollection;
  usTotals: string[];
}
