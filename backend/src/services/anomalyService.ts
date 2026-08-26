import { anomalyStatusFromScore, clamp, round } from "../utils/helpers.js";
import type { ThermalEvent } from "../models/types.js";
import type { HistoryStats } from "./historyService.js";
import type { AttributionClass } from "./attributionService.js";

export type AnomalyResult = {
  status: "NORMAL" | "WATCH" | "ABNORMAL" | "CRITICAL";
  score: number;
  reasons: string[];
};

export function detectAnomaly(input: {
  event: ThermalEvent;
  history: HistoryStats;
  classification: AttributionClass;
  industryKm: number | null;
  vegetationKm: number | null;
}): AnomalyResult {
  const { event, history, classification, industryKm, vegetationKm } = input;
  const currentFrp = event.frp ?? 0;
  const avg = history.average_frp || 0;
  const reasons: string[] = [];
  let score = 10;

  if (avg > 0 && currentFrp > avg * 1.5) {
    const lift = ((currentFrp - avg) / avg) * 40;
    score += clamp(lift, 0, 40);
    reasons.push(`Current FRP ${currentFrp} MW vs historical average ${avg} MW`);
  } else if (avg === 0 && currentFrp >= 25) {
    score += 20;
    reasons.push("Limited history with a relatively high current FRP");
  } else {
    reasons.push("Current FRP is not strongly elevated versus recent local detections");
  }

  if (history.last_7_day <= 1 && currentFrp >= 20) {
    score += 15;
    reasons.push("Unusual timing: few detections in the last 7 days");
  }
  if (history.persistence_score >= 70 && currentFrp >= avg) {
    score += 10;
    reasons.push("Persistent source continuing at or above typical intensity");
  }

  const mismatch =
    (classification === "FOREST_VEGETATION" && industryKm !== null && industryKm < 0.5) ||
    (classification === "INDUSTRIAL" && vegetationKm !== null && vegetationKm < 0.4 && (event.frp ?? 0) < 10);
  if (mismatch) {
    score += 15;
    reasons.push("Contextual mismatch between probable class and nearest land use");
  }

  score = round(clamp(score));
  return { status: anomalyStatusFromScore(score), score, reasons };
}
