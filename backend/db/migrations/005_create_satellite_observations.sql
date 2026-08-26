CREATE TABLE IF NOT EXISTS satellite_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thermal_event_id UUID REFERENCES thermal_events(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  image_url TEXT,
  acquisition_date DATE,
  cloud_percentage DOUBLE PRECISION,
  ndvi DOUBLE PRECISION,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS satellite_observations_event_idx
  ON satellite_observations (thermal_event_id);
