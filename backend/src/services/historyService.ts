import { env } from "../config/env.js";
import { SCORE_WEIGHTS } from "../config/weights.js";
import { findNearbyHistorical, replaceHistoricalSnapshot } from "../models/eventModel.js";
import type { ThermalEvent } from "../models/types.js";
import { clamp, round } from "../utils/helpers.js";

export type HistoryStats = {
  total: number;
  last_7_day: number;
  last_30_day: number;
  average_frp: number;
  maximum_frp: number;
  nighttime_count: number;
  nighttime_share: number;
  recurrence_frequency: number;
  persistence_score: number;
  persistence_level: "LOW" | "MODERATE" | "HIGH";
  formula: string;
  weights: {
    recentFrequency: number;
    recurrence: number;
    temporalConcentration: number;
    frpConsistency: number;
  };
  events: ThermalEvent[];
};

function daysAgo(date: string): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}

export function calculatePersistence(events: Array<{ acquisition_date: string; frp: number | null; day_night: string | null }>): {
  persistence_score: number;
  recentFrequency: number;
  recurrence: number;
  temporalConcentration: number;
  frpConsistency: number;
} {
  const last7 = events.filter((event) => daysAgo(event.acquisition_date) <= 7).length;
  const last30 = events.filter((event) => daysAgo(event.acquisition_date) <= 30).length;
  const recentFrequency = clamp((last7 / 7) * 100);
  const recurrence = clamp((last30 / 10) * 100);

  const uniqueDays = new Set(events.map((event) => event.acquisition_date.slice(0, 10))).size;
  const temporalConcentration = last30 === 0 ? 0 : clamp((uniqueDays / Math.max(last30, 1)) * 80 + (last7 > 2 ? 20 : 0));

  const frps = events.map((event) => event.frp).filter((value): value is number => value !== null);
  let frpConsistency = 50;
  if (frps.length >= 2) {
    const mean = frps.reduce((a, b) => a + b, 0) / frps.length;
    const variance = frps.reduce((sum, value) => sum + (value - mean) ** 2, 0) / frps.length;
    const cv = mean === 0 ? 1 : Math.sqrt(variance) / mean;
    frpConsistency = clamp(100 - cv * 80);
  }

  const w = SCORE_WEIGHTS.persistence;
  const persistence_score = round(
    recentFrequency * w.recentFrequency +
      recurrence * w.recurrence +
      temporalConcentration * w.temporalConcentration +
      frpConsistency * w.frpConsistency
  );

  return { persistence_score, recentFrequency, recurrence, temporalConcentration, frpConsistency };
}

export async function analyzeHistory(event: ThermalEvent): Promise<HistoryStats> {
  const nearby = await findNearbyHistorical(
    event.latitude,
    event.longitude,
    env.historyRadiusMeters,
    env.historyWindowDays
  );

  await replaceHistoricalSnapshot(
    event.id,
    nearby.map((item) => ({
      external_id: item.external_id,
      latitude: item.latitude,
      longitude: item.longitude,
      event_date: item.acquisition_date,
      frp: item.frp,
      confidence: item.confidence,
      source: item.source,
    }))
  );

  const last7 = nearby.filter((item) => daysAgo(item.acquisition_date) <= 7);
  const last30 = nearby.filter((item) => daysAgo(item.acquisition_date) <= 30);
  const frps = nearby.map((item) => item.frp).filter((value): value is number => value !== null);
  const nighttime = nearby.filter((item) => (item.day_night || "").toUpperCase().startsWith("N"));
  const persistence = calculatePersistence(nearby);

  return {
    total: nearby.length,
    last_7_day: last7.length,
    last_30_day: last30.length,
    average_frp: frps.length ? round(frps.reduce((a, b) => a + b, 0) / frps.length) : 0,
    maximum_frp: frps.length ? round(Math.max(...frps)) : 0,
    nighttime_count: nighttime.length,
    nighttime_share: nearby.length ? round(nighttime.length / nearby.length) : 0,
    recurrence_frequency: round(last30.length / 30),
    persistence_score: persistence.persistence_score,
    persistence_level:
      persistence.persistence_score >= 65 ? "HIGH" : persistence.persistence_score >= 35 ? "MODERATE" : "LOW",
    formula:
      "Persistence = 40% recent frequency + 30% recurrence + 20% temporal concentration + 10% FRP consistency",
    weights: SCORE_WEIGHTS.persistence,
    events: nearby,
  };
}
