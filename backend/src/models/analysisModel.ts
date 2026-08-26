import { query } from "../config/db.js";

export async function saveClassification(
  thermalEventId: string,
  classification: string,
  confidence: number,
  explanation: unknown
) {
  await query(
    `INSERT INTO classifications (thermal_event_id, classification, confidence, explanation)
     VALUES ($1, $2, $3, $4)`,
    [thermalEventId, classification, confidence, JSON.stringify(explanation)]
  );
}

export async function latestClassification(thermalEventId: string) {
  const result = await query(
    `SELECT * FROM classifications WHERE thermal_event_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [thermalEventId]
  );
  return result.rows[0] ?? null;
}

export async function saveRisk(
  thermalEventId: string,
  payload: {
    persistence_score: number;
    anomaly_score: number;
    exposure_score: number;
    risk_score: number;
    risk_level: string;
    contributors: unknown;
  }
) {
  await query(
    `INSERT INTO risk_assessments (
      thermal_event_id, persistence_score, anomaly_score, exposure_score, risk_score, risk_level, contributors
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      thermalEventId,
      payload.persistence_score,
      payload.anomaly_score,
      payload.exposure_score,
      payload.risk_score,
      payload.risk_level,
      JSON.stringify(payload.contributors),
    ]
  );
}

export async function latestRisk(thermalEventId: string) {
  const result = await query(
    `SELECT * FROM risk_assessments WHERE thermal_event_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [thermalEventId]
  );
  return result.rows[0] ?? null;
}

export async function saveSatellite(
  thermalEventId: string,
  payload: {
    provider: string;
    image_url?: string | null;
    acquisition_date?: string | null;
    cloud_percentage?: number | null;
    ndvi?: number | null;
    metadata?: unknown;
  }
) {
  await query(
    `INSERT INTO satellite_observations (
      thermal_event_id, provider, image_url, acquisition_date, cloud_percentage, ndvi, metadata
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      thermalEventId,
      payload.provider,
      payload.image_url ?? null,
      payload.acquisition_date ?? null,
      payload.cloud_percentage ?? null,
      payload.ndvi ?? null,
      JSON.stringify(payload.metadata ?? {}),
    ]
  );
}

export async function latestSatellite(thermalEventId: string) {
  const result = await query(
    `SELECT * FROM satellite_observations WHERE thermal_event_id = $1 ORDER BY id DESC LIMIT 1`,
    [thermalEventId]
  );
  return result.rows[0] ?? null;
}

export async function saveAlert(
  thermalEventId: string,
  severity: string,
  title: string,
  message: string
) {
  await query(
    `INSERT INTO alerts (thermal_event_id, severity, title, message, status)
     VALUES ($1,$2,$3,$4,'open')`,
    [thermalEventId, severity, title, message]
  );
}

export async function listAlerts(limit = 20) {
  const result = await query(
    `SELECT a.*, e.latitude, e.longitude, e.frp
     FROM alerts a
     LEFT JOIN thermal_events e ON e.id = a.thermal_event_id
     ORDER BY a.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export async function dashboardCounts() {
  const events = await query(`SELECT COUNT(*)::int AS count FROM thermal_events`);
  const risks = await query(
    `SELECT DISTINCT ON (thermal_event_id) thermal_event_id, risk_level, risk_score
     FROM risk_assessments
     ORDER BY thermal_event_id, created_at DESC`
  );
  const classes = await query(
    `SELECT DISTINCT ON (thermal_event_id) thermal_event_id, classification
     FROM classifications
     ORDER BY thermal_event_id, created_at DESC`
  );
  return {
    events: events.rows[0]?.count ?? 0,
    risks: risks.rows,
    classes: classes.rows,
  };
}
