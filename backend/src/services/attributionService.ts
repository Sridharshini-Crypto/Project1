import { parseConfidence, round } from "../utils/helpers.js";
import type { GeospatialFeature, ThermalEvent } from "../models/types.js";
import type { HistoryStats } from "./historyService.js";

export type AttributionClass =
  | "INDUSTRIAL"
  | "FOREST_VEGETATION"
  | "AGRICULTURAL"
  | "GAS_FLARE_PERSISTENT_HEAT"
  | "OTHER";

export type AttributionResult = {
  classification: AttributionClass;
  confidence: number;
  label: string;
  factors: string[];
  scores: Record<AttributionClass, number>;
  disclaimer: string;
};

function nearestDistance(features: GeospatialFeature[], types: string[]): number | null {
  const match = features
    .filter((feature) => types.includes(feature.feature_type))
    .sort((a, b) => (a.distance_meters ?? Infinity) - (b.distance_meters ?? Infinity))[0];
  return match?.distance_meters ?? null;
}

export function attributeSource(input: {
  event: ThermalEvent;
  features: GeospatialFeature[];
  history: HistoryStats;
  ndvi?: number | null;
}): AttributionResult {
  const { event, features, history, ndvi } = input;
  const industryKm = (nearestDistance(features, ["industrial", "factory", "refinery", "power_plant", "warehouse"]) ?? 9999) / 1000;
  const vegetationKm = (nearestDistance(features, ["forest", "park"]) ?? 9999) / 1000;
  const agriKm = (nearestDistance(features, ["farmland"]) ?? 9999) / 1000;
  const settleKm = (nearestDistance(features, ["residential"]) ?? 9999) / 1000;
  const frp = event.frp ?? 0;
  const conf = parseConfidence(event.confidence ?? "").numeric;
  const night = (event.day_night || "").toUpperCase().startsWith("N");

  const scores: Record<AttributionClass, number> = {
    INDUSTRIAL: 10,
    FOREST_VEGETATION: 10,
    AGRICULTURAL: 10,
    GAS_FLARE_PERSISTENT_HEAT: 5,
    OTHER: 15,
  };
  const factors: string[] = [];

  if (industryKm <= 2) {
    scores.INDUSTRIAL += 35;
    factors.push(`Industrial facility within ${industryKm.toFixed(2)} km`);
  }
  if (frp >= 30) {
    scores.INDUSTRIAL += 12;
    scores.GAS_FLARE_PERSISTENT_HEAT += 8;
    factors.push(`Elevated FRP (${frp} MW)`);
  }
  if (ndvi !== null && ndvi !== undefined && ndvi < 0.3) {
    scores.INDUSTRIAL += 10;
    factors.push("Low vegetation context (NDVI)");
  }
  if (night && history.nighttime_share >= 0.5) {
    scores.GAS_FLARE_PERSISTENT_HEAT += 20;
    scores.INDUSTRIAL += 8;
    factors.push("Repeated nighttime detections");
  }
  if (history.persistence_score >= 55) {
    scores.GAS_FLARE_PERSISTENT_HEAT += 18;
    scores.INDUSTRIAL += 10;
    factors.push("Historical recurrence / persistence");
  }

  if (vegetationKm <= 2) {
    scores.FOREST_VEGETATION += 30;
    factors.push(`Vegetation within ${vegetationKm.toFixed(2)} km`);
  }
  if (ndvi !== null && ndvi !== undefined && ndvi >= 0.4) {
    scores.FOREST_VEGETATION += 12;
    scores.AGRICULTURAL += 8;
    factors.push("Higher vegetation index context");
  }

  if (agriKm <= 2) {
    scores.AGRICULTURAL += 32;
    factors.push(`Agricultural land within ${agriKm.toFixed(2)} km`);
  }
  if (!night && agriKm <= 3) {
    scores.AGRICULTURAL += 8;
  }

  if (settleKm < 0.4 && industryKm > 2 && vegetationKm > 2) {
    scores.OTHER += 10;
    factors.push("Close to settlement without clear industrial or vegetation match");
  }
  if (conf < 40) {
    scores.OTHER += 8;
    factors.push("Lower FIRMS confidence — attribution remains uncertain");
  }

  const ranked = (Object.entries(scores) as Array<[AttributionClass, number]>).sort((a, b) => b[1] - a[1]);
  const [classification, top] = ranked[0];
  const second = ranked[1][1];
  const confidence = Math.min(92, Math.max(35, round(50 + (top - second) + conf * 0.15)));

  return {
    classification,
    confidence,
    label: "Probable Source Attribution",
    factors: factors.slice(0, 8),
    scores,
    disclaimer:
      "This is probable source attribution, not a confirmed cause. TRACE is decision support and requires ground verification.",
  };
}
