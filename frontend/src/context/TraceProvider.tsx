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
  const [dataMode, setDataMode] = useState<TraceState["dataMode"]>("live");
  const [selected, setSelected] = useState<ThermalEvent | null>(null);
  const [intelligence, setIntelligence] = useState<Intelligence | null>(null);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (mode?: "demo" | "live") => {
    setLoading(true);
    setError(null);
    const targetMode = mode || dataMode;
    try {
      const healthRes = await getHealth();
      setHealth(healthRes);
      const hotspots = await fetchHotspots(
        targetMode === "demo" ? { demo: true } : targetMode === "live" ? { demo: false } : {}
      );
      setEvents(hotspots.events);
      setDataMode(hotspots.mode === "demo" ? "demo" : "live");
      setDashboard(await getDashboard());
    } catch (err) {
      setError(axiosMessage(err, "Failed to load TRACE data"));
    } finally {
      setLoading(false);
    }
  }, [dataMode]);

  const selectEvent = useCallback(async (event: ThermalEvent) => {
    setSelected(event);
    setAnalyzing(true);
    setError(null);

    // If already pre-computed or client demo event, keep existing intelligence
    if (event.id.startsWith("demo-")) {
      setAnalyzing(false);
      return;
    }

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

  const loadScenario = useCallback(
    (scenarioEvents: ThermalEvent[], primaryEvent: ThermalEvent, intel: Intelligence) => {
      setEvents(scenarioEvents);
      setSelected(primaryEvent);
      setIntelligence(intel);
      setDataMode("demo");
    },
    []
  );

  const setImpactRadius = useCallback(
    async (km: number) => {
      if (!selected || !intelligence) return;
      if (selected.id.startsWith("demo-")) {
        setIntelligence({
          ...intelligence,
          impact: {
            ...intelligence.impact,
            radius_km: km,
          },
        });
        return;
      }
      try {
        const impact = await getEventImpact(selected.id, km);
        setIntelligence({ ...intelligence, impact });
      } catch {
        setIntelligence({
          ...intelligence,
          impact: {
            ...intelligence.impact,
            radius_km: km,
          },
        });
      }
    },
    [selected, intelligence]
  );

  useEffect(() => {
    void refresh("live");
  }, []);

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
      loadScenario,
      setDataMode,
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
      loadScenario,
      setDataMode,
      refresh,
      setImpactRadius,
    ]
  );

  return <TraceContext.Provider value={value}>{children}</TraceContext.Provider>;
}
