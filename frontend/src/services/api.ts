import axios from "axios";
import type { DashboardSummary, Intelligence, ThermalEvent } from "../types/trace";

const client = axios.create({
  baseURL: "/api",
  timeout: 60000,
});

export async function getHealth() {
  const { data } = await client.get("/health");
  return data as {
    status: string;
    database: string;
    demo_mode: boolean;
    environment: string;
    error?: string;
  };
}

export async function fetchHotspots(opts?: { demo?: boolean; region?: string }) {
  const { data } = await client.get("/firms/hotspots", {
    params: {
      demo: opts?.demo === true ? "true" : opts?.demo === false ? "false" : undefined,
      region: opts?.region || "chennai",
    },
  });
  return data as {
    mode: "demo" | "live";
    count: number;
    events: ThermalEvent[];
    disclaimer: string;
  };
}

export async function listEvents() {
  const { data } = await client.get("/events");
  return data as { events: ThermalEvent[]; demo_mode: boolean };
}

export async function analyzeEvent(id: string, radiusKm = 2) {
  const { data } = await client.post(`/events/${id}/analyze`, { radiusKm });
  return data as Intelligence;
}

export async function getDashboard() {
  const { data } = await client.get("/dashboard/summary");
  return data as DashboardSummary;
}

export async function getEventImpact(id: string, radiusKm: number) {
  const { data } = await client.get(`/events/${id}/impact`, { params: { radiusKm } });
  return data as Intelligence["impact"];
}
