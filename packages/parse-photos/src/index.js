import exifr from "exifr";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, "../images");

const extractMetadata = async (imagePath) => {
  const metadata = await exifr.parse(imagePath);

  const kmhToMph = (kmh) => {
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

  return {
    altitude: GPSAltitude,
    timestamp: DateTimeOriginal,
    speed: GPSSpeed ? kmhToMph(GPSSpeed) : 0,
    make: Make,
    model: Model,
    latitude,
    longitude,
  };
};

const processImages = async (basePath) => {
  const files = await fs.readdir(basePath);
  const extentions = [".jpg", ".jpeg", ".png", ".tiff", ".heic"];
  const images = files.filter((file) =>
    extentions.includes(path.extname(file).toLowerCase()),
  );
  const results = await images.map(async (image) => {
    const imagePath = path.join(basePath, image);
    const metadata = await extractMetadata(imagePath);
    return { image, ...metadata };
  });

  return Promise.all(results);
};

processImages(imagesDir)
  .then((results) => {
    console.log("Final Results:", results);
  })
  .catch((error) => {
    console.error("Error processing images:", error);
  });
