import type { LocationCoordinates } from "@/types";
import { sleep } from "./time";

async function getCitiesCoordinates() {
  const overpassUrl = "https://overpass-api.de/api/interpreter";
  const query = `
        [out:json];
        area["ISO3166-1"="IL"][admin_level=2];
        node(area)[place];
        out;
    `;

  try {
    const response = await fetch(overpassUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const places = data.elements.filter(
      (elem) => elem.type === "node" && elem.tags.place
    );

    const coordinates = {};
    places.forEach((place) => {
      if (place.tags["name:en"]) {
        coordinates[place.tags["name:en"]] = {
          lat: place.lat,
          lon: place.lon,
        };
      }
    });

    return coordinates;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}

function calculateDistanceKm(
  coord1: LocationCoordinates,
  coord2: LocationCoordinates
) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lon - coord1.lon);
  const lat1 = toRadians(coord1.lat);
  const lat2 = toRadians(coord2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

const normalizeLocation = (location: string) => {
  const normalizedLocations = {
    "`En Gannim": "Ein Ganim",
    "Petah Tiqwa": "Petah Tikva",
    Ashqelon: "Ashkelon",
    "Modi`in": "Modiin-Maccabim-Reut",
    "Rishon LeZiyyon": "Rishon LeZion",
    Yehud: "Yehud Monosson",
    "Or`Aquiva": "Or Akiva",
  };

  return normalizedLocations[location] || location;
};

const getMyLocationCoords = async () => {
  try {
    const res = await fetch(
      "https://api.bigdatacloud.net/data/reverse-geocode-client"
    );

    const data = (await res.json()) as any;
    return { lat: data.latitude, lon: data.longitude };
  } catch (e) {
    console.error(e);
  }
};

export {
  calculateDistanceKm,
  getCitiesCoordinates,
  normalizeLocation,
  getMyLocationCoords,
};
