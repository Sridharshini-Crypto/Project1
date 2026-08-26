import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(
      `${name} is not set. Copy backend/.env.example to backend/.env and fill in the shared cloud DATABASE_URL.`
    );
  }
  return value;
}

function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

function bool(name: string, fallback = false): boolean {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  return raw.toLowerCase() === "true" || raw === "1";
}

export const env = {
  nodeEnv: optional("NODE_ENV", "development"),
  port: Number(optional("PORT", "5000")),
  databaseUrl: process.env.DATABASE_URL ?? "",
  nasaFirmsMapKey: optional("NASA_FIRMS_MAP_KEY"),
  sentinelClientId: optional("SENTINEL_CLIENT_ID"),
  sentinelClientSecret: optional("SENTINEL_CLIENT_SECRET"),
  demoMode: bool("DEMO_MODE", true),
  frontendUrl: optional("FRONTEND_URL", "http://localhost:5173"),
  defaultRegion: optional("DEFAULT_REGION", "chennai"),
  firmsDayRange: Number(optional("FIRMS_DAY_RANGE", "3")),
  osmRadiusMeters: Number(optional("OSM_RADIUS_METERS", "5000")),
  historyRadiusMeters: Number(optional("HISTORY_RADIUS_METERS", "1000")),
  historyWindowDays: Number(optional("HISTORY_WINDOW_DAYS", "30")),
  sentinelAoiKm: Number(optional("SENTINEL_AOI_KM", "1")),
};

export type DatabaseConfig = {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
};

export function parseDatabaseUrl(raw: string): DatabaseConfig {
  const trimmed = raw.trim();
  const match = trimmed.match(
    /^postgres(?:ql)?:\/\/([^:/?#]+):(.+)@([^:/?#]+):(\d+)\/([^?]+)(?:\?.*)?$/
  );
  if (!match) {
    throw new Error(
      "DATABASE_URL must look like postgresql://USER:PASSWORD@HOST:5432/DATABASE"
    );
  }
  return {
    user: decodeURIComponent(match[1]),
    password: decodeURIComponent(match[2]),
    host: match[3],
    port: Number(match[4]),
    database: match[5],
  };
}

export function assertDatabaseUrl(): string {
  if (!env.databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing. TRACE connects only to the shared cloud PostgreSQL database. Never use localhost credentials. Copy .env.example to .env and set DATABASE_URL."
    );
  }
  if (/localhost|127\.0\.0\.1/i.test(env.databaseUrl) && env.nodeEnv === "production") {
    throw new Error("DATABASE_URL must not point at localhost in this team architecture.");
  }
  return env.databaseUrl;
}

export function getDatabaseConfig(): DatabaseConfig {
  return parseDatabaseUrl(assertDatabaseUrl());
}

export { required };
