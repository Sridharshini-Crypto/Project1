import { env } from "../config/env.js";
import { latestClassification, latestRisk, latestSatellite, saveAlert, saveClassification, saveRisk } from "../models/analysisModel.js";
import { getEventById } from "../models/eventModel.js";
import { AppError } from "../utils/helpers.js";
import { detectAnomaly } from "./anomalyService.js";
import { attributeSource } from "./attributionService.js";
import { analyzeHistory } from "./historyService.js";
import { assessExposure } from "./impactService.js";
import { fetchOsmContext, summarizeContext } from "./osmService.js";
import { calculateRisk } from "./riskService.js";
import { getSentinelContext } from "./sentinelService.js";

export async function analyzeEvent(id: string, radiusKm = 2) {
  const event = await getEventById(id);
  if (!event) throw new AppError("Thermal event not found", 404);

  const features = await fetchOsmContext(event.latitude, event.longitude, env.osmRadiusMeters);
  const context = summarizeContext(features);
  const history = await analyzeHistory(event);
  const satellite = await getSentinelContext(event);
  const attribution = attributeSource({
    event,
    features,
    history,
    ndvi: satellite.ndvi ?? null,
  });
  const industryKm = context.nearest_industry?.distance_meters
    ? context.nearest_industry.distance_meters / 1000
    : null;
  const vegetationKm = context.nearest_vegetation?.distance_meters
    ? context.nearest_vegetation.distance_meters / 1000
    : null;
  const anomaly = detectAnomaly({
    event,
    history,
    classification: attribution.classification,
    industryKm,
    vegetationKm,
  });
  const risk = calculateRisk({ history, anomaly, attribution, features });
  const impact = await assessExposure(event, radiusKm);

  await saveClassification(event.id, attribution.classification, attribution.confidence, attribution);
  await saveRisk(event.id, {
    persistence_score: history.persistence_score,
    anomaly_score: anomaly.score,
    exposure_score: impact.summary.settlements * 10 + impact.summary.critical_infrastructure * 15,
    risk_score: risk.score,
    risk_level: risk.level,
    contributors: risk,
  });

  if (risk.level === "HIGH" || risk.level === "CRITICAL") {
    await saveAlert(
      event.id,
      risk.level,
      `${risk.level}-RISK THERMAL EVENT`,
      `Probable ${attribution.classification.replaceAll("_", " ")} source near Chennai. Risk ${risk.score}/100. Attribution confidence ${attribution.confidence}%. Persistence ${history.persistence_level}. Requires ground verification.`
    );
  }

  return {
    event,
    context,
    history: {
      total: history.total,
      last_7_day: history.last_7_day,
      last_30_day: history.last_30_day,
      average_frp: history.average_frp,
      maximum_frp: history.maximum_frp,
      nighttime_count: history.nighttime_count,
      persistence_score: history.persistence_score,
      persistence_level: history.persistence_level,
      formula: history.formula,
    },
    satellite,
    attribution,
    anomaly,
    risk,
    impact,
    data_mode: env.demoMode ? "demo" : "live",
    scientific_notes: [
      "FIRMS/VIIRS reports thermal anomalies, not exact fire locations.",
      "Attribution is probable, not confirmed.",
      "Potential exposure is not predicted damage.",
      "TRACE is decision support and requires ground verification.",
    ],
  };
}

export async function getStoredAnalysis(id: string) {
  return {
    classification: await latestClassification(id),
    risk: await latestRisk(id),
    satellite: await latestSatellite(id),
  };
}
