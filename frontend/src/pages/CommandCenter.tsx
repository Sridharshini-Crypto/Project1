import { Header } from "../components/Header";
import { MetricsBar } from "../components/MetricsBar";
import { HotspotMap } from "../components/HotspotMap";
import { EventPanel } from "../components/EventPanel";
import { ChartsPanel } from "../components/ChartsPanel";
import { AlertBanner } from "../components/AlertBanner";
import { DemoScenarioPlayer } from "../components/demo/DemoScenarioPlayer";
import { useTrace } from "../hooks/useTrace";

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
          <span className="text-slate-400 text-xs">If live FIRMS is unavailable, switch to Judge Demo Mode for pre-loaded datasets.</span>
        </div>
      )}

      {isDemo && <DemoScenarioPlayer />}

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
