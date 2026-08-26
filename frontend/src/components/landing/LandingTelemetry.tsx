import { useEffect, useState } from "react";
import { Satellite, Radio, Globe, Shield, Terminal } from "lucide-react";

export function LandingTelemetry() {
  const [time, setTime] = useState<string>("");
  const [coordinates, setCoordinates] = useState({ lat: 13.0827, lng: 80.2707 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Subtle coordinate drift simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCoordinates({
        lat: Number((13.0827 + (Math.random() - 0.5) * 0.005).toFixed(4)),
        lng: Number((80.2707 + (Math.random() - 0.5) * 0.005).toFixed(4)),
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full border-b border-line bg-panel/60 backdrop-blur-md px-4 py-2 text-[11px] font-mono text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: System Status & Clock */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-bold tracking-wider">TRACE ORBITAL TELEMETRY</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span>SYS_CLK:</span>
            <span className="text-slate-100">{time || "2026-08-26 13:30:00 UTC"}</span>
          </div>
        </div>

        {/* Center: Constellation Feed Status */}
        <div className="hidden md:flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <span>VIIRS (NOAA-20/SNPP):</span>
            <span className="text-cyan-400 font-semibold">SYNCHRONIZED</span>
          </div>
          <span className="text-line">|</span>
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-warn" />
            <span>MODIS LANCE:</span>
            <span className="text-warn font-semibold">ACTIVE</span>
          </div>
          <span className="text-line">|</span>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-accent" />
            <span>OSM FUSION:</span>
            <span className="text-accent font-semibold">ONLINE</span>
          </div>
        </div>

        {/* Right: Real-time Coordinates & Status Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-500">NADIR:</span>
            <span className="text-slate-200">
              {coordinates.lat}° N, {coordinates.lng}° E
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent text-[10px] font-bold">
            <Shield className="w-3 h-3" />
            <span>SYSTEM STATUS: NOMINAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

