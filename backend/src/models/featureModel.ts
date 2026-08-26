import { query } from "../config/db.js";
import type { GeospatialFeature } from "./types.js";

export async function upsertFeature(feature: {
  osm_id?: string;
  name?: string;
  feature_type: string;
  latitude: number;
  longitude: number;
  tags?: Record<string, unknown>;
}) {
  if (feature.osm_id) {
    const existing = await query(`SELECT id FROM geospatial_features WHERE osm_id = $1`, [
      feature.osm_id,
    ]);
    if (existing.rows[0]) {
      await query(
        `UPDATE geospatial_features SET name = $2, feature_type = $3, tags = $4 WHERE osm_id = $1`,
        [feature.osm_id, feature.name ?? null, feature.feature_type, JSON.stringify(feature.tags ?? {})]
      );
      return;
    }
  }
  await query(
    `
    INSERT INTO geospatial_features (osm_id, name, feature_type, latitude, longitude, location, tags)
    VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($5, $4), 4326)::geography, $6)
    `,
    [
      feature.osm_id ?? null,
      feature.name ?? null,
      feature.feature_type,
      feature.latitude,
      feature.longitude,
      JSON.stringify(feature.tags ?? {}),
    ]
  );
}

export async function featuresWithin(
  latitude: number,
  longitude: number,
  radiusMeters: number
): Promise<GeospatialFeature[]> {
  const result = await query(
    `
    SELECT id, osm_id, name, feature_type, latitude, longitude, tags,
      ST_Distance(location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography) AS distance_meters
    FROM geospatial_features
    WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography, $3)
    ORDER BY distance_meters ASC
    LIMIT 200
    `,
    [latitude, longitude, radiusMeters]
  );
  return result.rows.map((row) => ({
    id: String(row.id),
    osm_id: row.osm_id ? String(row.osm_id) : null,
    name: row.name ? String(row.name) : null,
    feature_type: String(row.feature_type),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    tags: (row.tags ?? {}) as Record<string, unknown>,
    distance_meters: Number(row.distance_meters),
  }));
}

export async function nearestByTypes(
  latitude: number,
  longitude: number,
  types: string[],
  radiusMeters = 10000
) {
  const result = await query(
    `
    SELECT DISTINCT ON (feature_type)
      id, osm_id, name, feature_type, latitude, longitude, tags,
      ST_Distance(location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography) AS distance_meters
    FROM geospatial_features
    WHERE feature_type = ANY($3)
      AND ST_DWithin(location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography, $4)
    ORDER BY feature_type, distance_meters ASC
    `,
    [latitude, longitude, types, radiusMeters]
  );
  return result.rows as Array<{
    feature_type: string;
    name: string | null;
    distance_meters: number;
    latitude: number;
    longitude: number;
  }>;
}

export async function featuresInBuffer(
  latitude: number,
  longitude: number,
  radiusMeters: number
): Promise<GeospatialFeature[]> {
  const result = await query(
    `
    WITH zone AS (
      SELECT ST_Buffer(ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography, $3) AS geom
    )
    SELECT f.id, f.osm_id, f.name, f.feature_type, f.latitude, f.longitude, f.tags,
      ST_Distance(f.location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography) AS distance_meters
    FROM geospatial_features f, zone
    WHERE ST_Within(f.location::geometry, zone.geom::geometry)
       OR ST_DWithin(f.location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography, $3)
    ORDER BY distance_meters ASC
    `,
    [latitude, longitude, radiusMeters]
  );
  return result.rows.map((row) => ({
    id: String(row.id),
    osm_id: row.osm_id ? String(row.osm_id) : null,
    name: row.name ? String(row.name) : null,
    feature_type: String(row.feature_type),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    tags: (row.tags ?? {}) as Record<string, unknown>,
    distance_meters: Number(row.distance_meters),
  }));
}
