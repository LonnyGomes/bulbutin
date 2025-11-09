import path from "node:path";
import fs from "node:fs/promises";
import exifr from "exifr";
import type {
  ImageResult,
  ImageDataResults,
  CountryInfo,
  AltitudeStats,
} from "./models";
import { geocode, initGeocoder } from "./geocoder";

export async function extractMetadata(
  imagePath: string,
  homeCoords: readonly [lon: number, lat: number],
): Promise<ImageResult> {
  const metadata = await exifr.parse(imagePath);
  const image = path.basename(imagePath);
  const metersToFeet = (meters: number): number => Math.round(meters * 3.28084);
  const kmhToMph = (kmh: number): number => {
    return kmh * 0.621371;
  };

  const {
    GPSSpeed,
    GPSAltitude,
    latitude,
    longitude,
    DateTimeOriginal,
    Make,
    Model,
  } = metadata;

  const distance = haversineDistance(longitude, latitude, ...homeCoords);

  const {
    name: geoName,
    countryCode,
    countryName,
    adminName1,
    adminName2,
    flag,
    distance: geoDistance,
  } = await geocode(longitude, latitude);

  return {
    image,
    altitude: GPSAltitude ? metersToFeet(GPSAltitude) : undefined,
    timestamp: DateTimeOriginal,
    speed: GPSSpeed ? kmhToMph(GPSSpeed) : 0,
    make: Make,
    model: Model,
    latitude,
    longitude,
    geoName,
    countryCode,
    countryName,
    flag,
    adminName1,
    adminName2,
    geoDistance,
    distance,
  };
}

/**
 * Uses the haversine formula (great-circle distance on a sphere)
 * to Calculate the great-circle (“as the crow flies”) distance between two lat/lon pairs.
 * a = sin²(Δφ/2) + cos φ1 * cos φ2 * sin²(Δλ/2)
 * c = 2 * atan2(√a, √(1−a))
 * d = R * c
 *
 * @param lon1 Longitude of first point in decimal degrees
 * @param lat1 Latitude of first point in decimal degrees
 * @param lon2 Longitude of second point in decimal degrees
 * @param lat2 Latitude of second point in decimal degrees
 * @returns Distance in mile
 */
function haversineDistance(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number,
): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const kmsToMiles = (km: number) => Math.round(km * 0.621371);

  const R = 6371; // Earth radius in km
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return kmsToMiles(d);
}

export function calcTotalCountries(images: ImageResult[]): CountryInfo[] {
  const totalCountries = images.reduce(
    (countryHash, curImage) => {
      const { countryCode, flag, countryName } = curImage;

      if (!countryHash[countryCode]) {
        countryHash[countryCode] = {
          countryCode,
          countryName,
          flag,
        };
      }

      return countryHash;
    },
    {} as Record<string, CountryInfo>,
  );

  return Object.values(totalCountries);
}

export function calcTotalUSStates(images: ImageResult[]): string[] {
  const totalStates = images
    .filter((curImage) => curImage.countryCode === "US")
    .map((curImage) => curImage.adminName1);

  return [...new Set(totalStates)];
}

export function calcAltitudes(images: ImageResult[]): AltitudeStats {
  const altitudeStats = {
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY,
    total: 0,
    count: 0,
  };

  images.reduce((stats, curImage) => {
    const { altitude } = curImage;
    if (altitude !== undefined) {
      stats.count += 1;
      stats.total += altitude;
      stats.min = Math.min(stats.min, altitude);
      stats.max = Math.max(stats.max, altitude);
    }
    return stats;
  }, altitudeStats);

  const average =
    altitudeStats.count > 0
      ? Math.round(altitudeStats.total / altitudeStats.count)
      : 0;

  return {
    min: altitudeStats.min,
    max: altitudeStats.max,
    average,
  };
}

export async function processImages(
  basePath: string,
  homeCoords: readonly [lon: number, lat: number],
): Promise<ImageDataResults> {
  await initGeocoder();
  const files = await fs.readdir(basePath);
  const extentions = [".jpg", ".jpeg", ".png", ".tiff", ".heic"];
  const imageFiles = files.filter((file) =>
    extentions.includes(path.extname(file).toLowerCase()),
  );
  const promises = imageFiles.map(async (image) => {
    const imagePath = path.join(basePath, image);
    const metadata = await extractMetadata(imagePath, homeCoords);
    return metadata;
  });

  const results = await Promise.all(promises);
  const images = results.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );
  const countryTotals = calcTotalCountries(results);
  const usTotals = calcTotalUSStates(results);
  const altitudeStats = calcAltitudes(results);

  return {
    altitudeStats,
    countryTotals,
    images,
    usTotals,
  };
}
