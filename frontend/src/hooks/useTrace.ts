import { createContext, useContext } from "react";
import type { DashboardSummary, Intelligence, ThermalEvent } from "../types/trace";

export type TraceState = {
  health: { status: string; database: string; demo_mode: boolean } | null;
  events: ThermalEvent[];
  dataMode: "demo" | "live" | "unknown";
  selected: ThermalEvent | null;
  intelligence: Intelligence | null;
  dashboard: DashboardSummary | null;
  loading: boolean;
  analyzing: boolean;
  error: string | null;
  selectEvent: (event: ThermalEvent) => void;
  loadScenario: (events: ThermalEvent[], primaryEvent: ThermalEvent, intel: Intelligence) => void;
  refresh: (mode?: "demo" | "live") => Promise<void>;
  setImpactRadius: (km: number) => Promise<void>;
};

export const TraceContext = createContext<TraceState | null>(null);

export function useTrace() {
  const ctx = useContext(TraceContext);
  if (!ctx) throw new Error("useTrace must be used within TraceProvider");
  return ctx;
}
