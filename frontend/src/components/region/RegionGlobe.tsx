import { useEffect, useRef } from "react";
import * as THREE from "three";

interface HotspotNode {
  name: string;
  region: "chennai" | "india" | "global";
  lat: number;
  lng: number;
  color: string;
  frp: string;
}

const SAMPLE_HOTSPOTS: HotspotNode[] = [
  { name: "Chennai Ennore Sector", region: "chennai", lat: 13.0827, lng: 80.2707, color: "#ff6b4a", frp: "48.2 MW" },
  { name: "Neyveli Industrial Area", region: "chennai", lat: 11.5996, lng: 79.4862, color: "#f4b942", frp: "32.1 MW" },
  { name: "Singrauli Power Belt", region: "india", lat: 24.2009, lng: 82.6681, color: "#ff6b4a", frp: "65.4 MW" },
  { name: "Korba Industrial Complex", region: "india", lat: 22.3595, lng: 82.7501, color: "#ff6b4a", frp: "54.8 MW" },
  { name: "Punjab Agri Residue Belt", region: "india", lat: 31.1471, lng: 75.3412, color: "#f4b942", frp: "28.3 MW" },
  { name: "Amazon Basin Sector", region: "global", lat: -3.4653, lng: -62.2159, color: "#ff6b4a", frp: "84.1 MW" },
  { name: "Pilbara Mining Grid", region: "global", lat: -21.1687, lng: 119.7422, color: "#f4b942", frp: "39.5 MW" },
  { name: "California Sierra Foothills", region: "global", lat: 37.8651, lng: -119.5383, color: "#ff6b4a", frp: "72.0 MW" },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

interface RegionGlobeProps {
  selectedRegionId: string;
  onSelectRegion?: (id: "chennai" | "india" | "global") => void;
}

export function RegionGlobe({ selectedRegionId }: RegionGlobeProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<{
    targetRotationY: number;
    targetRotationX: number;
    globeGroup: THREE.Group;
  } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner Dark Earth Sphere
    const earthRadius = 0.95;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 36, 36);
    const earthMaterial = new THREE.MeshBasicMaterial({
      color: 0x081726,
      wireframe: false,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Atmospheric Glow Sphere
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius * 1.05, 36, 36);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x3ee0c6,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Latitude & Longitude Coordinate Wireframe
    const gridGeometry = new THREE.SphereGeometry(earthRadius * 1.005, 18, 18);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x1b3a4b,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    globeGroup.add(gridMesh);

    // Equatorial and Polar Orbit Rings
    const orbitRingGeom = new THREE.RingGeometry(earthRadius * 1.25, earthRadius * 1.27, 64);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x3ee0c6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeom, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2.3;
    globeGroup.add(orbitRing);

    // Add Hotspot Pins
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    SAMPLE_HOTSPOTS.forEach((spot) => {
      const pos = latLngToVector3(spot.lat, spot.lng, earthRadius * 1.02);

      // Pin core
      const pinGeom = new THREE.SphereGeometry(0.018, 8, 8);
      const pinMat = new THREE.MeshBasicMaterial({
        color: spot.region === "chennai" ? 0xff6b4a : spot.region === "india" ? 0x3ee0c6 : 0xf4b942,
      });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.copy(pos);
      pinGroup.add(pinMesh);

      // Pulse ring around pin
      const ringGeom = new THREE.RingGeometry(0.025, 0.035, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spot.region === "chennai" ? 0xff6b4a : 0x3ee0c6,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      pinGroup.add(ring);
    });

    sceneRef.current = {
      targetRotationY: 0,
      targetRotationX: 0.2,
      globeGroup,
    };

    // User drag interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sceneRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      sceneRef.current.targetRotationY += deltaX * 0.005;
      sceneRef.current.targetRotationX += deltaY * 0.005;

      // Clamp X rotation so globe doesn't flip upside down
      sceneRef.current.targetRotationX = Math.max(-1.2, Math.min(1.2, sceneRef.current.targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
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

      if (sceneRef.current) {
        if (!isDragging) {
          // Slow constant planetary rotation
          sceneRef.current.targetRotationY += 0.0015;
        }

        // Smoothly interpolate rotation
        globeGroup.rotation.y += (sceneRef.current.targetRotationY - globeGroup.rotation.y) * 0.08;
        globeGroup.rotation.x += (sceneRef.current.targetRotationX - globeGroup.rotation.x) * 0.08;
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

  // When selectedRegionId changes, orient the globe toward that region!
  useEffect(() => {
    if (!sceneRef.current) return;
    if (selectedRegionId === "chennai") {
      // Longitude 80E -> target rotation
      sceneRef.current.targetRotationY = -Math.PI * 0.44;
      sceneRef.current.targetRotationX = 0.22;
    } else if (selectedRegionId === "india") {
      sceneRef.current.targetRotationY = -Math.PI * 0.42;
      sceneRef.current.targetRotationX = 0.35;
    } else {
      // Global
      sceneRef.current.targetRotationX = 0.15;
    }
  }, [selectedRegionId]);

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Orbit & Crosshair Overlays */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] rounded-full border border-line-bright/40 border-dashed animate-spin-slow" />
      </div>

      {/* Floating HUD Badges */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-panel/80 border border-line text-[10px] font-mono text-slate-300 backdrop-blur-sm pointer-events-none">
        <div className="flex items-center gap-1.5 text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>GEODETIC TARGETING SYSTEM</span>
        </div>
        <div className="text-slate-400 mt-0.5">DRAG TO ROTATE PLANETARY GRID</div>
      </div>

      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-panel/80 border border-line text-[10px] font-mono text-slate-300 backdrop-blur-sm pointer-events-none">
        <div className="text-slate-400">THERMAL COVERAGE</div>
        <div className="text-cyan-400 font-bold">SNPP-VIIRS 375m ORBITAL SWATH</div>
      </div>
    </div>
  );
}

