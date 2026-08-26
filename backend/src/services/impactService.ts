import { featuresInBuffer } from "../models/featureModel.js";
import type { ThermalEvent } from "../models/types.js";

const EXPOSURE_TYPES = {
  settlements: ["residential"],
  industrial: ["industrial", "factory", "refinery", "warehouse", "power_plant"],
  critical: ["hospital", "airport", "critical_infrastructure", "power_plant"],
  vegetation: ["forest", "park", "farmland"],
  transport: ["road", "railway"],
};

export async function assessExposure(event: ThermalEvent, radiusKm = 2) {
  const radiusMeters = radiusKm * 1000;
  const features = await featuresInBuffer(event.latitude, event.longitude, radiusMeters);

  const pick = (types: string[]) =>
    features.filter((feature) => types.includes(feature.feature_type)).slice(0, 25);

  const settlements = pick(EXPOSURE_TYPES.settlements);
  const industrial = pick(EXPOSURE_TYPES.industrial);
  const critical = pick(EXPOSURE_TYPES.critical);
  const vegetation = pick(EXPOSURE_TYPES.vegetation);
  const transport = pick(EXPOSURE_TYPES.transport);

  return {
    label: "POTENTIAL EXPOSURE",
    radius_km: radiusKm,
    assets: {
      settlements,
      industrial,
      critical_infrastructure: critical,
      vegetation,
      transport,
    },
    summary: {
      settlements: settlements.length,
      industrial: industrial.length,
      critical_infrastructure: critical.length,
      vegetation: vegetation.length,
      transport: transport.length,
    },
    disclaimer:
      "Potential exposure identifies nearby assets inside a search radius. It is not predicted damage.",
  };
}
