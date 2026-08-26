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
  created_at: string;
};

export type NormalizedHotspot = {
  id: string;
  latitude: number;
  longitude: number;
  acquisition_date: string;
  acquisition_time: string;
  satellite: string;
  instrument: string;
  confidence: string;
  frp: number | null;
  bright_ti4: number | null;
  bright_ti5: number | null;
  daynight: string;
  source: string;
};

export type GeospatialFeature = {
  id: string;
  osm_id: string | null;
  name: string | null;
  feature_type: string;
  latitude: number;
  longitude: number;
  tags: Record<string, unknown>;
  distance_meters?: number;
};
