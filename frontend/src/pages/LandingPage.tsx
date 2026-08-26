import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Satellite,
  Crosshair,
  Building2,
  Shield,
  ArrowRight,
  Activity,
  Database,
} from "lucide-react";
import { RealisticEarth } from "../components/landing/RealisticEarth";
import { TraceLogo3D } from "../components/landing/TraceLogo3D";
import { EarthObservatory } from "../components/landing/EarthObservatory";

export function LandingPage() {
  const navigate = useNavigate();

  const handleEnterPlatform = () => {
    navigate("/access");
  };

  return (
    <div className="relative min-h-screen bg-[#02050b] text-slate-100 overflow-x-hidden selection:bg-accent selection:text-ink font-sans">
      {/* Background Subtle Tech Grid & Ambient Star Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-tech-grid opacity-15" />
        <div className="absolute inset-0 bg-scanlines opacity-5" />
        {/* Subtle cyan ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Header — Matching Reference Image */}
      <header className="relative z-40 border-b border-line/60 bg-space/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo with Pulse Wave Icon */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex items-center text-cyan-400">
              <Activity className="w-5 h-5 text-cyan-400 stroke-[2.5]" />
            </div>
            <span className="font-mono font-bold text-lg tracking-[0.2em] text-white group-hover:text-cyan-400 transition-colors">
              TRACE
            </span>
          </div>

          {/* Navigation Links & Vertical Divider Lines */}
          <nav className="flex items-center text-xs font-mono tracking-wider text-slate-300">
            <a
              href="#about"
              className="px-4 py-1 hover:text-cyan-400 transition-colors border-r border-line/80"
            >
              ABOUT
            </a>
            <a
              href="#features"
              className="px-4 py-1 hover:text-cyan-400 transition-colors border-r border-line/80"
            >
              FEATURES
            </a>
            <a
              href="#technology"
              className="px-4 py-1 hover:text-cyan-400 transition-colors border-r border-line/80"
            >
              TECHNOLOGY
            </a>
            <button
              onClick={handleEnterPlatform}
              className="pl-4 py-1 text-cyan-400 font-bold hover:text-white transition-colors cursor-pointer"
            >
              ACCESS GATEWAY
            </button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION — Matching media_1787753768661.png */}
      <section className="relative z-10 min-h-[calc(100vh-110px)] max-w-7xl mx-auto px-6 py-8 flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 my-auto">
          {/* Left Column: 3D Earth at Night with Glowing City Lights & Orbit Trajectories (6 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex items-center justify-center relative"
          >
            <RealisticEarth />
          </motion.div>

          {/* Right Column: Hero Typography & 4 Core Pillars (6 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 text-left space-y-6 lg:pl-4"
          >
            {/* Title TRΛCE in Giant Bold Modern Typography */}
            <div>
              <div className="flex items-baseline">
                <h1 className="text-5xl sm:text-7xl font-extrabold tracking-[0.18em] text-white font-sans">
                  TR<span className="text-cyan-400">Λ</span>CE
                </h1>
              </div>

              {/* Subtitle with RISK highlighted in cyan */}
              <div className="mt-2 text-xs sm:text-sm font-mono tracking-[0.25em] text-slate-300 uppercase">
                THERMAL <span className="text-cyan-400 font-bold">RISK</span> ATTRIBUTION & CLASSIFICATION ENGINE
              </div>

              {/* Tagline with corner bracket ˥ */}
              <p className="mt-3 text-sm sm:text-base text-slate-300 font-light flex items-center gap-1.5">
                <span>From thermal detection to</span>
                <span className="text-cyan-400 font-mono font-semibold">˥</span>
                <span>actionable intelligence.</span>
              </p>
            </div>

            {/* 4 Core Pillars Stack (DETECT, ANALYZE, ATTRIBUTE, EXPOSE) */}
            <div className="space-y-4 pt-2">
              {/* Pillar 1: DETECT */}
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-panel border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all">
                  <Satellite className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono font-bold tracking-wider text-white">DETECT</div>
                  <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Real-time thermal anomaly detection using <span className="text-cyan-400 font-medium">NASA FIRMS</span> data.
                  </div>
                </div>
              </div>

              {/* Pillar 2: ANALYZE */}
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-panel border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all">
                  <Crosshair className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono font-bold tracking-wider text-white">ANALYZE</div>
                  <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    <span className="text-cyan-400 font-medium">AI-powered</span> analysis for persistence, abnormality and risk scoring.
                  </div>
                </div>
              </div>

              {/* Pillar 3: ATTRIBUTE */}
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-panel border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono font-bold tracking-wider text-white">ATTRIBUTE</div>
                  <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Probable source <span className="text-cyan-400 font-medium">attribution</span> with confidence scoring.
                  </div>
                </div>
              </div>

              {/* Pillar 4: EXPOSE */}
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-panel border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono font-bold tracking-wider text-white">EXPOSE</div>
                  <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Identify nearby assets and potential <span className="text-cyan-400 font-medium">exposure</span> for informed decisions.
                  </div>
                </div>
              </div>
            </div>

            {/* High-Tech Cyan Corner-Bracketed Button: [ EXPLORE TRACE → ] */}
            <div className="pt-3">
              <button
                onClick={handleEnterPlatform}
                className="relative group px-8 py-3.5 bg-ink/70 hover:bg-panel border border-cyan-500/40 text-xs font-mono tracking-[0.2em] font-bold text-white uppercase transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] cursor-pointer"
              >
                {/* Tech Corner Brackets */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400" />

                <div className="flex items-center gap-3">
                  <span>EXPLORE TRACE</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Hero Bottom Telemetry Strip — Matching Reference Image */}
        <div className="w-full pt-6 pb-2 border-t border-line/40 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">TRACE™</span>
            <span>|</span>
            <span>THERMAL INTELLIGENCE FOR A SAFER TOMORROW.</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400">13.0827° N, 80.2707° E</span>
          </div>
        </div>
      </section>

      {/* SECTION: 3D VOLUMETRIC TRACE SHIELD CORE OBJECT */}
      <section id="technology" className="relative z-10 py-16 px-6 max-w-7xl mx-auto border-t border-line/60 text-center">
        <div className="max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>TRACE PHYSICAL 3D EMBLEM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Volumetric Intelligence Core</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Drag with your mouse to rotate the genuine 3D extruded shield badge in 360° space.
          </p>
        </div>

        <TraceLogo3D />
      </section>

      {/* SECTION: TRACE EARTHWATCH INTERACTIVE OBSERVATORY */}
      <section id="features" className="relative z-10 border-t border-line/60 bg-[#030814]/90">
        <EarthObservatory />
      </section>

      {/* SECTION: ARCHITECTURE WORKFLOW & DATA MATRIX */}
      <section id="about" className="relative z-10 py-16 px-6 max-w-7xl mx-auto border-t border-line/60">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How TRACE Delivers Thermal Clarity</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-panel/75 border border-line text-left">
            <div className="text-xs font-mono text-cyan-400 font-bold mb-2">01. INGESTION</div>
            <h3 className="text-sm font-bold text-white mb-1">NASA FIRMS API</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Continuous 375m VIIRS radiometry scanning brightness temperature and Fire Radiative Power (FRP).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-panel/75 border border-line text-left">
            <div className="text-xs font-mono text-cyan-400 font-bold mb-2">02. FUSION</div>
            <h3 className="text-sm font-bold text-white mb-1">Sentinel-2 & OSM</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Spatial alignment with industrial parks, power substations, and multi-spectral vegetation indices.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-panel/75 border border-line text-left">
            <div className="text-xs font-mono text-cyan-400 font-bold mb-2">03. ATTRIBUTION</div>
            <h3 className="text-sm font-bold text-white mb-1">Ensemble AI</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Machine learning classifier scoring temporal persistence to distinguish industrial flaring from wildfires.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-panel/75 border border-line text-left">
            <div className="text-xs font-mono text-cyan-400 font-bold mb-2">04. DECISION</div>
            <h3 className="text-sm font-bold text-white mb-1">Hazard Blast Radius</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instant impact footprint modeling and automated actionable advisories for first responders.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative z-10 py-16 px-6 max-w-4xl mx-auto text-center">
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-panel to-ink border border-cyan-500/30 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Ready to Initialize TRACE Command Center?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
            Access live thermal observation zones, explore active hotspot clusters, and evaluate AI attribution reports.
          </p>
          <button
            onClick={handleEnterPlatform}
            className="px-8 py-3.5 rounded-xl bg-cyan-400 text-ink font-mono text-xs sm:text-sm font-bold inline-flex items-center gap-2.5 hover:bg-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>ENTER COMMAND CENTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-line/80 bg-ink/90 px-6 py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>TRACE: Thermal Risk Attribution & Classification Engine</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            NASA FIRMS & ISRO Earth Observation Protocols Compliant
          </div>
        </div>
      </footer>
    </div>
  );
}
