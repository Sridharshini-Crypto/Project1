import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import {
  Flame,
  Layers,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Activity,
  Radar,
  RotateCcw,
  Sparkles,
  Maximize2,
} from "lucide-react";

interface LayerDetail {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  color: string;
  icon: typeof Flame;
  desc: string;
  telemetry: string;
}

const PIPELINE_LAYERS: LayerDetail[] = [
  {
    id: "detection",
    name: "01. DETECTION",
    subtitle: "Thermal Radiometry Capture",
    badge: "VIIRS / MODIS / NASA FIRMS",
    color: "#ff6b4a",
    icon: Flame,
    desc: "375m spatial resolution orbital radiometry scanning active brightness temperatures and Fire Radiative Power (FRP).",
    telemetry: "FRP: 42.8 MW | SENSOR: VNP14IMGTDL | CONFIDENCE: 98%",
  },
  {
    id: "context",
    name: "02. CONTEXT",
    subtitle: "Multi-Modal Geospatial Fusion",
    badge: "OSM + SENTINEL-2 L2A",
    color: "#3ee0c6",
    icon: Layers,
    desc: "Instant spatial alignment with industrial zoning, chemical perimeters, power substations, and agricultural boundaries.",
    telemetry: "PROXIMITY: 140m Substation | NDBI: 0.42 | ZONING: Industrial (SIPCOT)",
  },
  {
    id: "attribution",
    name: "03. ATTRIBUTION",
    subtitle: "AI Spatial Classification",
    badge: "ENSEMBLE AI CLASSIFIER",
    color: "#f4b942",
    icon: Cpu,
    desc: "Machine learning classifier attributes root-cause signature: Industrial Flare vs Vegetation Fire vs Crop Residue.",
    telemetry: "PREDICTION: INDUSTRIAL (94.2%) | TEMPORAL PERSISTENCE: 86 hrs",
  },
  {
    id: "risk",
    name: "04. RISK",
    subtitle: "Impact Assessment & Response",
    badge: "AUTOMATED PROTOCOL",
    color: "#22d3ee",
    icon: ShieldCheck,
    desc: "Dynamic blast and plume radius modeling with automated hazard alerts for first responders and command centers.",
    telemetry: "RISK LEVEL: ELEVATED | CRITICAL RADIUS: 1.5 KM | ACTION: LEVEL 2 NOTIFY",
  },
];

// Helper to create a 3D shield geometry
function createShieldShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Shield contour
  shape.moveTo(0, 1.35);
  shape.lineTo(0.95, 1.15);
  shape.quadraticCurveTo(1.05, 0.2, 0.85, -0.4);
  shape.quadraticCurveTo(0.65, -1.0, 0, -1.45);
  shape.quadraticCurveTo(-0.65, -1.0, -0.85, -0.4);
  shape.quadraticCurveTo(-1.05, 0.2, -0.95, 1.15);
  shape.lineTo(0, 1.35);
  return shape;
}

export function TraceLogo3D() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [isExploded, setIsExploded] = useState(false);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneStateRef = useRef<{
    targetRotX: number;
    targetRotY: number;
    modelGroup: THREE.Group;
    layerMeshes: THREE.Object3D[];
    rings: THREE.Mesh[];
    waveRings: THREE.Mesh[];
  } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x3ee0c6, 3.5, 12);
    pointLightCyan.position.set(3, 3, 3);
    scene.add(pointLightCyan);

    const pointLightAmber = new THREE.PointLight(0xff6b4a, 3.0, 12);
    pointLightAmber.position.set(-3, -2, 2);
    scene.add(pointLightAmber);

    const frontDirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    frontDirLight.position.set(0, 2, 4);
    scene.add(frontDirLight);

    // 3. Main Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Layer Groups for Exploded 3D Decomposition
    const layer0Detection = new THREE.Group(); // Front: Thermal Grid & Sensors
    const layer1Context = new THREE.Group();   // Earth Globe & Infrastructure
    const layer2Attribution = new THREE.Group(); // Shield Face & AI Core
    const layer3Risk = new THREE.Group();      // Back Shield Base & Radar Ring

    modelGroup.add(layer3Risk);
    modelGroup.add(layer2Attribution);
    modelGroup.add(layer1Context);
    modelGroup.add(layer0Detection);

    const layerMeshes = [layer0Detection, layer1Context, layer2Attribution, layer3Risk];

    // --- A. 3D SHIELD BASE (Layer 3 & 2) ---
    const shieldShape = createShieldShape();
    const extrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeometry.center();

    // Dark Navy Metallic Material for Back Shield
    const shieldBackMaterial = new THREE.MeshStandardMaterial({
      color: 0x081726,
      metalness: 0.85,
      roughness: 0.25,
    });
    const shieldBackMesh = new THREE.Mesh(shieldGeometry, shieldBackMaterial);
    layer3Risk.add(shieldBackMesh);

    // Glowing Neon Edge Wireframe for Shield
    const edgeGeometry = new THREE.EdgesGeometry(shieldGeometry, 24);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x3ee0c6,
      linewidth: 2,
    });
    const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    layer3Risk.add(edgeLines);

    // --- B. 3D LOGO TEXTURE HOLOGRAPHIC DISC (Layer 2) ---
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/trace-logo.png", (tex) => {
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      const discGeom = new THREE.PlaneGeometry(2.1, 2.3);
      const discMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.96,
        side: THREE.DoubleSide,
      });
      const discMesh = new THREE.Mesh(discGeom, discMat);
      discMesh.position.z = 0.08;
      layer2Attribution.add(discMesh);
    });

    // --- C. 3D EARTH WIREFRAME HEMISPHERE & SATELLITE DISH (Layer 1) ---
    // Earth hemisphere
    const earthRadius = 0.68;
    const earthGeom = new THREE.SphereGeometry(earthRadius, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0b253a,
      wireframe: true,
      emissive: 0x1b3a4b,
      emissiveIntensity: 0.5,
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    earthMesh.rotation.x = Math.PI * 0.95;
    earthMesh.position.set(0, -0.42, 0.1);
    layer1Context.add(earthMesh);

    // 3D Parabolic Satellite Dish
    const dishGeom = new THREE.ConeGeometry(0.36, 0.15, 24, 1, true);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      metalness: 0.9,
      roughness: 0.2,
      side: THREE.DoubleSide,
    });
    const dishMesh = new THREE.Mesh(dishGeom, dishMat);
    dishMesh.position.set(0, 0.42, 0.25);
    dishMesh.rotation.x = -Math.PI * 0.35;
    dishMesh.rotation.z = Math.PI * 0.1;
    layer1Context.add(dishMesh);

    // Dish Antenna Feed Horn
    const hornGeom = new THREE.CylinderGeometry(0.02, 0.03, 0.22, 12);
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 });
    const hornMesh = new THREE.Mesh(hornGeom, hornMat);
    hornMesh.position.set(0, 0.52, 0.36);
    hornMesh.rotation.x = -Math.PI * 0.35;
    layer1Context.add(hornMesh);

    // Radio Wave Rings expanding from dish
    const waveRings: THREE.Mesh[] = [];
    [0.15, 0.28, 0.42].forEach((radius, i) => {
      const ringGeom = new THREE.RingGeometry(radius, radius + 0.025, 32, 1, 0, Math.PI * 0.9);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x3ee0c6,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7 - i * 0.2,
      });
      const wave = new THREE.Mesh(ringGeom, ringMat);
      wave.position.set(0, 0.65 + i * 0.12, 0.38);
      wave.rotation.x = -Math.PI * 0.35;
      wave.rotation.z = Math.PI * 0.05;
      layer1Context.add(wave);
      waveRings.push(wave);
    });

    // --- D. 3D THERMAL HOTSPOT NODES & SENSORS (Layer 0) ---
    // Glowing thermal pixel grid on bottom left
    const hotspotGroup = new THREE.Group();
    const thermalPixelGeom = new THREE.BoxGeometry(0.08, 0.08, 0.03);
    const thermalPixelMat = new THREE.MeshStandardMaterial({
      color: 0xff6b4a,
      emissive: 0xff4500,
      emissiveIntensity: 1.2,
    });
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const pixel = new THREE.Mesh(thermalPixelGeom, thermalPixelMat);
        pixel.position.set(-0.35 + c * 0.09, -0.45 + r * 0.09, 0.22);
        hotspotGroup.add(pixel);
      }
    }
    layer0Detection.add(hotspotGroup);

    // Green Network nodes on bottom right (Vegetation / OSM)
    const greenNodeGroup = new THREE.Group();
    const greenNodeGeom = new THREE.SphereGeometry(0.035, 12, 12);
    const greenNodeMat = new THREE.MeshStandardMaterial({
      color: 0x3ee0c6,
      emissive: 0x10b981,
      emissiveIntensity: 1.0,
    });
    const nodeCoords = [
      [-0.05, -0.4, 0.24],
      [0.18, -0.32, 0.23],
      [0.32, -0.42, 0.24],
      [0.22, -0.58, 0.22],
    ];
    nodeCoords.forEach(([x, y, z]) => {
      const node = new THREE.Mesh(greenNodeGeom, greenNodeMat);
      node.position.set(x, y, z);
      greenNodeGroup.add(node);
    });
    layer0Detection.add(greenNodeGroup);

    // --- E. 3D GYROSCOPE ORBITAL RINGS ---
    const rings: THREE.Mesh[] = [];
    const gyroGeom1 = new THREE.TorusGeometry(1.8, 0.012, 12, 64);
    const gyroMat1 = new THREE.MeshBasicMaterial({
      color: 0x3ee0c6,
      transparent: true,
      opacity: 0.45,
    });
    const gyro1 = new THREE.Mesh(gyroGeom1, gyroMat1);
    gyro1.rotation.x = Math.PI * 0.35;
    scene.add(gyro1);
    rings.push(gyro1);

    const gyroGeom2 = new THREE.TorusGeometry(2.1, 0.008, 12, 64);
    const gyroMat2 = new THREE.MeshBasicMaterial({
      color: 0xff6b4a,
      transparent: true,
      opacity: 0.35,
    });
    const gyro2 = new THREE.Mesh(gyroGeom2, gyroMat2);
    gyro2.rotation.y = Math.PI * 0.25;
    gyro2.rotation.x = -Math.PI * 0.2;
    scene.add(gyro2);
    rings.push(gyro2);

    sceneStateRef.current = {
      targetRotX: 0,
      targetRotY: 0,
      modelGroup,
      layerMeshes,
      rings,
      waveRings,
    };

    // --- 4. User Mouse Drag Controls ---
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sceneStateRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      sceneStateRef.current.targetRotY += deltaX * 0.008;
      sceneStateRef.current.targetRotX += deltaY * 0.008;

      // Limit vertical tilt
      sceneStateRef.current.targetRotX = Math.max(-0.6, Math.min(0.6, sceneStateRef.current.targetRotX));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // --- 5. Animation Render Loop ---
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (sceneStateRef.current) {
        const { modelGroup, rings, waveRings } = sceneStateRef.current;

        // Auto gentle breathing tilt when not dragging
        if (!isDragging) {
          modelGroup.rotation.y += (sceneStateRef.current.targetRotY + Math.sin(elapsed * 0.8) * 0.08 - modelGroup.rotation.y) * 0.06;
          modelGroup.rotation.x += (sceneStateRef.current.targetRotX + Math.cos(elapsed * 0.6) * 0.04 - modelGroup.rotation.x) * 0.06;
        } else {
          modelGroup.rotation.y += (sceneStateRef.current.targetRotY - modelGroup.rotation.y) * 0.1;
          modelGroup.rotation.x += (sceneStateRef.current.targetRotX - modelGroup.rotation.x) * 0.1;
        }

        // Gyroscope rotation
        rings[0].rotation.z += 0.004;
        rings[1].rotation.z -= 0.003;

        // Radio wave pulsing
        waveRings.forEach((wave, idx) => {
          const s = 1.0 + 0.1 * Math.sin(elapsed * 4 + idx * 0.8);
          wave.scale.set(s, s, s);
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

  // Update 3D Layer Separation (Z-Offset Explosion) when isExploded or activeLayer changes
  useEffect(() => {
    if (!sceneStateRef.current) return;
    const { layerMeshes } = sceneStateRef.current;

    // layerMeshes: [0: Detection, 1: Context, 2: Attribution, 3: Risk]
    if (isExploded) {
      // Physically separate along Z-axis in 3D WebGL space!
      layerMeshes[0].position.z = 0.75; // Detection front
      layerMeshes[1].position.z = 0.25; // Context
      layerMeshes[2].position.z = -0.25; // Attribution
      layerMeshes[3].position.z = -0.75; // Risk back

      // If a specific layer is chosen, accentuate it
      if (activeLayer !== null) {
        layerMeshes.forEach((mesh, idx) => {
          mesh.scale.setScalar(idx === activeLayer ? 1.1 : 0.9);
        });
      } else {
        layerMeshes.forEach((mesh) => mesh.scale.setScalar(1.0));
      }
    } else {
      // Re-collapse 3D model into unified core
      layerMeshes[0].position.z = 0.08;
      layerMeshes[1].position.z = 0.04;
      layerMeshes[2].position.z = 0;
      layerMeshes[3].position.z = -0.04;
      layerMeshes.forEach((mesh) => mesh.scale.setScalar(1.0));
    }
  }, [isExploded, activeLayer]);

  const handleResetRotation = () => {
    if (sceneStateRef.current) {
      sceneStateRef.current.targetRotX = 0;
      sceneStateRef.current.targetRotY = 0;
    }
  };

  const toggleExplosion = () => {
    setIsExploded((prev) => !prev);
    if (!isExploded && activeLayer === null) {
      setActiveLayer(0);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-4 w-full max-w-4xl mx-auto select-none">
      {/* Background Holographic Halo */}
      <div className="absolute w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-accent/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute w-72 h-72 rounded-full bg-danger/10 blur-2xl pointer-events-none -z-10 animate-pulse-slow" />

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full h-[380px] sm:h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating 3D HUD Badges */}
        <div className="absolute top-2 left-4 px-3 py-1.5 rounded-xl bg-panel/85 border border-line-bright text-[11px] font-mono text-slate-300 backdrop-blur-md pointer-events-none shadow-lg">
          <div className="flex items-center gap-1.5 text-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span className="font-bold">TRACE 3D ENGINE CORE</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            DRAG TO ROTATE 3D PERSPECTIVE
          </div>
        </div>

        {/* Controls Overlay (Reset View & Deconstruct) */}
        <div className="absolute top-2 right-4 flex items-center gap-2">
          <button
            onClick={handleResetRotation}
            className="p-2 rounded-xl bg-panel/85 border border-line hover:border-accent text-slate-400 hover:text-accent transition-all cursor-pointer backdrop-blur-md"
            title="Reset 3D Orientation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleExplosion}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md shadow-lg ${
              isExploded
                ? "bg-accent text-ink border-accent shadow-[0_0_20px_rgba(62,224,198,0.4)]"
                : "bg-panel/85 border-line-bright hover:border-accent text-slate-200"
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{isExploded ? "COLLAPSE 3D CORE" : "DECONSTRUCT 3D PIPELINE"}</span>
          </button>
        </div>

        {/* Mode Status Pill at Bottom */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-ink/80 border border-line text-[11px] font-mono text-slate-300 backdrop-blur-md pointer-events-none">
          <Sparkles className="w-3 h-3 text-accent" />
          <span>
            {isExploded
              ? "3D EXPLODED LAYER VIEW ACTIVE"
              : "INTERACTIVE 3D WEBGL MODEL"}
          </span>
        </div>
      </div>

      {/* Layer Decomposition Strip / Pipeline Stages */}
      <div className="w-full mt-4 px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400">
            <Activity className="w-3.5 h-3.5 text-accent" />
            <span>SELECT 3D LAYER ARCHITECTURE</span>
          </div>
          <button
            onClick={toggleExplosion}
            className="text-xs font-mono text-accent hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isExploded ? "Collapse All Layers" : "Explode All 4 Layers"}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExploded ? "rotate-90" : ""}`} />
          </button>
        </div>

        {/* 4 Layer Interactive Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {PIPELINE_LAYERS.map((layer, index) => {
            const Icon = layer.icon;
            const isSelected = activeLayer === index && isExploded;
            return (
              <motion.button
                key={layer.id}
                onClick={() => {
                  setIsExploded(true);
                  setActiveLayer(isSelected ? null : index);
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-panel-light border-accent shadow-[0_0_18px_rgba(62,224,198,0.25)] ring-1 ring-accent"
                    : "bg-panel/70 border-line hover:border-line-bright hover:bg-panel"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span
                    className="text-[10px] font-mono font-bold uppercase tracking-wider"
                    style={{ color: layer.color }}
                  >
                    {layer.name}
                  </span>
                  <Icon className="w-4 h-4" style={{ color: layer.color }} />
                </div>
                <div className="text-xs font-semibold text-slate-100 truncate">{layer.subtitle}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">{layer.badge}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Layer Deep-Dive Info Box */}
        <AnimatePresence>
          {isExploded && activeLayer !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mt-3 overflow-hidden"
            >
              {(() => {
                const layer = PIPELINE_LAYERS[activeLayer];
                const Icon = layer.icon;
                return (
                  <div className="p-4 rounded-xl bg-panel/90 border border-line-bright backdrop-blur-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-line pb-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${layer.color}20`, border: `1px solid ${layer.color}40` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: layer.color }} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                            <span>{layer.name}: {layer.subtitle}</span>
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                              style={{ backgroundColor: `${layer.color}25`, color: layer.color }}
                            >
                              {layer.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">{layer.desc}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono bg-ink/60 px-3 py-2 rounded-lg border border-line">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Radar className="w-3.5 h-3.5 text-accent animate-spin-slow" />
                        <span>3D LAYER TELEMETRY:</span>
                      </div>
                      <span className="text-accent font-semibold">{layer.telemetry}</span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
