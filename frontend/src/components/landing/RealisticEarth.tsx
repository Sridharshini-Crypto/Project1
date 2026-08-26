import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function RealisticEarth() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Mouse Move Parallax Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 540;
    const height = mount.clientHeight || 540;

    // --- 1. Three.js Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // --- 2. 3D Texture-Mapped Earth Sphere ---
    const earthRadius = 1.22;
    const textureLoader = new THREE.TextureLoader();

    // High-Definition Texture Map from Exact Reference
    textureLoader.load("/earth-globe-square.png", (texture) => {
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      // Primary High-Fidelity Earth Sphere
      const earthGeom = new THREE.SphereGeometry(earthRadius, 64, 64);
      const earthMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.98,
      });
      const earthMesh = new THREE.Mesh(earthGeom, earthMat);
      masterGroup.add(earthMesh);
    });

    // --- 3. Atmospheric Outer Blue/Cyan Glow Ring ---
    const atmoRingGeom = new THREE.RingGeometry(earthRadius * 0.99, earthRadius * 1.05, 64);
    const atmoRingMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const atmoRing = new THREE.Mesh(atmoRingGeom, atmoRingMat);
    masterGroup.add(atmoRing);

    // --- 4. Live Orbiting Satellites on Cyan Trajectory Paths ---
    const satellites: { group: THREE.Group; speed: number; angle: number; radius: number; rotX: number; rotY: number }[] = [];

    const orbitConfigs = [
      { radius: earthRadius * 1.28, rotX: 0.42, rotY: 0.25, color: 0x3ee0c6, speed: 0.007, angle: 0.3 },
      { radius: earthRadius * 1.42, rotX: -0.48, rotY: 0.65, color: 0x22d3ee, speed: -0.0055, angle: 2.4 },
      { radius: earthRadius * 1.56, rotX: 0.88, rotY: -0.32, color: 0x3ee0c6, speed: 0.0065, angle: 4.6 },
    ];

    orbitConfigs.forEach((cfg) => {
      // Thin cyan orbital track
      const orbitRingGeom = new THREE.RingGeometry(cfg.radius, cfg.radius + 0.0035, 128);
      const orbitRingMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const orbitRing = new THREE.Mesh(orbitRingGeom, orbitRingMat);
      orbitRing.rotation.x = cfg.rotX;
      orbitRing.rotation.y = cfg.rotY;
      masterGroup.add(orbitRing);

      // Satellite Node
      const satGroup = new THREE.Group();
      const dotGeom = new THREE.SphereGeometry(0.024, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const dot = new THREE.Mesh(dotGeom, dotMat);
      satGroup.add(dot);

      // Satellite Cyan Glowing Aura
      const auraGeom = new THREE.RingGeometry(0.035, 0.052, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const aura = new THREE.Mesh(auraGeom, auraMat);
      satGroup.add(aura);

      masterGroup.add(satGroup);
      satellites.push({
        group: satGroup,
        speed: cfg.speed,
        angle: cfg.angle,
        radius: cfg.radius,
        rotX: cfg.rotX,
        rotY: cfg.rotY,
      });
    });

    // --- 5. Laser Telemetry Line between Satellite Nodes ---
    const lineGeom = new THREE.BufferGeometry();
    const linePositions = new Float32Array(6);
    lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x3ee0c6,
      transparent: true,
      opacity: 0.35,
    });
    const laserLine = new THREE.Line(lineGeom, lineMat);
    masterGroup.add(laserLine);

    // --- 6. Thermal Anomaly Beacon (Chennai: ~0.08 x, 0.12 y) ---
    const hotspotGroup = new THREE.Group();
    hotspotGroup.position.set(0.08, 0.12, earthRadius * 0.95);

    const pinGeom = new THREE.SphereGeometry(0.022, 12, 12);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xff3b19 });
    const pin = new THREE.Mesh(pinGeom, pinMat);
    hotspotGroup.add(pin);

    const pulseRingGeom = new THREE.RingGeometry(0.03, 0.048, 16);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: 0xff6b4a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const pulseRing = new THREE.Mesh(pulseRingGeom, pulseRingMat);
    hotspotGroup.add(pulseRing);
    masterGroup.add(hotspotGroup);

    // --- 7. Animation Loop ---
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle breathing floating motion
      masterGroup.position.y = Math.sin(elapsed * 1.1) * 0.03;

      // Animate satellites
      satellites.forEach((sat, idx) => {
        sat.angle += sat.speed;
        const basePos = new THREE.Vector3(
          Math.cos(sat.angle) * sat.radius,
          0,
          Math.sin(sat.angle) * sat.radius
        );
        // Apply orbit inclination rotations
        basePos.applyAxisAngle(new THREE.Vector3(1, 0, 0), sat.rotX);
        basePos.applyAxisAngle(new THREE.Vector3(0, 1, 0), sat.rotY);
        sat.group.position.copy(basePos);

        // Update laser telemetry link between sat 0 and sat 1
        if (idx === 0) {
          linePositions[0] = basePos.x;
          linePositions[1] = basePos.y;
          linePositions[2] = basePos.z;
        } else if (idx === 1) {
          linePositions[3] = basePos.x;
          linePositions[4] = basePos.y;
          linePositions[5] = basePos.z;
          lineGeom.attributes.position.needsUpdate = true;
        }
      });

      // Pulse hotspot ring
      const pulseScale = 1.0 + 0.35 * Math.sin(elapsed * 4.0);
      pulseRing.scale.set(pulseScale, pulseScale, 1);

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
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[540px] aspect-square flex items-center justify-center select-none"
      style={{
        transform: `perspective(1000px) rotateY(${mouseOffset.x * 6}deg) rotateX(${-mouseOffset.y * 6}deg)`,
        transition: "transform 0.15s ease-out",
      }}
    >
      {/* 1. Underlying Exact Photorealistic Earth Image from Reference */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/earth-globe-clean.png"
          alt="TRACE Photorealistic 3D Earth at Night"
          className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(34,211,238,0.25)]"
        />
      </div>

      {/* 2. Interactive 3D WebGL Overlay (Orbiting Satellites, Laser Links, Hotspots) */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 3. Orbit Target Crosshairs */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[420px] h-[420px] rounded-full border border-cyan-500/20 border-dashed animate-spin-slow" />
      </div>
    </div>
  );
}
