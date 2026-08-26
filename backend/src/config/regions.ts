export const REGIONS = {
  chennai: {
    id: "chennai",
    name: "Chennai, Tamil Nadu",
    center: { latitude: 13.0827, longitude: 80.2707 },
    bbox: { west: 79.7, south: 12.7, east: 80.5, north: 13.4 },
    country: "IND",
  },
} as const;

export type RegionId = keyof typeof REGIONS;

export function getRegion(id?: string) {
  const key = (id || "chennai").toLowerCase() as RegionId;
  return REGIONS[key] ?? REGIONS.chennai;
}
