import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Satellite,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock,
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

      {/* Minimalist Scientific Header */}
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
                EARTHWATCH OBSERVATORY
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

      {/* Hero with Clean 3D Volumetric TRACE Logo */}
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

      {/* TRACE EARTHWATCH (The Living 3D Thermal Earth Observatory) */}
      <section id="observatory" className="relative z-10 border-t border-line/60 bg-space/80 pb-16">
        <EarthObservatory />
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
