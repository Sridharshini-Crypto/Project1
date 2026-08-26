CREATE TABLE IF NOT EXISTS historical_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thermal_event_id UUID REFERENCES thermal_events(id) ON DELETE CASCADE,
  external_id TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  event_date DATE NOT NULL,
  frp DOUBLE PRECISION,
  confidence TEXT,
  source TEXT
);

CREATE INDEX IF NOT EXISTS historical_events_event_idx
  ON historical_events (thermal_event_id);

CREATE INDEX IF NOT EXISTS historical_events_location_gix
  ON historical_events USING GIST (location);
