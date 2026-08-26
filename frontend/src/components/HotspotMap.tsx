import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { useTrace } from "../hooks/useTrace";
import { markerColor, prettyClass } from "../utils/format";

const CHENNAI: [number, number] = [13.0827, 80.2707];

export function HotspotMap() {
  const { events, selected, selectEvent, intelligence } = useTrace();
  return (
    <div className="h-full min-h-[420px] overflow-hidden rounded-lg border border-line">
      <MapContainer center={CHENNAI} zoom={11} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event) => {
          const risk = intelligence?.event.id === event.id ? intelligence.risk.level : undefined;
          const classification =
            intelligence?.event.id === event.id ? intelligence.attribution.classification : undefined;
          const color = markerColor({
            confidence: event.confidence,
            frp: event.frp,
            risk,
            classification,
          });
          return (
            <CircleMarker
              key={event.id}
              center={[event.latitude, event.longitude]}
              radius={selected?.id === event.id ? 12 : 8}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 2 }}
              eventHandlers={{ click: () => selectEvent(event) }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">Thermal anomaly</div>
                  <div>{event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}</div>
                  <div>FRP: {event.frp ?? "n/a"} MW</div>
                  <div>Confidence: {event.confidence}</div>
                  {classification && <div>Probable: {prettyClass(classification)}</div>}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
