import type { Request, Response } from "express";
import { checkDatabase } from "../config/db.js";
import { env } from "../config/env.js";
import { listAlerts, dashboardCounts } from "../models/analysisModel.js";
import { getEventById, listEvents } from "../models/eventModel.js";
import { featuresWithin } from "../models/featureModel.js";
import { getHotspots } from "../services/firmsService.js";
import { analyzeHistory } from "../services/historyService.js";
import { assessExposure } from "../services/impactService.js";
import { fetchOsmContext, summarizeContext } from "../services/osmService.js";
import { analyzeEvent, getStoredAnalysis } from "../services/pipelineService.js";
import { getSentinelContext } from "../services/sentinelService.js";
import { AppError } from "../utils/helpers.js";

export async function health(_req: Request, res: Response) {
  const db = await checkDatabase();
  res.json({
    status: db.ok ? "ok" : "degraded",
    database: db.ok ? "connected" : "disconnected",
    postgis: db.postgis ?? null,
    environment: env.nodeEnv,
    demo_mode: env.demoMode,
    error: db.error,
  });
}

export async function firmsHotspots(req: Request, res: Response) {
  const forceDemo = req.query.demo === "true";
  const forceLive = req.query.demo === "false";
  try {
    const result = await getHotspots(
      {
        region: String(req.query.region || env.defaultRegion),
        startDate: req.query.startDate ? String(req.query.startDate) : undefined,
        endDate: req.query.endDate ? String(req.query.endDate) : undefined,
        source: req.query.source ? String(req.query.source) : undefined,
      },
      { forceDemo, forceLive }
    );
    res.json(result);
  } catch (error) {
    if (env.demoMode) throw error;
    throw new AppError(
      `${error instanceof Error ? error.message : "FIRMS request failed"}. You can switch to demo mode.`,
      503
    );
  }
}

export async function events(req: Request, res: Response) {
  const items = await listEvents(Number(req.query.limit) || 200);
  res.json({ count: items.length, events: items, demo_mode: env.demoMode });
}

export async function eventById(req: Request, res: Response) {
  const event = await getEventById(req.params.id);
  if (!event) throw new AppError("Thermal event not found", 404);
  res.json(event);
}

export async function eventContext(req: Request, res: Response) {
  const event = await getEventById(req.params.id);
  if (!event) throw new AppError("Thermal event not found", 404);
  const radius = Number(req.query.radiusMeters) || env.osmRadiusMeters;
  const features = await fetchOsmContext(event.latitude, event.longitude, radius);
  res.json({ event_id: event.id, radius_meters: radius, features, summary: summarizeContext(features) });
}

export async function eventHistory(req: Request, res: Response) {
  const event = await getEventById(req.params.id);
  if (!event) throw new AppError("Thermal event not found", 404);
  const history = await analyzeHistory(event);
  res.json(history);
}

export async function eventSatellite(req: Request, res: Response) {
  const event = await getEventById(req.params.id);
  if (!event) throw new AppError("Thermal event not found", 404);
  res.json(await getSentinelContext(event));
}

export async function eventClassification(req: Request, res: Response) {
  const stored = await getStoredAnalysis(req.params.id);
  if (!stored.classification) {
    const analysis = await analyzeEvent(req.params.id);
    return res.json(analysis.attribution);
  }
  res.json(stored.classification);
}

export async function eventRisk(req: Request, res: Response) {
  const stored = await getStoredAnalysis(req.params.id);
  if (!stored.risk) {
    const analysis = await analyzeEvent(req.params.id);
    return res.json(analysis.risk);
  }
  res.json(stored.risk);
}

export async function eventImpact(req: Request, res: Response) {
  const event = await getEventById(req.params.id);
  if (!event) throw new AppError("Thermal event not found", 404);
  const radiusKm = Number(req.query.radiusKm) || 2;
  if (![1, 2, 5].includes(radiusKm)) throw new AppError("radiusKm must be 1, 2, or 5");
  await fetchOsmContext(event.latitude, event.longitude);
  res.json(await assessExposure(event, radiusKm));
}

export async function analyze(req: Request, res: Response) {
  const radiusKm = Number(req.body?.radiusKm) || 2;
  res.json(await analyzeEvent(req.params.id, radiusKm));
}

export async function dashboardSummary(_req: Request, res: Response) {
  const eventsList = await listEvents(400);
  const counts = await dashboardCounts();
  const alerts = await listAlerts(15);
  const highRisk = counts.risks.filter((row) => row.risk_level === "HIGH" || row.risk_level === "CRITICAL").length;
  const industrial = counts.classes.filter((row) => row.classification === "INDUSTRIAL" || row.classification === "GAS_FLARE_PERSISTENT_HEAT").length;
  const byDate: Record<string, number> = {};
  const frpByDate: Record<string, number[]> = {};
  for (const event of eventsList) {
    byDate[event.acquisition_date] = (byDate[event.acquisition_date] ?? 0) + 1;
    if (event.frp !== null) {
      frpByDate[event.acquisition_date] = frpByDate[event.acquisition_date] ?? [];
      frpByDate[event.acquisition_date].push(event.frp);
    }
  }
  const classificationDist = counts.classes.reduce<Record<string, number>>((acc, row) => {
    acc[row.classification] = (acc[row.classification] ?? 0) + 1;
    return acc;
  }, {});
  const riskDist = counts.risks.reduce<Record<string, number>>((acc, row) => {
    acc[row.risk_level] = (acc[row.risk_level] ?? 0) + 1;
    return acc;
  }, {});

  res.json({
    demo_mode: env.demoMode,
    metrics: {
      active_hotspots: eventsList.length,
      high_risk_events: highRisk,
      industrial_candidates: industrial,
      persistent_sources: counts.risks.filter((row) => Number(row.risk_score) >= 0).length,
      abnormal_events: counts.risks.filter((row) => row.risk_level === "HIGH" || row.risk_level === "CRITICAL").length,
    },
    charts: {
      hotspots_over_time: Object.entries(byDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count })),
      risk_distribution: Object.entries(riskDist).map(([level, count]) => ({ level, count })),
      classification_distribution: Object.entries(classificationDist).map(([classification, count]) => ({
        classification,
        count,
      })),
      frp_trend: Object.entries(frpByDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, values]) => ({
          date,
          avg_frp: values.reduce((a, b) => a + b, 0) / values.length,
        })),
    },
    alerts,
  });
}

export async function nearbyFeatures(req: Request, res: Response) {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  const radius = Number(req.query.radiusMeters) || env.osmRadiusMeters;
  res.json({ features: await featuresWithin(lat, lon, radius) });
}
