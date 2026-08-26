import { Activity, Satellite } from "lucide-react";
import { useTrace } from "../hooks/useTrace";

export function Header() {
  const { dataMode, health, refresh, loading } = useTrace();
  const demo = dataMode === "demo" || health?.demo_mode;

  return (
    <header className="border-b border-line bg-panel/90 px-5 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            <h1 className="text-xl font-semibold tracking-wide">TRACE</h1>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Thermal Risk Attribution & Classification Engine
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">From Thermal Detection to Actionable Intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              demo ? "border-warn text-warn" : "border-accent text-accent"
            }`}
          >
            {demo ? "DEMO DATA" : "LIVE DATA"}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs text-slate-300">
            DB: {health?.database ?? "unknown"}
          </span>
          <button
            className="rounded border border-line px-3 py-1 text-xs hover:border-accent"
            onClick={() => refresh("live")}
            disabled={loading}
          >
            Refresh live
          </button>
          <button
            className="rounded border border-warn/40 px-3 py-1 text-xs text-warn hover:border-warn"
            onClick={() => refresh("demo")}
            disabled={loading}
          >
            Switch to Demo Mode
          </button>
          <Satellite className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </header>
  );
}
