export class AppError extends Error {
  status: number;
  expose: boolean;

  constructor(message: string, status = 400, expose = true) {
    super(message);
    this.status = status;
    this.expose = expose;
  }
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function isValidLatitude(value: number): boolean {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

export function isValidLongitude(value: number): boolean {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

export function assertCoordinates(latitude: number, longitude: number): void {
  if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
    throw new AppError(`Invalid coordinates: ${latitude}, ${longitude}`);
  }
}

export function makeExternalId(parts: Array<string | number | undefined>): string {
  return parts
    .map((part) => String(part ?? "").trim())
    .join("|")
    .replace(/\s+/g, "");
}

export function parseConfidence(raw: string | number | undefined): {
  label: string;
  numeric: number;
} {
  if (typeof raw === "number") {
    return { label: String(raw), numeric: clamp(raw) };
  }
  const value = String(raw ?? "").toLowerCase();
  if (value === "high" || value === "h") return { label: "high", numeric: 85 };
  if (value === "nominal" || value === "n") return { label: "nominal", numeric: 60 };
  if (value === "low" || value === "l") return { label: "low", numeric: 30 };
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return { label: String(numeric), numeric: clamp(numeric) };
  return { label: value || "unknown", numeric: 50 };
}

export function riskLevelFromScore(score: number): "LOW" | "MODERATE" | "HIGH" | "CRITICAL" {
  if (score >= 81) return "CRITICAL";
  if (score >= 61) return "HIGH";
  if (score >= 31) return "MODERATE";
  return "LOW";
}

export function anomalyStatusFromScore(score: number): "NORMAL" | "WATCH" | "ABNORMAL" | "CRITICAL" {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "ABNORMAL";
  if (score >= 35) return "WATCH";
  return "NORMAL";
}
