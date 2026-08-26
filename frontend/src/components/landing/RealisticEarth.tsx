import { useEffect, useRef } from "react";
import * as THREE from "three";

// Helper to generate a procedural Earth-at-night texture with glowing city lights (India/Asia cluster)
function createEarthNightCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Deep ocean background
  ctx.fillStyle = "#030813";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Continental landmass silhouettes
  ctx.fillStyle = "#071728";
  
  // Approximate continent landmass shapes
  // Eurasia & India
  ctx.beginPath();
  ctx.ellipse(1400, 360, 380, 200, 0, 0, Math.PI * 2);
  ctx.fill();

  // India subcontinent distinct shape
  ctx.beginPath();
  ctx.moveTo(1420, 380);
  ctx.lineTo(1510, 420);
  ctx.lineTo(1460, 560); // South tip (Kanyakumari)
  ctx.lineTo(1390, 460);
  ctx.closePath();
  ctx.fillStyle = "#091f36";
  ctx.fill();

  // Africa
  ctx.beginPath();
  ctx.ellipse(1120, 520, 200, 260, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Americas
  ctx.beginPath();
  ctx.ellipse(540, 340, 220, 180, -0.3, 0, Math.PI * 2);
  ctx.ellipse(640, 640, 160, 240, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Australia
  ctx.beginPath();
  ctx.ellipse(1720, 700, 140, 100, 0, 0, Math.PI * 2);
  ctx.fill();

  // Glowing golden/amber city lights (high density in India, East Asia, Europe, North America)
  const drawCityCluster = (cx: number, cy: number, radius: number, count: number, intensity = 1) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 0.6) * radius;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      const size = Math.random() * 2.2 + 0.6;
      const alpha = (Math.random() * 0.7 + 0.3) * intensity;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
      grad.addColorStop(0, `rgba(255, 215, 130, ${alpha})`);
      grad.addColorStop(0.3, `rgba(255, 160, 50, ${alpha * 0.7})`);
      grad.addColorStop(1, "rgba(255, 120, 20, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // High-intensity golden city illumination clusters
  // 1. India (Major Metros & Indo-Gangetic Plain: Delhi, Mumbai, Chennai, Kolkata, Bangalore)
  drawCityCluster(1440, 440, 65, 450, 1.3);
  drawCityCluster(1460, 520, 35, 200, 1.4); // Chennai / Tamil Nadu cluster
  drawCityCluster(1410, 480, 30, 220, 1.4); // Mumbai / West Coast
  drawCityCluster(1450, 400, 45, 300, 1.5); // Delhi NCR corridor

  // 2. East Asia (Tokyo, Shanghai, Seoul, Singapore)
  drawCityCluster(1660, 370, 70, 400, 1.2);
  drawCityCluster(1580, 430, 60, 350, 1.2);
  drawCityCluster(1530, 570, 25, 120, 1.4); // Singapore / Malacca

  // 3. Europe (London, Paris, Rhine-Ruhr)
  drawCityCluster(1100, 280, 80, 380, 1.1);

  // 4. Middle East (Dubai, Persian Gulf)
  drawCityCluster(1310, 420, 40, 180, 1.3);

  // 5. North America (East Coast / Megalopolis)
  drawCityCluster(580, 320, 90, 400, 1.2);
  drawCityCluster(440, 350, 50, 200, 1.1);

  return canvas;
}

export function RealisticEarth() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const earthSceneRef = useRef<{
    targetRotY: number;
    targetRotX: number;
    globeGroup: THREE.Group;
    satellites: { group: THREE.Group; speed: number; angle: number; radius: number }[];
  } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 560;
    const height = mount.clientHeight || 560;

    // --- 1. Scene & Camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- 2. Master Globe Group ---
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const earthRadius = 1.05;

    // --- 3. Procedural Earth-at-Night Texture ---
    const nightCanvas = createEarthNightCanvas();
    const earthTexture = new THREE.CanvasTexture(nightCanvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    const earthGeom = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.75,
      metalness: 0.15,
      emissiveMap: earthTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.85,
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    globeGroup.add(earthMesh);

    // --- 4. Atmospheric Blue/Cyan Outer Halo ---
    const atmoGeom = new THREE.SphereGeometry(earthRadius * 1.035, 48, 48);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeom, atmoMat);
    globeGroup.add(atmoMesh);

    // Subtle Cyan Rim Shell
    const rimGeom = new THREE.SphereGeometry(earthRadius * 1.015, 48, 48);
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0x3ee0c6,
      transparent: true,
      opacity: 0.12,
      wireframe: false,
    });
    const rimMesh = new THREE.Mesh(rimGeom, rimMat);
    globeGroup.add(rimMesh);

    // --- 5. Glowing Thermal Hotspot Blips (Chennai, Neyveli, Singrauli) ---
    const hotspots = [
      { lat: 13.0827, lng: 80.2707, label: "Chennai Anomaly" }, // Chennai
      { lat: 11.5996, lng: 79.4862, label: "Neyveli" },
      { lat: 24.2009, lng: 82.6681, label: "Singrauli" },
      { lat: 28.6139, lng: 77.2090, label: "Delhi Thermal" },
    ];

    const hotspotGroup = new THREE.Group();
    globeGroup.add(hotspotGroup);

    hotspots.forEach((spot) => {
      const phi = (90 - spot.lat) * (Math.PI / 180);
      const theta = (spot.lng + 180) * (Math.PI / 180);
      const x = -(earthRadius * 1.01 * Math.sin(phi) * Math.cos(theta));
      const z = earthRadius * 1.01 * Math.sin(phi) * Math.sin(theta);
      const y = earthRadius * 1.01 * Math.cos(phi);

      const pinGeom = new THREE.SphereGeometry(0.02, 12, 12);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xff4500 });
      const pin = new THREE.Mesh(pinGeom, pinMat);
      pin.position.set(x, y, z);
      hotspotGroup.add(pin);

      const ringGeom = new THREE.RingGeometry(0.025, 0.04, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff6b4a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(x, y, z);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      hotspotGroup.add(ring);
    });

    // --- 6. Orbital Satellite Trajectory Arcs & Satellite Blips ---
    const satellites: { group: THREE.Group; speed: number; angle: number; radius: number }[] = [];

    const orbitConfigs = [
      { radius: earthRadius * 1.32, rotX: 0.35, rotY: 0.2, color: 0x3ee0c6, speed: 0.007, angle: 0.2 },
      { radius: earthRadius * 1.45, rotX: -0.42, rotY: 0.5, color: 0x22d3ee, speed: -0.005, angle: 2.1 },
      { radius: earthRadius * 1.58, rotX: 0.8, rotY: -0.3, color: 0x3ee0c6, speed: 0.006, angle: 4.3 },
    ];

    orbitConfigs.forEach((cfg) => {
      // Orbital Ellipse Arc Ring
      const ringGeom = new THREE.RingGeometry(cfg.radius, cfg.radius + 0.005, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const orbitRing = new THREE.Mesh(ringGeom, ringMat);
      orbitRing.rotation.x = cfg.rotX;
      orbitRing.rotation.y = cfg.rotY;
      globeGroup.add(orbitRing);

      // Satellite Node Group
      const satGroup = new THREE.Group();
      const dotGeom = new THREE.SphereGeometry(0.024, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const dot = new THREE.Mesh(dotGeom, dotMat);
      satGroup.add(dot);

      // Satellite Glow Ring
      const auraGeom = new THREE.RingGeometry(0.035, 0.05, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const aura = new THREE.Mesh(auraGeom, auraMat);
      satGroup.add(aura);

      globeGroup.add(satGroup);
      satellites.push({
        group: satGroup,
        speed: cfg.speed,
        angle: cfg.angle,
        radius: cfg.radius,
      });
    });

    // --- 7. Surrounding Space Background Particles ---
    const starCount = 120;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 2.2 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      starPositions[i] = r * Math.cos(phi) * Math.sin(theta);
      starPositions[i + 1] = r * Math.sin(phi);
      starPositions[i + 2] = r * Math.cos(phi) * Math.cos(theta);
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.022,
      transparent: true,
      opacity: 0.65,
    });
    const starPoints = new THREE.Points(starGeom, starMat);
    scene.add(starPoints);

    // Initial orientation focusing cleanly on India / South Asia
    earthSceneRef.current = {
      targetRotY: -Math.PI * 0.44,
      targetRotX: 0.22,
      globeGroup,
      satellites,
    };

    // --- 8. Mouse Drag Interaction ---
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !earthSceneRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      earthSceneRef.current.targetRotY += deltaX * 0.005;
      earthSceneRef.current.targetRotX += deltaY * 0.005;
      earthSceneRef.current.targetRotX = Math.max(-0.9, Math.min(0.9, earthSceneRef.current.targetRotX));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // --- 9. Animation Loop ---
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (earthSceneRef.current) {
        const { globeGroup, satellites } = earthSceneRef.current;

        if (!isDragging) {
          // Slow constant planetary rotation
          earthSceneRef.current.targetRotY += 0.0009;
        }

        // Smoothly interpolate rotation
        globeGroup.rotation.y += (earthSceneRef.current.targetRotY - globeGroup.rotation.y) * 0.06;
        globeGroup.rotation.x += (earthSceneRef.current.targetRotX - globeGroup.rotation.x) * 0.06;

        // Animate satellite nodes along their orbital paths
        satellites.forEach((sat) => {
          sat.angle += sat.speed;
          sat.group.position.x = Math.cos(sat.angle) * sat.radius;
          sat.group.position.z = Math.sin(sat.angle) * sat.radius;
          sat.group.position.y = Math.sin(sat.angle * 2) * 0.25;
        });

        starPoints.rotation.y += 0.0003;
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

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Orbit & Crosshair Overlays */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full border border-line-bright/20 border-dashed animate-spin-slow" />
      </div>

      {/* Subtle Coordinate Crosshair Telemetry */}
      <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-panel/80 border border-line text-[10px] font-mono text-slate-300 backdrop-blur-sm pointer-events-none">
        <div className="flex items-center gap-1.5 text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>ORBITAL INFRARED MATRIX</span>
        </div>
        <div className="text-slate-400 mt-0.5">VIIRS-SNPP // SENTINEL-2A</div>
      </div>
    </div>
  );
}
