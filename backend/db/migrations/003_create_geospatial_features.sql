CREATE TABLE IF NOT EXISTS geospatial_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  osm_id TEXT,
  name TEXT,
  feature_type TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  tags JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS geospatial_features_location_gix
  ON geospatial_features USING GIST (location);

CREATE INDEX IF NOT EXISTS geospatial_features_type_idx
  ON geospatial_features (feature_type);

CREATE UNIQUE INDEX IF NOT EXISTS geospatial_features_osm_id_uidx
  ON geospatial_features (osm_id)
  WHERE osm_id IS NOT NULL;
