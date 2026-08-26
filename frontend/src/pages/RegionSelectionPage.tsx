import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  MapPin,
  Satellite,
  Compass,
  ArrowRight,
  Activity,
  ChevronLeft,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { useSession, PRESET_REGIONS, type ObservationRegion } from "../context/SessionContext";
import { RegionGlobe } from "../components/region/RegionGlobe";
import { SpaceBackground } from "../components/landing/SpaceBackground";
import { LandingTelemetry } from "../components/landing/LandingTelemetry";

export function RegionSelectionPage() {
  const navigate = useNavigate();
  const { session, region, setRegion } = useSession();
  const [selectedId, setSelectedId] = useState<string>(region.id || "chennai");
  const [customLat, setCustomLat] = useState<string>("13.0827");
  const [customLng, setCustomLng] = useState<string>("80.2707");
  const [customName, setCustomName] = useState<string>("Custom Observation Zone");
  const [isCustom, setIsCustom] = useState(false);

  const handleSelectPreset = (id: "chennai" | "india" | "global") => {
    setIsCustom(false);
    setSelectedId(id);
    setRegion(PRESET_REGIONS[id]);
  };

  const handleLaunchDashboard = () => {
    if (isCustom) {
      const customRegion: ObservationRegion = {
        id: "custom",
        name: customName || "Custom Sector",
        country: "Target Coordinates",
        coordinates: `${customLat}° N, ${customLng}° E`,
        lat: parseFloat(customLat) || 13.0827,
        lng: parseFloat(customLng) || 80.2707,
        zoom: 10,
        satelliteFeed: "VIIRS-SNPP Geodetic Bounding Swath",
        resolution: "375m Spatial Matrix",
        status: "ACTIVE",
        description: "User-configured targeted geodetic sector for anomaly tracking.",
      };
      setRegion(customRegion);
    }
    navigate("/dashboard");
  };

  const currentActive = isCustom
    ? {
        id: "custom",
        name: customName,
        country: "Custom Geodetic Grid",
        coordinates: `${customLat}° N, ${customLng}° E`,
        satelliteFeed: "Targeted VIIRS / Sentinel Swath",
        resolution: "375m High-Precision",
        status: "ACTIVE" as const,
        description: "Custom coordinate perimeter configured for immediate thermal inspection.",
      }
    : PRESET_REGIONS[selectedId] || PRESET_REGIONS.chennai;

  return (
    <div className="relative min-h-screen bg-space text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-accent selection:text-ink font-sans">
      <SpaceBackground />
      <LandingTelemetry />

      {/* Top Header */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-line/60 bg-panel/60 backdrop-blur-md">
        <button
          onClick={() => navigate("/access")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel/80 border border-line hover:border-accent/50 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-accent" />
          <span>AUTHENTICATION GATEWAY</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span>OPERATOR:</span>
            <span className="text-white font-bold">{session?.fullName || "COMMAND OPERATOR"}</span>
          </div>
          <span className="hidden sm:inline text-line">|</span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent text-[11px] font-bold">
            <Activity className="w-3 h-3" />
            <span>MISSION BRIEFING: ZONE LOCK</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>GEOSPATIAL MISSION CONFIGURATION</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">SELECT OBSERVATION ZONE</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Configure the geographical bounding zone for real-time thermal anomaly monitoring and AI attribution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: 3D Interactive Globe */}
          <div className="lg:col-span-6 rounded-3xl bg-panel/80 border border-line-bright p-4 sm:p-6 backdrop-blur-xl shadow-2xl relative flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-line pb-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Globe className="w-4 h-4 text-accent" />
                <span>INTERACTIVE PLANETARY GRID</span>
              </div>
              <div className="text-[10px] font-mono text-accent animate-pulse">
                ORBIT: 824 KM // INCLINATION 98.7°
              </div>
            </div>

            <RegionGlobe
              selectedRegionId={selectedId}
              onSelectRegion={handleSelectPreset}
            />

            {/* Hint below globe */}
            <div className="w-full mt-2 pt-2 border-t border-line/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-danger animate-ping" />
                <span>ACTIVE HOTSPOTS MAPPED</span>
              </div>
              <span className="text-slate-500">CLICK PRESET TO ROTATE</span>
            </div>
          </div>

          {/* Right Column: Zone Selection & Live Parameters */}
          <div className="lg:col-span-6 space-y-4">
            {/* Zone Selector Tabs */}
            <div className="space-y-2.5">
              {/* Preset 1: Chennai (Recommended Live) */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectPreset("chennai")}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  selectedId === "chennai" && !isCustom
                    ? "bg-panel-light border-accent shadow-[0_0_20px_rgba(62,224,198,0.2)] ring-1 ring-accent"
                    : "bg-panel/70 border-line hover:border-line-bright hover:bg-panel"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-danger/15 border border-danger/40 text-danger mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">
                          Chennai & Ennore Industrial Corridor
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent/20 border border-accent text-accent font-bold">
                          LIVE BACKEND SYNC
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Tamil Nadu coastal sector. Linked to active database & live FIRMS pipeline.
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-400">
                        <span>13.0827° N, 80.2707° E</span>
                        <span>•</span>
                        <span className="text-accent">375m VIIRS Thermal</span>
                      </div>
                    </div>
                  </div>
                  {selectedId === "chennai" && !isCustom && (
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  )}
                </div>
              </motion.button>

              {/* Preset 2: India National */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectPreset("india")}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  selectedId === "india" && !isCustom
                    ? "bg-panel-light border-accent shadow-[0_0_20px_rgba(62,224,198,0.2)] ring-1 ring-accent"
                    : "bg-panel/70 border-line hover:border-line-bright hover:bg-panel"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-accent/15 border border-accent/40 text-accent mt-0.5">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">India National Sector</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-700 text-slate-300">
                          ALL-INDIA MATRIX
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Forest fire belts, stubble burning zones, and major industrial hubs.
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-400">
                        <span>20.5937° N, 78.9629° E</span>
                        <span>•</span>
                        <span className="text-cyan-400">NOAA-20 / MODIS Matrix</span>
                      </div>
                    </div>
                  </div>
                  {selectedId === "india" && !isCustom && (
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  )}
                </div>
              </motion.button>

              {/* Preset 3: Worldwide Global */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectPreset("global")}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  selectedId === "global" && !isCustom
                    ? "bg-panel-light border-accent shadow-[0_0_20px_rgba(62,224,198,0.2)] ring-1 ring-accent"
                    : "bg-panel/70 border-line hover:border-line-bright hover:bg-panel"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-400/15 border border-cyan-400/40 text-cyan-400 mt-0.5">
                      <Satellite className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">Worldwide Earth Observation</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-700 text-slate-300">
                          GLOBAL COVERAGE
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Global satellite constellation tracking 5,200+ planetary anomalies daily.
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-400">
                        <span>Global Orbital Swaths</span>
                        <span>•</span>
                        <span className="text-warn">NASA LANCE Constellation</span>
                      </div>
                    </div>
                  </div>
                  {selectedId === "global" && !isCustom && (
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  )}
                </div>
              </motion.button>

              {/* Custom Coordinates Toggle */}
              <div className="pt-1">
                <button
                  onClick={() => setIsCustom(!isCustom)}
                  className="flex items-center gap-1.5 text-xs font-mono text-accent hover:underline cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isCustom ? "Switch back to standard presets" : "Configure Custom Coordinate Bounding Box"}</span>
                </button>
              </div>

              {isCustom && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 rounded-xl bg-ink/70 border border-line-bright space-y-3 text-left"
                >
                  <div className="text-xs font-mono text-slate-300 font-bold">CUSTOM OBSERVATION ZONE</div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">ZONE IDENTIFIER</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g., Neyveli Thermal Zone"
                      className="w-full px-3 py-1.5 rounded-lg bg-panel border border-line text-xs font-mono text-white outline-none focus:border-accent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">LATITUDE (°N)</label>
                      <input
                        type="text"
                        value={customLat}
                        onChange={(e) => setCustomLat(e.target.value)}
                        placeholder="13.0827"
                        className="w-full px-3 py-1.5 rounded-lg bg-panel border border-line text-xs font-mono text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">LONGITUDE (°E)</label>
                      <input
                        type="text"
                        value={customLng}
                        onChange={(e) => setCustomLng(e.target.value)}
                        placeholder="80.2707"
                        className="w-full px-3 py-1.5 rounded-lg bg-panel border border-line text-xs font-mono text-white outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Active Telemetry Lock Box */}
            <div className="p-4 rounded-2xl bg-panel/90 border border-accent/40 backdrop-blur-md text-left">
              <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                  <span className="text-xs font-mono font-bold text-white tracking-wider">
                    OBSERVATION ZONE LOCKED
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-accent/20 border border-accent/40 text-accent text-[10px] font-mono font-bold">
                  STATUS: {currentActive.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <div className="text-slate-400 text-[11px]">ZONE NAME</div>
                  <div className="font-bold text-white truncate">{currentActive.name}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">COORDINATES</div>
                  <div className="font-bold text-cyan-400 truncate">{currentActive.coordinates}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">SATELLITE SENSOR</div>
                  <div className="text-slate-200 truncate">{currentActive.satelliteFeed}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">RESOLUTION MATRIX</div>
                  <div className="text-warn font-semibold truncate">{currentActive.resolution}</div>
                </div>
              </div>
            </div>

            {/* Launch Command Center CTA */}
            <button
              onClick={handleLaunchDashboard}
              className="w-full py-4 rounded-2xl bg-accent text-ink font-mono text-sm font-extrabold flex items-center justify-center gap-3 hover:bg-accent/90 shadow-[0_0_35px_rgba(62,224,198,0.4)] transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <span>LAUNCH COMMAND CENTER</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-4 text-[10px] font-mono text-slate-500 border-t border-line/40 bg-ink/80">
        TRACE GEOSPATIAL OBSERVATION NETWORK // READY FOR COMMAND CENTER INITIALIZATION
      </div>
    </div>
  );
}

