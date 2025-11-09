import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { processImages } from "./utils";

const homeCoordinates = [-77.01011939679307, 38.8898568078552] as const;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, "../images");
const outputFilename = path.resolve(__dirname, "images.json");

processImages(imagesDir, homeCoordinates)
  .then((results) => {
    console.log("Altitude Stats:", results.altitudeStats);
    console.log("Final Results:", results.countryTotals, results.usTotals);
    return fs.writeFile(outputFilename, JSON.stringify(results, null, 2));
  })
  .catch((error) => {
    console.error("Error processing images:", error);
  });
