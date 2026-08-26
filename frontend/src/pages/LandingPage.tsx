import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Satellite,
  Flame,
  Layers,
  Cpu,
  ShieldCheck,
  Radar,
  Radio,
  ArrowRight,
  Sparkles,
  Compass,
  AlertTriangle,
  FileCheck2,
  ChevronRight,
  TrendingUp,
  Clock,
  Eye,
} from "lucide-react";
import { SpaceBackground } from "../components/landing/SpaceBackground";
import { TraceLogo3D } from "../components/landing/TraceLogo3D";
import { LandingTelemetry } from "../components/landing/LandingTelemetry";

export function LandingPage() {
  const navigate = useNavigate();

  const handleEnterSystem = () => {
    navigate("/access");
  };

  return (
    <div className="relative min-h-screen bg-space text-slate-100 overflow-x-hidden selection:bg-accent selection:text-ink font-sans">
      {/* Background Starfield & Space Atmosphere */}
      <SpaceBackground />

      {/* Top Mission Telemetry Bar */}
      <LandingTelemetry />

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-line/80 bg-panel/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-panel border border-accent/40 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(62,224,198,0.2)]">
              <img src="/trace-logo.png" alt="TRACE Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base tracking-wider text-white">TRACE</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-accent/15 border border-accent/30 text-accent font-medium">
                  v2.4 ORBITAL
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
                THERMAL RISK ATTRIBUTION & CLASSIFICATION ENGINE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="hidden md:flex items-center gap-5 text-xs font-mono text-slate-300">
              <a href="#pipeline" className="hover:text-accent transition-colors">
                PIPELINE
              </a>
              <a href="#intelligence" className="hover:text-accent transition-colors">
                RADAR SIMULATION
              </a>
              <a href="#pillars" className="hover:text-accent transition-colors">
                CAPABILITIES
              </a>
            </nav>

            <button
              onClick={handleEnterSystem}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-ink font-mono text-xs font-bold hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(62,224,198,0.4)] transition-all transform active:scale-95 cursor-pointer"
            >
              <span>INITIALIZE SYSTEM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-8 sm:pt-14 pb-16 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Mission Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-panel/90 border border-accent/40 text-accent text-xs font-mono mb-6 shadow-[0_0_25px_rgba(62,224,198,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>FROM ORBIT TO INTELLIGENCE: EARTH OBSERVATION TELEMETRY</span>
        </motion.div>

        {/* Hero Title & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
              TRACE
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-mono text-accent uppercase tracking-widest mb-4">
            Thermal Risk Attribution & Classification Engine
          </p>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Tracing thermal anomalies from <span className="text-white font-medium">detection</span> to{" "}
            <span className="text-accent font-medium">decision</span>.
          </p>
        </motion.div>

        {/* 3D Holographic TRACE Logo Core Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="w-full mt-4"
        >
          <TraceLogo3D />
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-6"
        >
          <button
            onClick={handleEnterSystem}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent text-ink font-mono text-sm font-bold flex items-center justify-center gap-3 hover:bg-accent/90 shadow-[0_0_30px_rgba(62,224,198,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>INITIALIZE SYSTEM</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#pipeline"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-panel/80 hover:bg-panel border border-line hover:border-accent/50 text-slate-300 font-mono text-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>EXPLORE PIPELINE</span>
            <ChevronRight className="w-4 h-4 text-accent" />
          </a>
        </motion.div>

        {/* Key System Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-5xl mt-12 pt-8 border-t border-line/60">
          <div className="p-3.5 rounded-xl bg-panel/60 border border-line text-left">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>ORBITAL LATENCY</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white mt-1">&lt; 15 Min</div>
            <div className="text-[11px] text-slate-400">Direct NASA LANCE downlink</div>
          </div>

          <div className="p-3.5 rounded-xl bg-panel/60 border border-line text-left">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-cyan-400" />
              <span>SPATIAL SWATH</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-400 mt-1">375m VIIRS</div>
            <div className="text-[11px] text-slate-400">Sub-kilometer accuracy</div>
          </div>

          <div className="p-3.5 rounded-xl bg-panel/60 border border-line text-left">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-warn" />
              <span>AI ACCURACY</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-warn mt-1">94.2%</div>
            <div className="text-[11px] text-slate-400">Multi-modal attribution</div>
          </div>

          <div className="p-3.5 rounded-xl bg-panel/60 border border-line text-left">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-danger" />
              <span>IMPACT RADIUS</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-danger mt-1">0 - 10 KM</div>
            <div className="text-[11px] text-slate-400">Dynamic zone calculation</div>
          </div>
        </div>
      </section>

      {/* SECTION A: WHAT TRACE DOES (End-to-End Pipeline) */}
      <section id="pipeline" className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-line/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>INTELLIGENCE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">What TRACE Does</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From raw orbital infrared radiances to structured geospatial intelligence and hazard mitigation protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Step 1 */}
          <div className="relative p-5 rounded-2xl bg-panel/75 border border-line hover:border-danger/60 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-danger font-bold">01. CAPTURE</span>
                <div className="p-2 rounded-lg bg-danger/10 border border-danger/30 text-danger">
                  <Flame className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">NASA FIRMS Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                VIIRS & MODIS satellite constellations detect thermal anomalies and compute Fire Radiative Power (FRP).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line/60 text-[10px] font-mono text-slate-500">
              Sensor: VNP14IMGTDL
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-5 rounded-2xl bg-panel/75 border border-line hover:border-accent/60 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-accent font-bold">02. CONTEXT</span>
                <div className="p-2 rounded-lg bg-accent/10 border border-accent/30 text-accent">
                  <Compass className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Geospatial Context</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Overlays OpenStreetMap land-use, industrial parks, petrochemical plants, and electrical substations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line/60 text-[10px] font-mono text-slate-500">
              OSM Overpass API
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-5 rounded-2xl bg-panel/75 border border-line hover:border-cyan-400/60 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-cyan-400 font-bold">03. TEMPORAL</span>
                <div className="p-2 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Historical Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tracks thermal persistence over 72+ hours, seasonal recurrence, and multi-sensor baseline shifts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line/60 text-[10px] font-mono text-slate-500">
              Multi-Pass Clustering
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative p-5 rounded-2xl bg-panel/75 border border-line hover:border-warn/60 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-warn font-bold">04. INFERENCE</span>
                <div className="p-2 rounded-lg bg-warn/10 border border-warn/30 text-warn">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">AI Attribution</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Machine learning model classifies the root cause: Industrial Flare, Vegetation Wildfire, or Agricultural Burn.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line/60 text-[10px] font-mono text-slate-500">
              Confidence: 94.2%
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative p-5 rounded-2xl bg-panel/75 border border-line hover:border-accent/80 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-accent font-bold">05. DECISION</span>
                <div className="p-2 rounded-lg bg-accent/15 border border-accent/40 text-accent">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Risk Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computes population impact radius, hazard zones, and delivers instant actionable response directives.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line/60 text-[10px] font-mono text-slate-500">
              Command Ready
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: LIVE INTELLIGENCE SIMULATION */}
      <section id="intelligence" className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-line/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Technical Highlights */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-danger/10 border border-danger/30 text-danger text-xs font-mono mb-3">
              <Radar className="w-3.5 h-3.5 animate-spin-slow" />
              <span>SATELLITE SENSOR FUSION CONSOLE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Real-Time Tactical Anomaly Intelligence
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              TRACE synthesizes optical, thermal infrared, and spatial data layers to transform noisy raw FIRMS detections into structured risk dossiers.
            </p>

            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-panel/70 border border-line flex items-start gap-3">
                <div className="p-1.5 rounded bg-accent/10 border border-accent/30 text-accent mt-0.5">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-100">FIRMS VIIRS & MODIS TELEMETRY</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Continuous infrared scanning measuring brightness temperatures up to 365°K and high-energy FRP pulses.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-panel/70 border border-line flex items-start gap-3">
                <div className="p-1.5 rounded bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 mt-0.5">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-100">SENTINEL-2 MULTI-SPECTRAL IMAGERY</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    10m optical and short-wave infrared (SWIR) inspection for smoke plume tracking and burn scar identification.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-panel/70 border border-line flex items-start gap-3">
                <div className="p-1.5 rounded bg-warn/10 border border-warn/30 text-warn mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-100">PROXIMITY HAZARD BUFFER</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calculates live proximity to chemical storage tanks, high-voltage substations, and residential zones.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Simulated Live Tactical HUD */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-line-bright bg-panel/90 p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              {/* Top HUD bar */}
              <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger animate-ping" />
                  <span className="font-mono text-xs font-bold text-white tracking-wider">
                    TARGET: HOTSPOT #EV-2026-8819
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-accent">
                  <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30">
                    SECTOR: CHENNAI_ENNORE
                  </span>
                </div>
              </div>

              {/* Tactical Grid Visualization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Visual sensor radar map mock */}
                <div className="relative h-48 rounded-xl bg-ink/90 border border-line p-3 flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 bg-tech-grid opacity-30" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-accent/20 animate-spin-slow" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-danger/30" />

                  {/* Hotspot blip */}
                  <div className="absolute top-[42%] left-[58%] -translate-x-1/2 -translate-y-1/2">
                    <span className="w-3 h-3 rounded-full bg-danger block animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-danger absolute top-0.5 left-0.5 block" />
                  </div>

                  <div className="relative z-10 text-[10px] font-mono text-slate-400">
                    <div>LAT: 13.2089° N | LNG: 80.3241° E</div>
                    <div className="text-slate-500">RADAR SWEEP: 3.2 RPM</div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-warn font-semibold">THERMAL SIGNATURE: 342.6°K</span>
                    <span className="text-accent">FRP: 56.4 MW</span>
                  </div>
                </div>

                {/* AI Attribution Card */}
                <div className="rounded-xl bg-ink/70 border border-line p-3.5 flex flex-col justify-between text-left">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">TRACE ATTRIBUTION INFERENCE</div>
                    <div className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                      <span>INDUSTRIAL / FLARE STACK</span>
                      <span className="px-1.5 py-0.2 rounded bg-accent/20 text-accent text-[10px]">HIGH CONFIDENCE</span>
                    </div>

                    <div className="space-y-2 mt-3 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-0.5">
                          <span>Industrial Classification</span>
                          <span className="text-accent font-bold">94.2%</span>
                        </div>
                        <div className="w-full bg-panel h-1.5 rounded-full overflow-hidden">
                          <div className="bg-accent h-full rounded-full w-[94%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-0.5">
                          <span>Wildfire Probability</span>
                          <span className="text-slate-400">4.1%</span>
                        </div>
                        <div className="w-full bg-panel h-1.5 rounded-full overflow-hidden">
                          <div className="bg-slate-600 h-full rounded-full w-[4%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-line text-[11px] font-mono text-slate-300">
                    <span className="text-slate-500">PROXIMITY: </span>
                    <span className="text-cyan-400">120m Ennore Thermal Substation</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Intelligence Directive */}
              <div className="mt-4 p-3 rounded-xl bg-panel-light/90 border border-accent/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">AUTOMATED COMMAND PROTOCOL</div>
                    <div className="text-[11px] text-slate-400">
                      Standard operational flaring profile. Impact radius nominal (0.5 km). No evacuation required.
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleEnterSystem}
                  className="px-3 py-1.5 rounded bg-accent/20 hover:bg-accent hover:text-ink text-accent text-xs font-mono font-bold transition-colors whitespace-nowrap cursor-pointer"
                >
                  TEST IN COMMAND CENTER →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: WHY TRACE (Core Pillars) */}
      <section id="pillars" className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-line/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OPERATIONAL CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Why TRACE</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Built for disaster response agencies, forest departments, environmental regulators, and industrial safety commanders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Detect */}
          <div className="p-6 rounded-2xl bg-panel/75 border border-line hover:border-danger/60 transition-all text-left">
            <div className="w-12 h-12 rounded-xl bg-danger/10 border border-danger/30 text-danger flex items-center justify-center mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">DETECT</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Continuous sub-kilometer thermal radiometry via polar-orbiting NOAA-20 and Suomi-NPP satellites, capturing nascent hotspots before ground emergency calls.
            </p>
            <ul className="space-y-1.5 text-xs font-mono text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                <span>375-meter high-precision pixel resolution</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                <span>Automated day & night pass ingestion</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Understand */}
          <div className="p-6 rounded-2xl bg-panel/75 border border-line hover:border-accent/60 transition-all text-left">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">UNDERSTAND</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Cross-references infrared blips against OpenStreetMap spatial layers, industrial infrastructure buffers, and Sentinel-2 vegetation indices to attribute causality.
            </p>
            <ul className="space-y-1.5 text-xs font-mono text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Eliminates industrial flaring false alarms</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Multi-year persistence & recurrence scoring</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Act */}
          <div className="p-6 rounded-2xl bg-panel/75 border border-line hover:border-cyan-400/60 transition-all text-left">
            <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">ACT</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Instantly calculates hazard blast radii, potential population exposure, and triggers automated alerts to dispatch ground responders with geo-coordinates.
            </p>
            <ul className="space-y-1.5 text-xs font-mono text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Dynamic 0 to 10 km impact radius modeling</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Direct telemetry export for field units</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION D: FINAL CALL TO ACTION */}
      <section className="relative z-10 py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-panel to-ink border border-accent/40 shadow-[0_0_50px_rgba(62,224,198,0.15)] overflow-hidden">
          {/* Glowing Ambient Halo */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="w-12 h-12 mx-auto rounded-xl bg-panel border border-accent/50 p-2 mb-4 shadow-[0_0_20px_rgba(62,224,198,0.3)]">
              <img src="/trace-logo.png" alt="TRACE Shield" className="w-full h-full object-contain" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Every thermal anomaly has a story.
            </h2>
            <p className="text-xl sm:text-2xl text-accent font-medium mb-6">
              TRACE helps uncover it.
            </p>
            <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
              Access the operational thermal command center to monitor live FIRMS satellite feeds, run AI spatial attribution, and evaluate hazard footprints.
            </p>

            <button
              onClick={handleEnterSystem}
              className="px-8 py-4 rounded-xl bg-accent text-ink font-mono text-sm font-bold inline-flex items-center gap-3 hover:bg-accent/90 shadow-[0_0_35px_rgba(62,224,198,0.45)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>ENTER TRACE SYSTEM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Earth Observation Mission Footer */}
      <footer className="relative z-10 border-t border-line/80 bg-ink/90 px-4 sm:px-6 py-8 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-panel border border-line p-0.5">
              <img src="/trace-logo.png" alt="TRACE" className="w-full h-full object-contain" />
            </div>
            <span>TRACE: Thermal Risk Attribution & Classification Engine</span>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-400">
            Compliant with NASA FIRMS LANCE & ISRO Earth Observation Geodetic Protocols
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4 text-[10px] text-slate-500 text-center">
          TRACE provides contextual intelligence for thermal anomalies. It does not confirm cause, exact fire location, or damage. Ground verification required.
        </div>
      </footer>
    </div>
  );
}

