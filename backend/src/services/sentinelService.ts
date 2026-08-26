import axios from "axios";
import { env } from "../config/env.js";
import { saveSatellite } from "../models/analysisModel.js";
import type { ThermalEvent } from "../models/types.js";

type SentinelResult = {
  available: boolean;
  reason?: string;
  provider: string;
  image_url?: string | null;
  acquisition_date?: string | null;
  cloud_percentage?: number | null;
  ndvi?: number | null;
  interpretation?: string;
  metadata?: Record<string, unknown>;
};

async function getToken(): Promise<string> {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.sentinelClientId,
    client_secret: env.sentinelClientSecret,
  });
  const response = await axios.post<{ access_token: string }>(
    "https://services.sentinel-hub.com/oauth/token",
    body.toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 15000 }
  );
  return response.data.access_token;
}

export async function getSentinelContext(event: ThermalEvent): Promise<SentinelResult> {
  if (!env.sentinelClientId || !env.sentinelClientSecret) {
    return {
      available: false,
      reason: "Sentinel-2 credentials are not configured",
      provider: "sentinel-hub",
    };
  }

  const half = env.sentinelAoiKm / 2 / 111;
  const bbox = [
    event.longitude - half,
    event.latitude - half,
    event.longitude + half,
    event.latitude + half,
  ];

  try {
    const token = await getToken();
    const evalscript = `//VERSION=3
function setup() {
  return { input: ["B04", "B08", "B02", "B03", "dataMask"], output: { bands: 3 } };
}
function evaluatePixel(s) {
  return [s.B04, s.B03, s.B02];
}`;

    const process = await axios.post(
      "https://services.sentinel-hub.com/api/v1/process",
      {
        input: {
          bounds: { bbox, properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/4326" } },
          data: [
            {
              type: "sentinel-2-l2a",
              dataFilter: { maxCloudCoverage: 60, mosaickingOrder: "leastCC" },
            },
          ],
        },
        output: { width: 256, height: 256, responses: [{ identifier: "default", format: { type: "image/png" } }] },
        evalscript,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "arraybuffer",
        timeout: 25000,
      }
    );

    const ndviScript = `//VERSION=3
function setup() {
  return { input: ["B04", "B08", "SCL", "dataMask"], output: { bands: 1, sampleType: "FLOAT32" } };
}
function evaluatePixel(s) {
  let ndvi = (s.B08 - s.B04) / (s.B08 + s.B04);
  return [ndvi];
}`;

    let ndvi: number | null = null;
    try {
      const stats = await axios.post(
        "https://services.sentinel-hub.com/api/v1/statistics",
        {
          input: {
            bounds: { bbox, properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/4326" } },
            data: [{ type: "sentinel-2-l2a", dataFilter: { maxCloudCoverage: 60 } }],
          },
          aggregation: {
            timeRange: {
              from: new Date(Date.now() - 30 * 86400000).toISOString(),
              to: new Date().toISOString(),
            },
            aggregationInterval: { of: "P30D" },
            evalscript: ndviScript,
          },
        },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 25000 }
      );
      ndvi = stats.data?.data?.[0]?.outputs?.default?.bands?.B0?.stats?.mean ?? null;
    } catch {
      ndvi = null;
    }

    const image_url = `data:image/png;base64,${Buffer.from(process.data).toString("base64")}`;
    const interpretation =
      ndvi === null
        ? "NDVI unavailable. Vegetation index is contextual evidence only and does not identify fire."
        : ndvi >= 0.4
          ? "Higher vegetation index — vegetation / agricultural context (not a fire confirmation)."
          : "Lower vegetation index — built-up, industrial, or bare-surface context (not a fire confirmation).";

    const result: SentinelResult = {
      available: true,
      provider: "sentinel-hub",
      image_url,
      acquisition_date: new Date().toISOString().slice(0, 10),
      cloud_percentage: null,
      ndvi,
      interpretation,
      metadata: { bbox, aoi_km: env.sentinelAoiKm, note: "Best recent low-cloud Sentinel-2 mosaic" },
    };

    await saveSatellite(event.id, {
      provider: "sentinel-hub",
      image_url,
      acquisition_date: result.acquisition_date,
      ndvi,
      metadata: result.metadata,
    });
    return result;
  } catch (error) {
    return {
      available: false,
      reason: error instanceof Error ? error.message : "Sentinel-2 request failed",
      provider: "sentinel-hub",
    };
  }
}
