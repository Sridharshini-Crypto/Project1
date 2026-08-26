import type { ReactNode } from "react";
import { useTrace } from "../hooks/useTrace";
import { formatKm, prettyClass } from "../utils/format";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-4 rounded-lg border border-line bg-ink/60 p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-line/60 py-1 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-mono text-slate-100">{value ?? "—"}</span>
    </div>
  );
}

export function EventPanel() {
  const { selected, intelligence, analyzing, setImpactRadius } = useTrace();
  if (!selected) {
    return (
      <aside className="h-full rounded-lg border border-line bg-panel p-4 text-sm text-slate-400">
        Select a thermal hotspot on the Chennai map to open the intelligence panel.
      </aside>
    );
  }

  const intel = intelligence;
  return (
    <aside className="trace-scroll h-full overflow-y-auto rounded-lg border border-line bg-panel p-4">
      <h2 className="mb-3 text-sm font-semibold tracking-wide">Selected Event Intelligence</h2>
      {analyzing && <p className="mb-3 text-xs text-warn">Running TRACE pipeline…</p>}

      <Block title="Thermal Event">
        <Row label="Event ID" value={selected.id.slice(0, 8)} />
        <Row label="Coordinates" value={`${selected.latitude.toFixed(4)}, ${selected.longitude.toFixed(4)}`} />
        <Row label="Detection" value={`${selected.acquisition_date} ${selected.acquisition_time ?? ""}`} />
        <Row label="Satellite" value={`${selected.satellite ?? ""} / ${selected.instrument ?? ""}`} />
        <Row label="FRP" value={selected.frp !== null ? `${selected.frp} MW` : "n/a"} />
        <Row label="Confidence" value={selected.confidence} />
      </Block>

      {intel && (
        <>
          <Block title="TRACE Attribution">
            <p className="text-lg font-semibold">{prettyClass(intel.attribution.classification)}</p>
            <p className="text-xs text-slate-400">{intel.attribution.label}</p>
            <Row label="Confidence" value={`${intel.attribution.confidence}%`} />
            <ul className="mt-2 list-disc pl-4 text-sm text-slate-300">
              {intel.attribution.factors.map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          </Block>

          <Block title="Geospatial Context">
            <Row label="Nearest industry" value={intel.context.nearest_industry?.name ?? "none nearby"} />
            <Row label="Distance" value={formatKm(intel.context.nearest_industry?.distance_meters)} />
            <Row label="Nearest vegetation" value={intel.context.nearest_vegetation?.name ?? "none nearby"} />
            <Row label="Nearest settlement" value={intel.context.nearest_settlement?.name ?? "none nearby"} />
            <Row
              label="Nearest critical infra"
              value={intel.context.nearest_critical_infrastructure?.name ?? "none nearby"}
            />
            <p className="mt-2 text-xs text-slate-500">{intel.context.disclaimer}</p>
          </Block>

          <Block title="Historical Intelligence">
            <Row label="7-day detections" value={intel.history.last_7_day} />
            <Row label="30-day detections" value={intel.history.last_30_day} />
            <Row label="Average FRP" value={`${intel.history.average_frp} MW`} />
            <Row label="Persistence" value={`${intel.history.persistence_score} / ${intel.history.persistence_level}`} />
            <p className="mt-2 text-xs text-slate-500">{intel.history.formula}</p>
          </Block>

          <Block title="Sentinel-2">
            {intel.satellite.available ? (
              <>
                {intel.satellite.image_url && (
                  <img src={intel.satellite.image_url} alt="Sentinel-2 AOI" className="mb-2 w-full rounded" />
                )}
                <Row label="Date" value={intel.satellite.acquisition_date} />
                <Row label="Cloud %" value={intel.satellite.cloud_percentage ?? "n/a"} />
                <Row label="NDVI" value={intel.satellite.ndvi ?? "n/a"} />
                <p className="mt-2 text-xs text-slate-500">{intel.satellite.interpretation}</p>
              </>
            ) : (
              <p className="text-sm text-slate-400">{intel.satellite.reason}</p>
            )}
          </Block>

          <Block title="Abnormality">
            <Row label="Status" value={intel.anomaly.status} />
            <Row label="Score" value={intel.anomaly.score} />
            <ul className="mt-2 list-disc pl-4 text-sm text-slate-300">
              {intel.anomaly.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </Block>

          <Block title="Risk">
            <p className="text-2xl font-semibold">
              {intel.risk.score} <span className="text-sm text-slate-400">/ 100 · {intel.risk.level}</span>
            </p>
            {intel.risk.contributors.map((item) => (
              <Row key={item.name} label={item.name} value={`+${item.points}`} />
            ))}
            <p className="mt-2 text-xs text-slate-500">{intel.risk.formula}</p>
          </Block>

          <Block title="Potential Exposure">
            <div className="mb-2 flex gap-2">
              {[1, 2, 5].map((km) => (
                <button
                  key={km}
                  className={`rounded border px-2 py-1 text-xs ${
                    intel.impact.radius_km === km ? "border-accent text-accent" : "border-line"
                  }`}
                  onClick={() => setImpactRadius(km)}
                >
                  {km} km
                </button>
              ))}
            </div>
            <Row label="Industrial assets" value={intel.impact.summary.industrial} />
            <Row label="Settlements" value={intel.impact.summary.settlements} />
            <Row label="Critical infrastructure" value={intel.impact.summary.critical_infrastructure} />
            <p className="mt-2 text-xs text-slate-500">{intel.impact.disclaimer}</p>
          </Block>

          <p className="text-xs text-slate-500">{intel.scientific_notes[0]} Requires ground verification.</p>
        </>
      )}
    </aside>
  );
}
