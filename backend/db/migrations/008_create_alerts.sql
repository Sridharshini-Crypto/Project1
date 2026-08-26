CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thermal_event_id UUID REFERENCES thermal_events(id) ON DELETE CASCADE,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS alerts_event_idx
  ON alerts (thermal_event_id);

CREATE INDEX IF NOT EXISTS alerts_status_idx
  ON alerts (status, created_at DESC);
