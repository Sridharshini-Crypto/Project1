import axios from "axios";
import { env } from "../config/env.js";
import { featuresWithin, upsertFeature } from "../models/featureModel.js";
import type { GeospatialFeature } from "../models/types.js";

type OsmElement = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

const QUERY_GROUPS: Array<{ feature_type: string; filters: string[] }> = [
  { feature_type: "industrial", filters: ['["landuse"="industrial"]', '["industrial"]'] },
  { feature_type: "factory", filters: ['["man_made"="works"]', '["building"="industrial"]'] },
  { feature_type: "refinery", filters: ['["industrial"="oil"]', '["industrial"="refinery"]'] },
  { feature_type: "power_plant", filters: ['["power"="plant"]', '["power"="generator"]'] },
  { feature_type: "warehouse", filters: ['["building"="warehouse"]', '["industrial"="warehouse"]'] },
  { feature_type: "forest", filters: ['["landuse"="forest"]', '["natural"="wood"]'] },
  { feature_type: "park", filters: ['["leisure"="park"]'] },
  { feature_type: "farmland", filters: ['["landuse"="farmland"]', '["landuse"="farmyard"]', '["landuse"="orchard"]'] },
  { feature_type: "residential", filters: ['["landuse"="residential"]', '["place"="suburb"]', '["place"="neighbourhood"]'] },
  { feature_type: "road", filters: ['["highway"~"motorway|trunk|primary|secondary"]'] },
  { feature_type: "railway", filters: ['["railway"="rail"]'] },
  { feature_type: "airport", filters: ['["aeroway"="aerodrome"]'] },
  { feature_type: "hospital", filters: ['["amenity"="hospital"]'] },
  {
    feature_type: "critical_infrastructure",
    filters: ['["amenity"="fire_station"]', '["amenity"="police"]', '["office"="government"]', '["man_made"="water_tower"]'],
  },
];

const DEMO_FEATURES: Array<{
  osm_id: string;
  name: string;
  feature_type: string;
  latitude: number;
  longitude: number;
}> = [
  { osm_id: "demo-manali-refinery", name: "Manali Industrial Area", feature_type: "industrial", latitude: 13.166, longitude: 80.258 },
  { osm_id: "demo-ennore-port", name: "Kamarajar Port / Ennore", feature_type: "critical_infrastructure", latitude: 13.257, longitude: 80.328 },
  { osm_id: "demo-nctps", name: "North Chennai Thermal Power Station", feature_type: "power_plant", latitude: 13.254, longitude: 80.325 },
  { osm_id: "demo-cpcl", name: "Chennai Petroleum Corporation", feature_type: "refinery", latitude: 13.162, longitude: 80.269 },
  { osm_id: "demo-guindy", name: "Guindy Industrial Estate", feature_type: "industrial", latitude: 13.010, longitude: 80.213 },
  { osm_id: "demo-ambattur", name: "Ambattur Industrial Estate", feature_type: "industrial", latitude: 13.114, longitude: 80.154 },
  { osm_id: "demo-guindy-np", name: "Guindy National Park", feature_type: "forest", latitude: 13.006, longitude: 80.232 },
  { osm_id: "demo-semmencherry", name: "Perumbakkam wetlands / vegetation", feature_type: "park", latitude: 12.899, longitude: 80.228 },
  { osm_id: "demo-farm-west", name: "Western peri-urban farmland", feature_type: "farmland", latitude: 13.048, longitude: 80.119 },
  { osm_id: "demo-t-nagar", name: "T. Nagar residential", feature_type: "residential", latitude: 13.041, longitude: 80.233 },
  { osm_id: "demo-anna-nagar", name: "Anna Nagar residential", feature_type: "residential", latitude: 13.085, longitude: 80.210 },
  { osm_id: "demo-gst", name: "GST Road", feature_type: "road", latitude: 12.956, longitude: 80.162 },
  { osm_id: "demo-rail", name: "Chennai suburban railway", feature_type: "railway", latitude: 13.083, longitude: 80.275 },
  { osm_id: "demo-maa", name: "Chennai International Airport", feature_type: "airport", latitude: 12.994, longitude: 80.176 },
  { osm_id: "demo-stanley", name: "Stanley Medical College Hospital", feature_type: "hospital", latitude: 13.106, longitude: 80.287 },
  { osm_id: "demo-apollo", name: "Apollo Hospitals Greams Road", feature_type: "hospital", latitude: 13.063, longitude: 80.251 },
  { osm_id: "demo-warehouse", name: "Ennore logistics warehouse cluster", feature_type: "warehouse", latitude: 13.223, longitude: 80.278 },
];

function classifyElement(tags: Record<string, string> = {}): string {
  if (tags.power === "plant" || tags.power === "generator") return "power_plant";
  if (tags.amenity === "hospital") return "hospital";
  if (tags.aeroway) return "airport";
  if (tags.railway) return "railway";
  if (tags.highway) return "road";
  if (tags.landuse === "industrial" || tags.industrial) return "industrial";
  if (tags.landuse === "forest" || tags.natural === "wood") return "forest";
  if (tags.landuse === "farmland" || tags.landuse === "farmyard") return "farmland";
  if (tags.landuse === "residential") return "residential";
  if (tags.leisure === "park") return "park";
  if (tags.building === "warehouse") return "warehouse";
  if (tags.amenity === "fire_station" || tags.amenity === "police") return "critical_infrastructure";
  return "other";
}

async function seedDemoFeatures() {
  for (const feature of DEMO_FEATURES) {
    await upsertFeature({ ...feature, tags: { source: "demo" } });
  }
}

export async function fetchOsmContext(latitude: number, longitude: number, radiusMeters = env.osmRadiusMeters) {
  const around = `around:${Math.round(radiusMeters)},${latitude},${longitude}`;
  const filters = QUERY_GROUPS.flatMap((group) =>
    group.filters.flatMap((filter) => [`node${filter}(${around});`, `way${filter}(${around});`])
  );
  const query = `[out:json][timeout:25];(${filters.join("")});out center 80;`;

  try {
    const response = await axios.post<string>(
      "https://overpass-api.de/api/interpreter",
      query,
      { timeout: 28000, headers: { "Content-Type": "text/plain" }, responseType: "text" }
    );
    const json = JSON.parse(response.data) as { elements?: OsmElement[] };
    const elements = json.elements ?? [];
    for (const element of elements) {
      const lat = element.lat ?? element.center?.lat;
      const lon = element.lon ?? element.center?.lon;
      if (lat === undefined || lon === undefined) continue;
      await upsertFeature({
        osm_id: `${element.type}/${element.id}`,
        name: element.tags?.name,
        feature_type: classifyElement(element.tags),
        latitude: lat,
        longitude: lon,
        tags: element.tags ?? {},
      });
    }
  } catch (error) {
    console.warn("Overpass unavailable; using bundled geospatial context.", error instanceof Error ? error.message : error);
    await seedDemoFeatures();
  }

  const nearby = await featuresWithin(latitude, longitude, radiusMeters);
  if (nearby.length === 0) {
    await seedDemoFeatures();
    return featuresWithin(latitude, longitude, radiusMeters);
  }
  return nearby;
}

export function summarizeContext(features: GeospatialFeature[]) {
  const nearest = (types: string[]) =>
    features
      .filter((feature) => types.includes(feature.feature_type))
      .sort((a, b) => (a.distance_meters ?? Infinity) - (b.distance_meters ?? Infinity))[0] ?? null;

  return {
    nearest_industry: nearest(["industrial", "factory", "refinery", "power_plant", "warehouse"]),
    nearest_vegetation: nearest(["forest", "park"]),
    nearest_agriculture: nearest(["farmland"]),
    nearest_settlement: nearest(["residential"]),
    nearest_critical_infrastructure: nearest(["hospital", "airport", "critical_infrastructure", "power_plant"]),
    counts: features.reduce<Record<string, number>>((acc, feature) => {
      acc[feature.feature_type] = (acc[feature.feature_type] ?? 0) + 1;
      return acc;
    }, {}),
    disclaimer:
      "OpenStreetMap provides spatial context only. Nearby features do not prove the cause of a thermal anomaly.",
  };
}
