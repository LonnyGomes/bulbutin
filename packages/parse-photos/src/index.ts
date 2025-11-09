import path from "node:path";
import { fileURLToPath } from "node:url";
import { processImages } from "./utils.js";
import { saveImageData } from "./data.js";

const homeCoordinates = [-77.01011939679307, 38.8898568078552] as const;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, "../images");

processImages(imagesDir, homeCoordinates)
  .then(async (results) => {
    console.log("Altitude Stats:", results.altitudeStats);
    console.log("Final Results:", results.countryTotals, results.usTotals);
    await saveImageData(results);
    console.log("Data saved to images.json");
  })
  .catch((error) => {
    console.error("Error processing images:", error);
  });
