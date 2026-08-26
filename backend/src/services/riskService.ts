import { SCORE_WEIGHTS } from "../config/weights.js";
import { clamp, parseConfidence, riskLevelFromScore, round } from "../utils/helpers.js";
import type { GeospatialFeature } from "../models/types.js";
import type { AnomalyResult } from "./anomalyService.js";
import type { AttributionResult } from "./attributionService.js";
import type { HistoryStats } from "./historyService.js";

export type RiskResult = {
  score: number;
  level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  contributors: Array<{ name: string; points: number }>;
  formula: string;
  weights: Record<string, number>;
};

export function calculateRisk(input: {
  history: HistoryStats;
  anomaly: AnomalyResult;
  attribution: AttributionResult;
  features: GeospatialFeature[];
}): RiskResult {
  const { history, anomaly, attribution, features } = input;
  const w = SCORE_WEIGHTS.risk;

  const settlements = features.filter((f) => f.feature_type === "residential" && (f.distance_meters ?? 9999) <= 2000);
  const critical = features.filter((f) =>
    ["hospital", "airport", "critical_infrastructure", "power_plant"].includes(f.feature_type) &&
    (f.distance_meters ?? 9999) <= 3000
  );

  const populationExposure = clamp(settlements.length * 18 + (settlements[0] ? 20 : 0));
  const infraProximity = clamp(critical.length * 22 + (critical[0] ? 15 : 0));
  const recurrence = clamp(history.last_30_day * 8);

  const anomalyPts = round(anomaly.score * w.anomaly);
  const persistencePts = round(history.persistence_score * w.persistence);
  const attribPts = round(attribution.confidence * w.attributionConfidence);
  const popPts = round(populationExposure * w.populationExposure);
  const infraPts = round(infraProximity * w.criticalInfrastructure);
  const recPts = round(recurrence * w.historicalRecurrence);

  const score = round(clamp(anomalyPts + persistencePts + attribPts + popPts + infraPts + recPts));
  const contributors = [
    { name: "Anomaly", points: anomalyPts },
    { name: "Persistence", points: persistencePts },
    { name: "Attribution confidence", points: attribPts },
    { name: "Population exposure", points: popPts },
    { name: "Critical infrastructure proximity", points: infraPts },
    { name: "Historical recurrence", points: recPts },
  ];

  return {
    score,
    level: riskLevelFromScore(score),
    contributors,
    formula:
      "Risk = 30% anomaly + 20% persistence + 20% attribution confidence + 15% population exposure + 10% critical infrastructure + 5% historical recurrence",
    weights: w,
  };
}

export function parseEventConfidence(value: string | null) {
  return parseConfidence(value ?? "");
}
