import { query } from "../config/db.js";
import type { NormalizedHotspot, ThermalEvent } from "../models/types.js";

function mapEvent(row: Record<string, unknown>): ThermalEvent {
  return {
    id: String(row.id),
    external_id: String(row.external_id),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    acquisition_date: String(row.acquisition_date).slice(0, 10),
    acquisition_time: row.acquisition_time ? String(row.acquisition_time) : null,
    satellite: row.satellite ? String(row.satellite) : null,
    instrument: row.instrument ? String(row.instrument) : null,
    source: row.source ? String(row.source) : null,
    frp: row.frp === null || row.frp === undefined ? null : Number(row.frp),
    confidence: row.confidence ? String(row.confidence) : null,
    bright_ti4: row.bright_ti4 === null || row.bright_ti4 === undefined ? null : Number(row.bright_ti4),
    bright_ti5: row.bright_ti5 === null || row.bright_ti5 === undefined ? null : Number(row.bright_ti5),
    day_night: row.day_night ? String(row.day_night) : null,
    created_at: String(row.created_at),
  };
}

export async function upsertHotspots(hotspots: NormalizedHotspot[]): Promise<ThermalEvent[]> {
  const stored: ThermalEvent[] = [];
  for (const hotspot of hotspots) {
    const result = await query(
      `
      INSERT INTO thermal_events (
        external_id, latitude, longitude, location, acquisition_date, acquisition_time,
        satellite, instrument, source, frp, confidence, bright_ti4, bright_ti5, day_night
      )
      VALUES (
        $1, $2, $3, ST_SetSRID(ST_MakePoint($3, $2), 4326)::geography,
        $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      ON CONFLICT (external_id, acquisition_date, acquisition_time, satellite)
      DO UPDATE SET
        frp = EXCLUDED.frp,
        confidence = EXCLUDED.confidence,
        bright_ti4 = EXCLUDED.bright_ti4,
        bright_ti5 = EXCLUDED.bright_ti5
      RETURNING *
      `,
      [
        hotspot.id,
        hotspot.latitude,
        hotspot.longitude,
        hotspot.acquisition_date,
        hotspot.acquisition_time,
        hotspot.satellite,
        hotspot.instrument,
        hotspot.source,
        hotspot.frp,
        hotspot.confidence,
        hotspot.bright_ti4,
        hotspot.bright_ti5,
        hotspot.daynight,
      ]
    );
    stored.push(mapEvent(result.rows[0]));
  }
  return stored;
}

export async function listEvents(limit = 200): Promise<ThermalEvent[]> {
  const result = await query(
    `SELECT * FROM thermal_events ORDER BY acquisition_date DESC, created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows.map(mapEvent);
}

export async function getEventById(id: string): Promise<ThermalEvent | null> {
  const result = await query(`SELECT * FROM thermal_events WHERE id = $1`, [id]);
  return result.rows[0] ? mapEvent(result.rows[0]) : null;
}

export async function findNearbyHistorical(
  latitude: number,
  longitude: number,
  radiusMeters: number,
  days: number
) {
  const result = await query(
    `
    SELECT *,
      ST_Distance(location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography) AS distance_meters
    FROM thermal_events
    WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography, $3)
      AND acquisition_date >= CURRENT_DATE - ($4::int)
    ORDER BY acquisition_date DESC
    `,
    [latitude, longitude, radiusMeters, days]
  );
  return result.rows.map((row) => ({
    ...mapEvent(row),
    distance_meters: Number(row.distance_meters),
  }));
}

export async function replaceHistoricalSnapshot(
  thermalEventId: string,
  events: Array<{
    external_id: string;
    latitude: number;
    longitude: number;
    event_date: string;
    frp: number | null;
    confidence: string | null;
    source: string | null;
  }>
) {
  await query(`DELETE FROM historical_events WHERE thermal_event_id = $1`, [thermalEventId]);
  for (const event of events) {
    await query(
      `
      INSERT INTO historical_events (
        thermal_event_id, external_id, latitude, longitude, location, event_date, frp, confidence, source
      ) VALUES (
        $1, $2, $3, $4, ST_SetSRID(ST_MakePoint($4, $3), 4326)::geography, $5, $6, $7, $8
      )
      `,
      [
        thermalEventId,
        event.external_id,
        event.latitude,
        event.longitude,
        event.event_date,
        event.frp,
        event.confidence,
        event.source,
      ]
    );
  }
}
