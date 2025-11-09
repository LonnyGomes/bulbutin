import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

import type { ImageResult } from "./models";

import { initGeocoder } from "./geocoder";
import { calcAltitudes, calcTotalCountries, calcTotalUSStates } from "./utils";
import { extractMetadata } from "./utils";

const homeCoordinates = [-77.01011939679307, 38.8898568078552] as const;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, "../images");
const outputFilename = path.resolve(__dirname, "images.json");

const processImages = async (basePath: string): Promise<ImageResult[]> => {
  await initGeocoder();
  const files = await fs.readdir(basePath);
  const extentions = [".jpg", ".jpeg", ".png", ".tiff", ".heic"];
  const images = files.filter((file) =>
    extentions.includes(path.extname(file).toLowerCase()),
  );
  const promises = images.map(async (image) => {
    const imagePath = path.join(basePath, image);
    const metadata = await extractMetadata(imagePath, homeCoordinates);
    return metadata;
  });

  const results = await Promise.all(promises);
  return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

processImages(imagesDir)
  .then((results) => {
    const totalCountries = calcTotalCountries(results);
    const totalStates = calcTotalUSStates(results);

    const altitudeStats = calcAltitudes(results);
    console.log("Altitude Stats:", altitudeStats);
    console.log("Final Results:", totalCountries, totalStates);
    return fs.writeFile(outputFilename, JSON.stringify(results, null, 2));
  })
  .catch((error) => {
    console.error("Error processing images:", error);
  });
