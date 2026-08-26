import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import {
  Flame,
  Satellite,
  Layers,
  Cpu,
  ShieldCheck,
  ChevronRight,
  Globe,
  Radio,
  ArrowRight,
  Crosshair,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession, PRESET_REGIONS } from "../../context/SessionContext";

interface StoryScene {
  step: number;
  badge: string;
  title: string;
  question: string;
  answer: string;
  details: string;
  telemetry: string;
  color: string;
  icon: typeof Flame;
}

const STORY_SCENES: StoryScene[] = [
  {
    step: 1,
    badge: "SCENE 1: ORBITAL DETECTION",
    title: "NASA FIRMS Intercepts Infrared Anomaly",
    question: "We see something hot on Earth. What is it?",
    answer: "375m VIIRS sensor detects 342.6°K brightness temperature with 56.4 MW Fire Radiative Power.",
    details: "Polar-orbiting NOAA-20/Suomi-NPP satellites downlinked infrared radiance telemetry over coastal Tamil Nadu.",
    telemetry: "FRP: 56.4 MW | BRIGHTNESS: 342.6°K | SENSOR: VNP14IMGTDL",
    color: "#ff6b4a",
    icon: Flame,
  },
  {
    step: 2,
    badge: "SCENE 2: GEOSPATIAL FUSION",
    title: "Sentinel-2 & OpenStreetMap Alignment",
    question: "Where exactly is this thermal source located?",
    answer: "Proximity cross-referencing places anomaly within 120m of Ennore Thermal Power Station.",
    details: "Multi-spectral Sentinel-2 SWIR band confirms flare stack footprint; OSM data rules out residential forest cover.",
    telemetry: "ZONING: INDUSTRIAL (SIPCOT) | DISTANCE TO SUBSTATION: 120m | NDBI: +0.48",
    color: "#3ee0c6",
    icon: Layers,
  },
  {
    step: 3,
    badge: "SCENE 3: AI ATTRIBUTION",
    title: "Ensemble Classifier Resolves Causality",
    question: "Is this a hazardous wildfire or routine flaring?",
    answer: "TRACE AI attributes the anomaly to Industrial Flare Stack (94.2% Confidence).",
    details: "Temporal persistence scoring confirms recurring 72hr industrial operational cycle, eliminating false wildfire alarms.",
    telemetry: "PREDICTION: INDUSTRIAL FLARE (94.2%) | WILDFIRE RISK: 4.1% | RECURRENCE: 86 hrs",
    color: "#f4b942",
    icon: Cpu,
  },
  {
    step: 4,
    badge: "SCENE 4: ACTION READY",
    title: "Hazard Blast Modeling & Protocol Clearance",
    question: "What action is required by commanders?",
    answer: "No ground evacuation required. Routine industrial emission logged; impact radius safe (< 0.5 km).",
    details: "Automated report delivered to state pollution board and disaster emergency dashboard with geo-tagged verification.",
    telemetry: "STATUS: NOMINAL | BLAST RADIUS: 0.5 KM | ACTION PROTOCOL: LEVEL 1 LOGGED",
    color: "#22d3ee",
    icon: ShieldCheck,
  },
];

interface GlobeHotspot {
  name: string;
  lat: number;
  lng: number;
  type: "industrial" | "wildfire" | "crop";
  frp: string;
  city: string;
}

const GLOBE_HOTSPOTS: GlobeHotspot[] = [
  { name: "Ennore Thermal Station", lat: 13.2089, lng: 80.3241, type: "industrial", frp: "56.4 MW", city: "Chennai, India" },
  { name: "Neyveli Lignite Complex", lat: 11.5996, lng: 79.4862, type: "industrial", frp: "42.1 MW", city: "Cuddalore, India" },
  { name: "Western Ghats Anomaly", lat: 10.8505, lng: 76.2711, type: "wildfire", frp: "24.8 MW", city: "Kerala/TN Border" },
  { name: "Singrauli Super Thermal", lat: 24.2009, lng: 82.6681, type: "industrial", frp: "68.2 MW", city: "MP/UP Border" },
  { name: "Punjab Stubble Harvest", lat: 31.1471, lng: 75.3412, type: "crop", frp: "38.5 MW", city: "Ludhiana, India" },
  { name: "Amazon Basin Sector", lat: -3.4653, lng: -62.2159, type: "wildfire", frp: "84.1 MW", city: "Amazonas, Brazil" },
  { name: "Pilbara Mining Smelter", lat: -21.1687, lng: 119.7422, type: "industrial", frp: "46.3 MW", city: "Western Australia" },
  { name: "California Sierra Fire", lat: 37.8651, lng: -119.5383, type: "wildfire", frp: "72.0 MW", city: "California, USA" },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function EarthObservatory() {
  const navigate = useNavigate();
  const { setRegion } = useSession();
  const [activeStep, setActiveStep] = useState(1);
  const [targetSector, setTargetSector] = useState<"chennai" | "india" | "global">("chennai");
  const [hoveredSpot, setHoveredSpot] = useState<GlobeHotspot | null>(GLOBE_HOTSPOTS[0]);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const globeSceneRef = useRef<{
    targetRotX: number;
    targetRotY: number;
    globeGroup: THREE.Group;
    satellites: { mesh: THREE.Group; speed: number; angle: number; radius: number }[];
  } | null>(null);

  // Initialize Three.js Earth Globe Scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner Dark Blue Earth Sphere
    const earthRadius = 1.0;
    const sphereGeom = new THREE.SphereGeometry(earthRadius, 48, 48);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x061524,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x030b14,
    });
    const earthSphere = new THREE.Mesh(sphereGeom, sphereMat);
    globeGroup.add(earthSphere);

    // Atmospheric Glow Halo
    const atmoGeom = new THREE.SphereGeometry(earthRadius * 1.04, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x3ee0c6,
      transparent: true,
      opacity: 0.14,
      wireframe: true,
    });
    const atmoMesh = new THREE.Mesh(atmoGeom, atmoMat);
    globeGroup.add(atmoMesh);

    // Latitude & Longitude Coordinate Wireframe
    const gridGeom = new THREE.SphereGeometry(earthRadius * 1.006, 24, 24);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x1b3a4b,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const gridMesh = new THREE.Mesh(gridGeom, gridMat);
    globeGroup.add(gridMesh);

    // Continental Point Cloud (India, Asia, Europe, Americas representation)
    const pointsGeom = new THREE.BufferGeometry();
    const pointCount = 900;
    const positions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = earthRadius * 1.008;

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }
    pointsGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pointMat = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: 0.018,
      transparent: true,
      opacity: 0.6,
    });
    const landPoints = new THREE.Points(pointsGeom, pointMat);
    globeGroup.add(landPoints);

    // Hotspot Pulsing Pins
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    GLOBE_HOTSPOTS.forEach((spot) => {
      const pos = latLngToVector3(spot.lat, spot.lng, earthRadius * 1.015);

      // Core Hotspot
      const pinGeom = new THREE.SphereGeometry(0.024, 12, 12);
      const pinMat = new THREE.MeshBasicMaterial({
        color: spot.type === "industrial" ? 0xff6b4a : spot.type === "wildfire" ? 0xff4500 : 0xf4b942,
      });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.copy(pos);
      pinGroup.add(pinMesh);

      // Radial Ring
      const ringGeom = new THREE.RingGeometry(0.03, 0.045, 20);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spot.type === "industrial" ? 0xff6b4a : 0x3ee0c6,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      pinGroup.add(ring);
    });

    // Orbital Satellites (NOAA-20 & Sentinel-2)
    const satellites: { mesh: THREE.Group; speed: number; angle: number; radius: number }[] = [];

    // Satellite 1: NOAA-20 VIIRS
    const sat1 = new THREE.Group();
    const sat1Body = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.04, 0.06),
      new THREE.MeshBasicMaterial({ color: 0x3ee0c6 })
    );
    const sat1Panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.01, 0.03),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee })
    );
    sat1.add(sat1Body);
    sat1.add(sat1Panel);
    globeGroup.add(sat1);
    satellites.push({ mesh: sat1, speed: 0.008, angle: 0.4, radius: earthRadius * 1.35 });

    // Satellite 2: Sentinel-2A
    const sat2 = new THREE.Group();
    const sat2Body = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.04, 0.06),
      new THREE.MeshBasicMaterial({ color: 0xf4b942 })
    );
    const sat2Panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.01, 0.03),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    sat2.add(sat2Body);
    sat2.add(sat2Panel);
    globeGroup.add(sat2);
    satellites.push({ mesh: sat2, speed: -0.006, angle: 2.5, radius: earthRadius * 1.48 });

    // Orbital path rings
    [1.35, 1.48].forEach((r, idx) => {
      const orbitRingGeom = new THREE.RingGeometry(r, r + 0.008, 64);
      const orbitRingMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0x3ee0c6 : 0xf4b942,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      });
      const orbitRing = new THREE.Mesh(orbitRingGeom, orbitRingMat);
      orbitRing.rotation.x = Math.PI / 2.2 + idx * 0.2;
      globeGroup.add(orbitRing);
    });

    globeSceneRef.current = {
      targetRotX: 0.22,
      targetRotY: -Math.PI * 0.44, // Initial focus on India/Chennai
      globeGroup,
      satellites,
    };

    // Mouse Drag Rotation
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !globeSceneRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      globeSceneRef.current.targetRotY += deltaX * 0.006;
      globeSceneRef.current.targetRotX += deltaY * 0.006;
      globeSceneRef.current.targetRotX = Math.max(-1.1, Math.min(1.1, globeSceneRef.current.targetRotX));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (globeSceneRef.current) {
        const { globeGroup, satellites } = globeSceneRef.current;

        // Smooth rotation interpolation
        globeGroup.rotation.y += (globeSceneRef.current.targetRotY - globeGroup.rotation.y) * 0.08;
        globeGroup.rotation.x += (globeSceneRef.current.targetRotX - globeGroup.rotation.x) * 0.08;

        // Animate satellites
        satellites.forEach((sat) => {
          sat.angle += sat.speed;
          sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
          sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
          sat.mesh.position.y = Math.sin(sat.angle * 2) * 0.3;
          sat.mesh.rotation.y = sat.angle + Math.PI / 2;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      mount.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update target rotation when targetSector changes
  useEffect(() => {
    if (!globeSceneRef.current) return;
    if (targetSector === "chennai") {
      globeSceneRef.current.targetRotY = -Math.PI * 0.44;
      globeSceneRef.current.targetRotX = 0.22;
      setHoveredSpot(GLOBE_HOTSPOTS[0]);
    } else if (targetSector === "india") {
      globeSceneRef.current.targetRotY = -Math.PI * 0.42;
      globeSceneRef.current.targetRotX = 0.34;
      setHoveredSpot(GLOBE_HOTSPOTS[3]);
    } else {
      globeSceneRef.current.targetRotX = 0.15;
      globeSceneRef.current.targetRotY = 0.0;
      setHoveredSpot(GLOBE_HOTSPOTS[5]);
    }
  }, [targetSector]);

  const handleLaunchSector = (sector: "chennai" | "india" | "global") => {
    setRegion(PRESET_REGIONS[sector]);
    navigate("/dashboard");
  };

  const currentScene = STORY_SCENES[activeStep - 1];
  const SceneIcon = currentScene.icon;

  return (
    <div className="relative w-full max-w-7xl mx-auto py-12 px-4 sm:px-6">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span>TRACE EARTHWATCH OBSERVATORY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          We See Something Hot on Earth. <br />
          <span className="text-accent font-medium">Is It Dangerous? TRACE Answers.</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          From infrared orbital detections to AI attribution and actionable mitigation.
        </p>
      </div>

      {/* Main Grid: Interactive 3D Earthwatch Globe & Storytelling Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3D Earthwatch Interactive Globe (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-panel/80 border border-line-bright p-5 backdrop-blur-2xl shadow-2xl relative flex flex-col items-center">
          {/* Top Bar on Globe Card */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
              <Crosshair className="w-4 h-4 text-accent" />
              <span className="font-bold">LIVE THERMAL OBSERVATORY</span>
            </div>

            {/* Quick Sector Zoom Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-ink/70 border border-line text-xs font-mono">
              <button
                onClick={() => setTargetSector("chennai")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  targetSector === "chennai"
                    ? "bg-accent text-ink font-bold shadow-[0_0_12px_rgba(62,224,198,0.3)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                CHENNAI (LIVE)
              </button>
              <button
                onClick={() => setTargetSector("india")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  targetSector === "india"
                    ? "bg-accent text-ink font-bold shadow-[0_0_12px_rgba(62,224,198,0.3)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                INDIA
              </button>
              <button
                onClick={() => setTargetSector("global")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  targetSector === "global"
                    ? "bg-accent text-ink font-bold shadow-[0_0_12px_rgba(62,224,198,0.3)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                GLOBAL
              </button>
            </div>
          </div>

          {/* 3D WebGL Canvas */}
          <div className="relative w-full h-[360px] sm:h-[420px] flex items-center justify-center cursor-grab active:cursor-grabbing">
            <div ref={mountRef} className="w-full h-full" />

            {/* Live Orbit Badge */}
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-ink/80 border border-line text-[10px] font-mono text-slate-300 backdrop-blur-md pointer-events-none">
              <div className="flex items-center gap-1.5 text-accent">
                <Satellite className="w-3 h-3 animate-spin-slow" />
                <span>NOAA-20 / SENTINEL-2 ORBITS</span>
              </div>
            </div>

            {/* Selected Hotspot Target Card */}
            {hoveredSpot && (
              <div className="absolute bottom-2 left-2 right-2 sm:right-auto sm:max-w-xs p-3 rounded-xl bg-panel/90 border border-accent/40 text-left text-xs font-mono backdrop-blur-xl shadow-lg pointer-events-none">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span className="flex items-center gap-1 text-danger">
                    <span className="w-2 h-2 rounded-full bg-danger animate-ping" />
                    HOTSPOT INTERCEPT
                  </span>
                  <span>{hoveredSpot.frp}</span>
                </div>
                <div className="font-bold text-white text-sm">{hoveredSpot.name}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">{hoveredSpot.city}</div>
                <div className="mt-2 pt-1.5 border-t border-line flex items-center justify-between text-[10px] text-accent">
                  <span>LAT: {hoveredSpot.lat}° N</span>
                  <span>LNG: {hoveredSpot.lng}° E</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="w-full mt-2 pt-2.5 border-t border-line/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>EARTH OBSERVATION TELEMETRY: ACTIVE</span>
            </div>
            <button
              onClick={() => handleLaunchSector(targetSector)}
              className="text-accent hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>Launch {targetSector.toUpperCase()} Sector In Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: 4-Step Thermal Intelligence Story Console (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 text-left">
          {/* Step Selector Buttons */}
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-panel/90 border border-line">
            {STORY_SCENES.map((scene) => (
              <button
                key={scene.step}
                onClick={() => setActiveStep(scene.step)}
                className={`py-2 px-1 rounded-lg text-center font-mono text-xs font-bold transition-all cursor-pointer ${
                  activeStep === scene.step
                    ? "bg-accent text-ink shadow-[0_0_15px_rgba(62,224,198,0.35)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                0{scene.step}. {scene.step === 1 ? "DETECT" : scene.step === 2 ? "CONTEXT" : scene.step === 3 ? "ATTRIBUTION" : "ACTION"}
              </button>
            ))}
          </div>

          {/* Active Story Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="p-5 rounded-2xl bg-panel/90 border border-line-bright backdrop-blur-xl shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${currentScene.color}20`, border: `1px solid ${currentScene.color}40` }}
                  >
                    <SceneIcon className="w-5 h-5" style={{ color: currentScene.color }} />
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-mono font-bold tracking-wider"
                      style={{ color: currentScene.color }}
                    >
                      {currentScene.badge}
                    </span>
                    <h3 className="text-base font-bold text-white">{currentScene.title}</h3>
                  </div>
                </div>
              </div>

              {/* The Core Question & Answer */}
              <div className="p-3.5 rounded-xl bg-ink/70 border border-line space-y-1.5">
                <div className="text-xs font-mono text-slate-400 uppercase">THE CRITICAL QUESTION</div>
                <div className="text-sm font-semibold text-white">"{currentScene.question}"</div>
                <div className="text-xs text-accent font-mono pt-1">
                  TRACE: {currentScene.answer}
                </div>
              </div>

              {/* Deep Details */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentScene.details}
              </p>

              {/* Live Telemetry Bar */}
              <div className="p-2.5 rounded-lg bg-panel-light/90 border border-line text-[11px] font-mono flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Radio className="w-3.5 h-3.5 text-accent" />
                  <span>TELEMETRY:</span>
                </div>
                <span className="text-accent font-semibold truncate max-w-[240px]">
                  {currentScene.telemetry}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Direct Flow CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (activeStep < 4) {
                  setActiveStep((prev) => prev + 1);
                } else {
                  navigate("/access");
                }
              }}
              className="flex-1 py-3 rounded-xl bg-accent text-ink font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-accent/90 shadow-[0_0_20px_rgba(62,224,198,0.3)] transition-all cursor-pointer"
            >
              <span>{activeStep === 4 ? "ENTER FULL PLATFORM" : "NEXT STORY SCENE"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate("/access")}
              className="py-3 px-4 rounded-xl bg-panel/80 hover:bg-panel border border-line text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              SKIP TO ACCESS →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
