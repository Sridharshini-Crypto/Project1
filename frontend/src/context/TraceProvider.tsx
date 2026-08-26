import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { TraceContext, type TraceState } from "../hooks/useTrace";
import { analyzeEvent, fetchHotspots, getDashboard, getEventImpact, getHealth } from "../services/api";
import type { DashboardSummary, Intelligence, ThermalEvent } from "../types/trace";

function axiosMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    return data?.error || err.message || fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

export function TraceProvider({ children }: { children: React.ReactNode }) {
  const [health, setHealth] = useState<TraceState["health"]>(null);
  const [events, setEvents] = useState<ThermalEvent[]>([]);
  const [dataMode, setDataMode] = useState<TraceState["dataMode"]>("unknown");
  const [selected, setSelected] = useState<ThermalEvent | null>(null);
  const [intelligence, setIntelligence] = useState<Intelligence | null>(null);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (mode?: "demo" | "live") => {
    setLoading(true);
    setError(null);
    try {
      const healthRes = await getHealth();
      setHealth(healthRes);
      const hotspots = await fetchHotspots(
        mode === "demo" ? { demo: true } : mode === "live" ? { demo: false } : {}
      );
      setEvents(hotspots.events);
      setDataMode(hotspots.mode);
      setDashboard(await getDashboard());
    } catch (err) {
      setError(axiosMessage(err, "Failed to load TRACE data"));
    } finally {
      setLoading(false);
    }
  }, []);

  const selectEvent = useCallback(async (event: ThermalEvent) => {
    setSelected(event);
    setAnalyzing(true);
    setError(null);
    try {
      const intel = await analyzeEvent(event.id);
      setIntelligence(intel);
      setDashboard(await getDashboard());
    } catch (err) {
      setError(axiosMessage(err, "Analysis failed"));
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const setImpactRadius = useCallback(
    async (km: number) => {
      if (!selected || !intelligence) return;
      const impact = await getEventImpact(selected.id, km);
      setIntelligence({ ...intelligence, impact });
    },
    [selected, intelligence]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<TraceState>(
    () => ({
      health,
      events,
      dataMode,
      selected,
      intelligence,
      dashboard,
      loading,
      analyzing,
      error,
      selectEvent,
      refresh,
      setImpactRadius,
    }),
    [
      health,
      events,
      dataMode,
      selected,
      intelligence,
      dashboard,
      loading,
      analyzing,
      error,
      selectEvent,
      refresh,
      setImpactRadius,
    ]
  );

  return <TraceContext.Provider value={value}>{children}</TraceContext.Provider>;
}

