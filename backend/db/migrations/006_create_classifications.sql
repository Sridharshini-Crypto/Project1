CREATE TABLE IF NOT EXISTS classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thermal_event_id UUID REFERENCES thermal_events(id) ON DELETE CASCADE,
  classification TEXT NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  explanation JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS classifications_event_idx
  ON classifications (thermal_event_id);
