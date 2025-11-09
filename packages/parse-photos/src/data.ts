import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import type { ImageDataResults } from "./models.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Gets the path to the images.json file
 */
export function getImagesJsonPath(): string {
  // When compiled, this will be in dist/, so we need to go up to the package root
  return path.resolve(__dirname, "..", "images.json");
}

/**
 * Loads the processed image data from images.json
 * @returns The parsed image data
 * @throws If the file doesn't exist or can't be parsed
 */
export async function loadImageData(): Promise<ImageDataResults> {
  const jsonPath = getImagesJsonPath();
  const content = await fs.readFile(jsonPath, "utf-8");
  return JSON.parse(content, (key, value) => {
    // Revive Date objects from ISO strings
    if (key === "timestamp" && typeof value === "string") {
      return new Date(value);
    }
    return value;
  });
}

/**
 * Saves image data to images.json
 * @param data The image data to save
 */
export async function saveImageData(data: ImageDataResults): Promise<void> {
  const jsonPath = getImagesJsonPath();
  await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
}
