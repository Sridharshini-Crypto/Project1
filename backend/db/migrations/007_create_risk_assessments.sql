CREATE TABLE IF NOT EXISTS risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thermal_event_id UUID REFERENCES thermal_events(id) ON DELETE CASCADE,
  persistence_score DOUBLE PRECISION,
  anomaly_score DOUBLE PRECISION,
  exposure_score DOUBLE PRECISION,
  risk_score DOUBLE PRECISION NOT NULL,
  risk_level TEXT NOT NULL,
  contributors JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS risk_assessments_event_idx
  ON risk_assessments (thermal_event_id);
