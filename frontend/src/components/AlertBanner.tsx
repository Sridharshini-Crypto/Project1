import { AlertTriangle } from "lucide-react";
import { useTrace } from "../hooks/useTrace";

export function AlertBanner() {
  const { dashboard } = useTrace();
  const alert = dashboard?.alerts?.[0];
  if (!alert) return null;
  return (
    <div className="mx-5 mb-3 flex items-start gap-3 rounded-lg border border-danger/50 bg-danger/10 px-4 py-3">
      <AlertTriangle className="mt-0.5 h-5 w-5 text-danger" />
      <div>
        <div className="text-sm font-semibold">🚨 {alert.title}</div>
        <p className="text-sm text-slate-300">{alert.message}</p>
      </div>
    </div>
  );
}
