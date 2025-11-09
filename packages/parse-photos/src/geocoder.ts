import path from "node:path";
import geocoder from "local-reverse-geocoder";
import emojiFlags from "emoji-flags";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface GeocodeResult {
  name: string;
  countryCode: string;
  countryName: string;
  adminName1: string;
  adminName2?: string;
  flag: string;
  distance: number;
}

export function initGeocoder(): Promise<void> {
  console.log("Initializing geocoder...");
  return new Promise((resolve, reject) => {
    geocoder.init(
      {
        load: {
          dumpDirectory: path.resolve(__dirname, "..", "geocoder-dump"),
          admin1: true,
          admin2: true,
          admin2And4: false,
          alternateNames: false,
        },
      },
      (err: Error | null) => {
        if (err) {
          reject(err);
          return;
        }
        console.log("Geocoder initialized");
        resolve();
      },
    );
  });
}

export function geocode(
  longitude: number,
  latitude: number,
): Promise<GeocodeResult> {
  return new Promise((resolve, reject) => {
    const coords = [{ latitude, longitude }];
    geocoder.lookUp(coords, (err, res) => {
      if (err) {
        reject(err);
        return;
      }

      // retreive reverse geolookup
      const [nearest] = res[0];
      const { name, countryCode, admin1Code, admin2Code, distance } = nearest;

      const { emoji: flag, name: countryName } =
        emojiFlags.countryCode(countryCode);

      resolve({
        name,
        countryCode,
        countryName,
        adminName1: admin1Code ? admin1Code.name : "",
        adminName2: admin2Code ? admin2Code.name : "",
        flag,
        distance,
      });
    });
  });
}
