import { Header } from "../components/Header";
import { MetricsBar } from "../components/MetricsBar";
import { HotspotMap } from "../components/HotspotMap";
import { EventPanel } from "../components/EventPanel";
import { ChartsPanel } from "../components/ChartsPanel";
import { AlertBanner } from "../components/AlertBanner";
import { DemoScenarioPlayer } from "../components/demo/DemoScenarioPlayer";
import { useTrace } from "../hooks/useTrace";
import { RefreshCw } from "lucide-react";

export function CommandCenter() {
  const { error, dataMode, refresh, loading } = useTrace();
  const isDemo = dataMode === "demo";

  return (
    <div className="flex min-h-screen flex-col bg-space text-slate-100 selection:bg-accent selection:text-ink font-sans">
      <Header />
      <MetricsBar />

      {error && (
        <div className="mx-4 sm:mx-5 mb-3 rounded-xl border border-danger/40 bg-danger/10 px-4 py-2.5 text-xs sm:text-sm font-mono text-danger flex items-center justify-between">
          <span>{error}</span>
          <span className="text-slate-400 text-xs">If live FIRMS is unavailable, use Judge Demo Mode for pre-loaded datasets.</span>
        </div>
      )}

      {/* SESSION 1: JUDGE INSTANT DEMO MODE (Curated Real-World Scenarios) */}
      {isDemo && <DemoScenarioPlayer />}

      {/* SESSION 2: ORIGINAL LIVE OPERATIONAL STREAM INDICATOR */}
      {!isDemo && (
        <div className="mx-4 sm:mx-5 mb-3 rounded-xl bg-panel/75 border border-accent/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
            <span className="text-white font-bold tracking-wider">LIVE OPERATIONAL SATELLITE TELEMETRY</span>
            <span className="text-slate-400 hidden sm:inline">&bull; Connected to NASA FIRMS (LANCE) & Sentinel-2 Downlink</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refresh("live")}
              disabled={loading}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-panel-light hover:bg-line border border-line text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              <span>SYNC LIVE SENSORS</span>
            </button>
          </div>
        </div>
      )}

      <AlertBanner />

      <main className="grid flex-1 grid-cols-1 gap-3 px-4 sm:px-5 pb-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <HotspotMap />
        <EventPanel />
      </main>

      <ChartsPanel />

      <footer className="border-t border-line/80 bg-ink/90 px-4 sm:px-5 py-3 text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          TRACE // Geospatial Thermal Risk Attribution & Classification Engine
        </div>
        <div className="text-[11px] text-slate-400">
          Compliant with NASA FIRMS LANCE & ISRO Earth Observation Standards
        </div>
      </footer>
    </div>
  );
}
