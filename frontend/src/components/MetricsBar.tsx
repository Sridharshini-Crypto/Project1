import { AlertTriangle, Factory, Flame, Radio, Waves } from "lucide-react";
import { useTrace } from "../hooks/useTrace";

const cards = [
  { key: "active_hotspots", label: "Active Hotspots", icon: Flame },
  { key: "high_risk_events", label: "High Risk Events", icon: AlertTriangle },
  { key: "industrial_candidates", label: "Industrial Candidates", icon: Factory },
  { key: "persistent_sources", label: "Analyzed Sources", icon: Radio },
  { key: "abnormal_events", label: "Abnormal Events", icon: Waves },
] as const;

export function MetricsBar() {
  const { dashboard } = useTrace();
  return (
    <section className="grid grid-cols-2 gap-3 px-5 py-3 lg:grid-cols-5">
      {cards.map(({ key, label, icon: Icon }) => (
        <div key={key} className="rounded-lg border border-line bg-panel px-4 py-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider">{label}</span>
            <Icon className="h-4 w-4 text-accent" />
          </div>
          <div className="mt-2 font-mono text-2xl">{dashboard?.metrics[key] ?? "—"}</div>
        </div>
      ))}
    </section>
  );
}
