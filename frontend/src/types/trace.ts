export type ThermalEvent = {
  id: string;
  external_id: string;
  latitude: number;
  longitude: number;
  acquisition_date: string;
  acquisition_time: string | null;
  satellite: string | null;
  instrument: string | null;
  source: string | null;
  frp: number | null;
  confidence: string | null;
  bright_ti4: number | null;
  bright_ti5: number | null;
  day_night: string | null;
};

export type Feature = {
  name: string | null;
  feature_type: string;
  distance_meters?: number;
};

export type Intelligence = {
  event: ThermalEvent;
  context: {
    nearest_industry: Feature | null;
    nearest_vegetation: Feature | null;
    nearest_agriculture: Feature | null;
    nearest_settlement: Feature | null;
    nearest_critical_infrastructure: Feature | null;
    counts: Record<string, number>;
    disclaimer: string;
  };
  history: {
    total: number;
    last_7_day: number;
    last_30_day: number;
    average_frp: number;
    maximum_frp: number;
    persistence_score: number;
    persistence_level: string;
    formula: string;
  };
  satellite: {
    available: boolean;
    reason?: string;
    image_url?: string | null;
    acquisition_date?: string | null;
    cloud_percentage?: number | null;
    ndvi?: number | null;
    interpretation?: string;
  };
  attribution: {
    classification: string;
    confidence: number;
    label: string;
    factors: string[];
    disclaimer: string;
  };
  anomaly: {
    status: string;
    score: number;
    reasons: string[];
  };
  risk: {
    score: number;
    level: string;
    contributors: Array<{ name: string; points: number }>;
    formula: string;
  };
  impact: {
    label: string;
    radius_km: number;
    summary: Record<string, number>;
    disclaimer: string;
  };
  data_mode: string;
  scientific_notes: string[];
};

export type DashboardSummary = {
  demo_mode: boolean;
  metrics: {
    active_hotspots: number;
    high_risk_events: number;
    industrial_candidates: number;
    persistent_sources: number;
    abnormal_events: number;
  };
  charts: {
    hotspots_over_time: Array<{ date: string; count: number }>;
    risk_distribution: Array<{ level: string; count: number }>;
    classification_distribution: Array<{ classification: string; count: number }>;
    frp_trend: Array<{ date: string; avg_frp: number }>;
  };
  alerts: Array<{
    id: string;
    severity: string;
    title: string;
    message: string;
    status: string;
    created_at: string;
    latitude?: number;
    longitude?: number;
  }>;
};
