export function markerColor(event: {
  confidence?: string | null;
  frp?: number | null;
  risk?: string;
  classification?: string;
}) {
  if (event.risk === "CRITICAL") return "#ff3b30";
  if (event.risk === "HIGH") return "#ff6b4a";
  if (event.classification === "INDUSTRIAL" || event.classification === "GAS_FLARE_PERSISTENT_HEAT") {
    return "#f4b942";
  }
  const conf = (event.confidence || "").toLowerCase();
  if (conf === "high" || Number(conf) >= 80) return "#ff8a4c";
  if ((event.frp ?? 0) >= 40) return "#ff9f1c";
  if (conf === "low") return "#7aa2b2";
  return "#3ee0c6";
}

export function formatKm(meters?: number) {
  if (meters === undefined || meters === null) return "n/a";
  return `${(meters / 1000).toFixed(2)} km`;
}

export function prettyClass(value?: string) {
  return (value || "OTHER").replaceAll("_", " ");
}
