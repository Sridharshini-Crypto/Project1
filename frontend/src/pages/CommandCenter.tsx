import { Header } from "../components/Header";
import { MetricsBar } from "../components/MetricsBar";
import { HotspotMap } from "../components/HotspotMap";
import { EventPanel } from "../components/EventPanel";
import { ChartsPanel } from "../components/ChartsPanel";
import { AlertBanner } from "../components/AlertBanner";
import { useTrace } from "../hooks/useTrace";

export function CommandCenter() {
  const { error } = useTrace();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <MetricsBar />
      {error && (
        <div className="mx-5 mb-3 rounded border border-danger/40 bg-danger/10 px-4 py-2 text-sm">
          {error} If live FIRMS is unavailable, use Switch to Demo Mode.
        </div>
      )}
      <AlertBanner />
      <main className="grid flex-1 grid-cols-1 gap-3 px-5 pb-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <HotspotMap />
        <EventPanel />
      </main>
      <ChartsPanel />
      <footer className="border-t border-line px-5 py-3 text-xs text-slate-500">
        TRACE provides contextual intelligence for thermal anomalies. It does not confirm cause, exact fire location,
        or damage. Ground verification is required.
      </footer>
    </div>
  );
}
