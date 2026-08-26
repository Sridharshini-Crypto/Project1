import type { ReactElement } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTrace } from "../hooks/useTrace";

export function ChartsPanel() {
  const { dashboard, events } = useTrace();
  const persistenceTrend = events.slice(0, 20).map((event, index) => ({
    i: index + 1,
    frp: event.frp ?? 0,
  }));

  return (
    <section className="grid grid-cols-1 gap-3 px-5 pb-5 lg:grid-cols-5">
      <ChartCard title="Hotspots over time">
        <LineChart data={dashboard?.charts.hotspots_over_time ?? []}>
          <CartesianGrid stroke="#1b3a4b" />
          <XAxis dataKey="date" hide />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#3ee0c6" dot={false} />
        </LineChart>
      </ChartCard>
      <ChartCard title="Risk distribution">
        <BarChart data={dashboard?.charts.risk_distribution ?? []}>
          <CartesianGrid stroke="#1b3a4b" />
          <XAxis dataKey="level" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#f4b942" />
        </BarChart>
      </ChartCard>
      <ChartCard title="Classification">
        <BarChart data={dashboard?.charts.classification_distribution ?? []}>
          <CartesianGrid stroke="#1b3a4b" />
          <XAxis dataKey="classification" hide />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#7aa2b2" />
        </BarChart>
      </ChartCard>
      <ChartCard title="FRP trend">
        <LineChart data={dashboard?.charts.frp_trend ?? []}>
          <CartesianGrid stroke="#1b3a4b" />
          <XAxis dataKey="date" hide />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="avg_frp" stroke="#ff6b4a" dot={false} />
        </LineChart>
      </ChartCard>
      <ChartCard title="Persistence proxy (FRP sample)">
        <LineChart data={persistenceTrend}>
          <CartesianGrid stroke="#1b3a4b" />
          <XAxis dataKey="i" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="frp" stroke="#3ee0c6" dot={false} />
        </LineChart>
      </ChartCard>
    </section>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactElement }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-3">
      <h3 className="mb-2 text-xs uppercase tracking-wider text-slate-400">{title}</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
