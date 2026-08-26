CREATE TABLE IF NOT EXISTS thermal_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  acquisition_date DATE NOT NULL,
  acquisition_time TEXT,
  satellite TEXT,
  instrument TEXT,
  source TEXT,
  frp DOUBLE PRECISION,
  confidence TEXT,
  bright_ti4 DOUBLE PRECISION,
  bright_ti5 DOUBLE PRECISION,
  day_night TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (external_id, acquisition_date, acquisition_time, satellite)
);

CREATE INDEX IF NOT EXISTS thermal_events_location_gix
  ON thermal_events USING GIST (location);

CREATE INDEX IF NOT EXISTS thermal_events_acq_date_idx
  ON thermal_events (acquisition_date DESC);
