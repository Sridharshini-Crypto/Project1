import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Satellite,
  Flame,
  Layers,
  Cpu,
  ShieldCheck,
  Radio,
  ArrowRight,
  Sparkles,
  Compass,
  ChevronRight,
  TrendingUp,
  Clock,
  Eye,
  Database,
  Globe,
} from "lucide-react";
import { SpaceBackground } from "../components/landing/SpaceBackground";
import { TraceLogo3D } from "../components/landing/TraceLogo3D";
import { LandingTelemetry } from "../components/landing/LandingTelemetry";
import { EarthObservatory } from "../components/landing/EarthObservatory";

export function LandingPage() {
  const navigate = useNavigate();

  const handleEnterPlatform = () => {
    navigate("/access");
  };

  return (
    <div className="relative min-h-screen bg-space text-slate-100 overflow-x-hidden selection:bg-accent selection:text-ink font-sans">
      {/* Background Starfield & Space Atmosphere */}
      <SpaceBackground />

      {/* Top Orbital Telemetry Bar */}
      <LandingTelemetry />

      {/* SECTION 1: Minimalist Scientific Header */}
      <header className="sticky top-0 z-40 border-b border-line/80 bg-panel/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-panel border border-accent/40 p-1 flex items-center justify-center shadow-[0_0_12px_rgba(62,224,198,0.2)]">
              <img src="/trace-logo.png" alt="TRACE Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-base tracking-wider text-white">TRACE</span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent/15 border border-accent/30 text-accent font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                SYSTEM ONLINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden md:flex items-center gap-5 text-xs font-mono text-slate-300">
              <a href="#observatory" className="hover:text-accent transition-colors">
                EARTHWATCH
              </a>
              <a href="#pipeline" className="hover:text-accent transition-colors">
                ARCHITECTURE
              </a>
              <a href="#datasources" className="hover:text-accent transition-colors">
                DATA FEEDS
              </a>
            </nav>

            <button
              onClick={handleEnterPlatform}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-ink font-mono text-xs font-bold hover:bg-accent/90 shadow-[0_0_18px_rgba(62,224,198,0.35)] transition-all transform active:scale-95 cursor-pointer"
            >
              <span>ENTER PLATFORM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 2: Hero with True 3D Volumetric TRACE Logo */}
      <section className="relative z-10 pt-8 sm:pt-12 pb-14 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Mission Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-panel/90 border border-accent/40 text-accent text-xs font-mono mb-4 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>GEOSPATIAL THERMAL INTELLIGENCE OBSERVATORY</span>
        </motion.div>

        {/* Hero Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-2">
            TRACE
          </h1>
          <p className="text-sm sm:text-base font-mono text-accent uppercase tracking-widest mb-3">
            Thermal Risk Attribution & Classification Engine
          </p>
          <p className="text-base sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Tracing thermal anomalies from <span className="text-white font-medium">detection</span> to{" "}
            <span className="text-accent font-medium">decision</span>.
          </p>
        </motion.div>

        {/* 3D Volumetric Permanent TRACE Logo Object */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full mt-2"
        >
          <TraceLogo3D />
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 mt-4"
        >
          <a
            href="#observatory"
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-accent text-ink font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-accent/90 shadow-[0_0_25px_rgba(62,224,198,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>EXPLORE LIVE OBSERVATORY</span>
            <ChevronRight className="w-4 h-4" />
          </a>

          <button
            onClick={handleEnterPlatform}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-panel/80 hover:bg-panel border border-line hover:border-accent text-slate-200 font-mono text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>ENTER TRACE SYSTEM</span>
            <ArrowRight className="w-4 h-4 text-accent" />
          </button>
        </motion.div>

        {/* Mission Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl mt-10 pt-6 border-t border-line/60">
          <div className="p-3 rounded-xl bg-panel/60 border border-line text-left">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>LATENCY</span>
            </div>
            <div className="text-xl font-mono font-bold text-white mt-1">&lt; 15 Min</div>
            <div className="text-[10px] text-slate-400">Direct NASA LANCE downlink</div>
          </div>

          <div className="p-3 rounded-xl bg-panel/60 border border-line text-left">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-cyan-400" />
              <span>SWATH</span>
            </div>
            <div className="text-xl font-mono font-bold text-cyan-400 mt-1">375m VIIRS</div>
            <div className="text-[10px] text-slate-400">Sub-kilometer accuracy</div>
          </div>

          <div className="p-3 rounded-xl bg-panel/60 border border-line text-left">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-warn" />
              <span>AI ACCURACY</span>
            </div>
            <div className="text-xl font-mono font-bold text-warn mt-1">94.2%</div>
            <div className="text-[10px] text-slate-400">Multi-modal attribution</div>
          </div>

          <div className="p-3 rounded-xl bg-panel/60 border border-line text-left">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-danger" />
              <span>IMPACT BLAST</span>
            </div>
            <div className="text-xl font-mono font-bold text-danger mt-1">0 - 10 KM</div>
            <div className="text-[10px] text-slate-400">Dynamic hazard modeling</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TRACE EARTHWATCH (The Living 3D Thermal Earth Observatory) */}
      <section id="observatory" className="relative z-10 border-t border-line/60 bg-space/80">
        <EarthObservatory />
      </section>

      {/* SECTION 4: ARCHITECTURAL PIPELINE (Detect -> Context -> Attribute -> Act) */}
      <section id="pipeline" className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-line/60">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>OPERATIONAL WORKFLOW</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How TRACE Transforms Raw Thermal Data</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Eliminating false alarms and delivering decision-ready intelligence in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-panel/75 border border-line hover:border-danger/60 transition-all text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-danger font-bold">01. DETECT</span>
              <div className="p-2 rounded-lg bg-danger/10 text-danger border border-danger/30">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">NASA FIRMS Ingestion</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              VIIRS & MODIS satellite sensors scan infrared brightness temperatures and calculate Fire Radiative Power (FRP).
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-panel/75 border border-line hover:border-accent/60 transition-all text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-accent font-bold">02. CONTEXT</span>
              <div className="p-2 rounded-lg bg-accent/10 text-accent border border-accent/30">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Geospatial Fusion</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Overlays OpenStreetMap industrial parks, chemical plants, substations, and Sentinel-2 vegetation matrices.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-panel/75 border border-line hover:border-warn/60 transition-all text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-warn font-bold">03. ATTRIBUTE</span>
              <div className="p-2 rounded-lg bg-warn/10 text-warn border border-warn/30">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">AI Classification</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trained machine learning models differentiate between routine industrial flaring, agricultural burn, and forest wildfires.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-panel/75 border border-line hover:border-cyan-400/60 transition-all text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold">04. ACT</span>
              <div className="p-2 rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Risk Intelligence</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Computes dynamic hazard buffer radii, automated responder notifications, and mitigation protocols.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: LIVE DATA SOURCES MATRIX */}
      <section id="datasources" className="relative z-10 py-14 px-4 sm:px-6 max-w-7xl mx-auto border-t border-line/60">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-mono mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>DATA CONSTELLATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Direct Space & Geospatial Telemetry Feeds</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-panel/60 border border-line flex items-start gap-3">
            <div className="p-2 rounded-lg bg-danger/10 text-danger border border-danger/30">
              <Radio className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-mono font-bold text-white">NASA FIRMS (LANCE)</h4>
              <p className="text-xs text-slate-400 mt-1">
                Near-real-time VIIRS 375m & MODIS 1km active thermal infrared anomaly stream.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-panel/60 border border-line flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/30">
              <Eye className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-mono font-bold text-white">SENTINEL-2 L2A (ESA)</h4>
              <p className="text-xs text-slate-400 mt-1">
                10-meter multi-spectral optical and short-wave infrared (SWIR) plume inspection.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-panel/60 border border-line flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent border border-accent/30">
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-mono font-bold text-white">OPENSTREETMAP OVERPASS</h4>
              <p className="text-xs text-slate-400 mt-1">
                Global topological infrastructure, industrial buffer zones, and land classification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section className="relative z-10 py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-panel to-ink border border-accent/35 shadow-2xl overflow-hidden">
          <div className="w-12 h-12 mx-auto rounded-xl bg-panel border border-accent/50 p-2 mb-3 shadow-[0_0_20px_rgba(62,224,198,0.25)] flex items-center justify-center">
            <img src="/trace-logo.png" alt="TRACE" className="w-full h-full object-contain" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            TRACE does not guess. TRACE attributes.
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6">
            Access the operational command center to monitor live satellite hotspots, run AI spatial attribution, and model mitigation footprints.
          </p>

          <button
            onClick={handleEnterPlatform}
            className="px-8 py-3.5 rounded-xl bg-accent text-ink font-mono text-xs sm:text-sm font-bold inline-flex items-center gap-2.5 hover:bg-accent/90 shadow-[0_0_30px_rgba(62,224,198,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>INITIALIZE TRACE PLATFORM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Scientific Mission Footer */}
      <footer className="relative z-10 border-t border-line/80 bg-ink/90 px-4 sm:px-6 py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-panel border border-line p-0.5">
              <img src="/trace-logo.png" alt="TRACE" className="w-full h-full object-contain" />
            </div>
            <span>TRACE: Thermal Risk Attribution & Classification Engine</span>
          </div>

          <div className="text-slate-400 text-[11px]">
            NASA FIRMS LANCE & ISRO Earth Observation Standards Compliant
          </div>
        </div>
      </footer>
    </div>
  );
}
