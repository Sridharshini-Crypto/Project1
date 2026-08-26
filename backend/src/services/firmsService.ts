import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";
import { parse } from "csv-parse/sync";
import { env } from "../config/env.js";
import { getRegion } from "../config/regions.js";
import { upsertHotspots } from "../models/eventModel.js";
import type { NormalizedHotspot } from "../models/types.js";
import {
  AppError,
  assertCoordinates,
  isValidLatitude,
  isValidLongitude,
  makeExternalId,
} from "../utils/helpers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FIRMS_SOURCES = new Set([
  "VIIRS_SNPP_NRT",
  "VIIRS_NOAA20_NRT",
  "VIIRS_NOAA21_NRT",
  "MODIS_NRT",
]);

export type FirmsQuery = {
  region?: string;
  startDate?: string;
  endDate?: string;
  source?: string;
};

function num(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function parseFirmsCsv(csvText: string, sourceLabel: string): NormalizedHotspot[] {
  const trimmed = csvText.trim();
  if (!trimmed || /^Invalid/i.test(trimmed) || /error/i.test(trimmed.split("\n")[0] ?? "")) {
    throw new AppError(`FIRMS returned an unusable response: ${trimmed.slice(0, 180)}`, 502);
  }

  const records = parse(trimmed, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  const hotspots: NormalizedHotspot[] = [];
  for (const row of records) {
    const latitude = Number(row.latitude);
    const longitude = Number(row.longitude);
    if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) continue;
    assertCoordinates(latitude, longitude);

    const acquisition_date = String(row.acq_date ?? "").slice(0, 10);
    const acquisition_time = String(row.acq_time ?? "").padStart(4, "0");
    const satellite = String(row.satellite ?? "unknown");
    const instrument = String(row.instrument ?? "VIIRS");
    const id = makeExternalId([
      latitude.toFixed(4),
      longitude.toFixed(4),
      acquisition_date,
      acquisition_time,
      satellite,
    ]);

    hotspots.push({
      id,
      latitude,
      longitude,
      acquisition_date,
      acquisition_time,
      satellite,
      instrument,
      confidence: String(row.confidence ?? "unknown"),
      frp: num(row.frp),
      bright_ti4: num(row.bright_ti4),
      bright_ti5: num(row.bright_ti5),
      daynight: String(row.daynight ?? ""),
      source: sourceLabel,
    });
  }
  return hotspots;
}

export function loadDemoHotspots(): NormalizedHotspot[] {
  const file = path.resolve(__dirname, "../../data/demo_firms_chennai.csv");
  const csv = fs.readFileSync(file, "utf8");
  return parseFirmsCsv(csv, "DEMO_VIIRS_CHENNAI");
}

function dayRange(query: FirmsQuery): number {
  let days = env.firmsDayRange;
  if (query.startDate && query.endDate) {
    const start = new Date(query.startDate);
    const end = new Date(query.endDate);
    days = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
  }
  return Math.min(5, Math.max(1, days));
}

async function fetchLiveFirms(query: FirmsQuery): Promise<NormalizedHotspot[]> {
  if (!env.nasaFirmsMapKey) {
    throw new AppError(
      "NASA_FIRMS_MAP_KEY is not configured. Set it in backend/.env or enable DEMO_MODE=true.",
      503
    );
  }
  const sources = query.source && FIRMS_SOURCES.has(query.source)
    ? [query.source]
    : ["VIIRS_NOAA20_NRT", "VIIRS_NOAA21_NRT", "VIIRS_SNPP_NRT"];
  const region = getRegion(query.region);
  const { west, south, east, north } = region.bbox;
  const range = dayRange(query);
  let lastError = "FIRMS request failed";

  for (const source of sources) {
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${env.nasaFirmsMapKey}/${source}/${west},${south},${east},${north}/${range}`;
    try {
      const response = await axios.get<string>(url, { timeout: 25000, responseType: "text", validateStatus: () => true });
      if (response.status >= 400) {
        lastError = `FIRMS ${response.status}: ${String(response.data).slice(0, 160)}`;
        continue;
      }
      return parseFirmsCsv(String(response.data), source);
    } catch (error) {
      lastError = error instanceof Error ? error.message : "FIRMS request failed";
    }
  }
  throw new AppError(lastError, 502);
}

export async function getHotspots(query: FirmsQuery, options?: { forceDemo?: boolean; forceLive?: boolean }) {
  const demo = options?.forceLive ? false : options?.forceDemo || env.demoMode;
  const hotspots = demo ? loadDemoHotspots() : await fetchLiveFirms(query);
  const stored = await upsertHotspots(hotspots);
  return {
    mode: demo ? "demo" : "live",
    region: getRegion(query.region),
    count: stored.length,
    events: stored,
    disclaimer:
      "VIIRS/FIRMS detections are thermal anomalies with spatial uncertainty. They are not exact fire perimeters and require ground verification.",
  };
}
