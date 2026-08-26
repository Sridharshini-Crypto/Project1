import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw, Compass } from "lucide-react";

// Precise 3D Shield Curve Shape with authentic proportions
function createShieldShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.4);
  shape.lineTo(0.96, 1.18);
  shape.quadraticCurveTo(1.08, 0.25, 0.88, -0.42);
  shape.quadraticCurveTo(0.68, -1.05, 0, -1.5);
  shape.quadraticCurveTo(-0.68, -1.05, -0.88, -0.42);
  shape.quadraticCurveTo(-1.08, 0.25, -0.96, 1.18);
  shape.lineTo(0, 1.4);
  return shape;
}

// Inner Inset Shield Shape for Layered Beveling
function createInnerShieldShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.3);
  shape.lineTo(0.88, 1.1);
  shape.quadraticCurveTo(0.98, 0.22, 0.8, -0.38);
  shape.quadraticCurveTo(0.62, -0.96, 0, -1.38);
  shape.quadraticCurveTo(-0.62, -0.96, -0.8, -0.38);
  shape.quadraticCurveTo(-0.98, 0.22, -0.88, 1.1);
  shape.lineTo(0, 1.3);
  return shape;
}

export function TraceLogo3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneStateRef = useRef<{
    targetRotX: number;
    targetRotY: number;
    modelGroup: THREE.Group;
    rings: THREE.Mesh[];
    particles: THREE.Points;
  } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 480;
    const height = mount.clientHeight || 480;

    // --- 1. Three.js Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // --- 2. Cinematic PBR Lighting ---
    // Soft Ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Key Light (Warm White)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3.5, 4.0, 4.5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Cool Cyan Rim Light (Left/Back)
    const cyanRim = new THREE.DirectionalLight(0x3ee0c6, 3.5);
    cyanRim.position.set(-4.0, 2.0, -2.5);
    scene.add(cyanRim);

    // Deep Orange Fill Light (Bottom/Right for thermal glow)
    const orangeFill = new THREE.PointLight(0xff6b4a, 2.8, 10);
    orangeFill.position.set(3.0, -2.5, 2.0);
    scene.add(orangeFill);

    // Front Subtle Specular Light
    const frontSoft = new THREE.PointLight(0x22d3ee, 1.8, 8);
    frontSoft.position.set(0, 1.5, 3.5);
    scene.add(frontSoft);

    // --- 3. Master 3D Model Group ---
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // ----------------------------------------------------
    // A. 3D VOLUMETRIC METALLIC SHIELD BEZEL (Outer Frame)
    // ----------------------------------------------------
    const outerShape = createShieldShape();
    const outerExtrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.22, // Substantial 3D thickness
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    };
    const outerGeometry = new THREE.ExtrudeGeometry(outerShape, outerExtrudeSettings);
    outerGeometry.center();

    // Brushed Dark Titanium / Navy PBR Material
    const bezelMaterial = new THREE.MeshStandardMaterial({
      color: 0x091929,
      metalness: 0.88,
      roughness: 0.22,
      envMapIntensity: 1.2,
    });
    const outerMesh = new THREE.Mesh(outerGeometry, bezelMaterial);
    outerMesh.castShadow = true;
    outerMesh.receiveShadow = true;
    modelGroup.add(outerMesh);

    // Cyan Emissive Edge Rim Accent
    const edgeGeom = new THREE.EdgesGeometry(outerGeometry, 22);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x3ee0c6,
      transparent: true,
      opacity: 0.65,
    });
    const edgeLines = new THREE.LineSegments(edgeGeom, edgeMat);
    modelGroup.add(edgeLines);

    // ----------------------------------------------------
    // B. INSET CERAMIC / COMPOSITE FACEPLATE (Middle Layer)
    // ----------------------------------------------------
    const innerShape = createInnerShieldShape();
    const innerExtrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    };
    const innerGeometry = new THREE.ExtrudeGeometry(innerShape, innerExtrudeSettings);
    innerGeometry.center();

    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x05101c,
      metalness: 0.7,
      roughness: 0.35,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    innerMesh.position.z = 0.1;
    modelGroup.add(innerMesh);

    // ----------------------------------------------------
    // C. 3D HIGH-RESOLUTION EMBLEM WITH DEPTH & SHEEN
    // ----------------------------------------------------
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/trace-logo.png", (texture) => {
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      
      const planeGeom = new THREE.PlaneGeometry(2.08, 2.28);
      const planeMat = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        metalness: 0.45,
        roughness: 0.25,
        side: THREE.DoubleSide,
      });
      const planeMesh = new THREE.Mesh(planeGeom, planeMat);
      planeMesh.position.z = 0.16;
      modelGroup.add(planeMesh);

      // Backside Inlay Badge (Visible when rotated 180 degrees!)
      const backBadgeGeom = new THREE.PlaneGeometry(1.8, 2.0);
      const backBadgeMat = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
        metalness: 0.6,
        roughness: 0.3,
        side: THREE.DoubleSide,
      });
      const backBadgeMesh = new THREE.Mesh(backBadgeGeom, backBadgeMat);
      backBadgeMesh.rotation.y = Math.PI;
      backBadgeMesh.position.z = -0.16;
      modelGroup.add(backBadgeMesh);
    });

    // ----------------------------------------------------
    // D. 3D VOLUMETRIC SATELLITE DISH & EMITTING ANTENNA
    // ----------------------------------------------------
    const dishGroup = new THREE.Group();
    dishGroup.position.set(0, 0.45, 0.2);

    // Parabolic Dish geometry
    const dishGeom = new THREE.ConeGeometry(0.38, 0.16, 32, 1, true);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0x1b3a4b,
      metalness: 0.92,
      roughness: 0.18,
      side: THREE.DoubleSide,
    });
    const dishMesh = new THREE.Mesh(dishGeom, dishMat);
    dishMesh.rotation.x = -Math.PI * 0.34;
    dishMesh.rotation.z = Math.PI * 0.08;
    dishGroup.add(dishMesh);

    // Subreflector Feed Horn
    const hornGeom = new THREE.CylinderGeometry(0.02, 0.035, 0.24, 16);
    const hornMat = new THREE.MeshStandardMaterial({
      color: 0x3ee0c6,
      emissive: 0x3ee0c6,
      emissiveIntensity: 0.4,
      metalness: 0.95,
    });
    const hornMesh = new THREE.Mesh(hornGeom, hornMat);
    hornMesh.position.set(0, 0.12, 0.12);
    hornMesh.rotation.x = -Math.PI * 0.34;
    dishGroup.add(hornMesh);

    modelGroup.add(dishGroup);

    // ----------------------------------------------------
    // E. 3D GLOWING THERMAL HOTSPOT MATRIX (Bottom Left)
    // ----------------------------------------------------
    const thermalGroup = new THREE.Group();
    const thermalTileGeom = new THREE.BoxGeometry(0.08, 0.08, 0.04);
    const thermalTileMat = new THREE.MeshStandardMaterial({
      color: 0xff6b4a,
      emissive: 0xff4500,
      emissiveIntensity: 1.5,
      metalness: 0.3,
      roughness: 0.2,
    });

    const tileOffsets = [
      [-0.42, -0.36],
      [-0.32, -0.36],
      [-0.22, -0.36],
      [-0.42, -0.46],
      [-0.32, -0.46],
      [-0.42, -0.56],
    ];

    tileOffsets.forEach(([x, y]) => {
      const tile = new THREE.Mesh(thermalTileGeom, thermalTileMat);
      tile.position.set(x, y, 0.18);
      thermalGroup.add(tile);
    });
    modelGroup.add(thermalGroup);

    // ----------------------------------------------------
    // F. 3D ORBITAL GYROSCOPE RINGS (Surrounding Environment)
    // ----------------------------------------------------
    const rings: THREE.Mesh[] = [];

    // Equatorial Cyan Gyro Ring
    const gyro1Geom = new THREE.TorusGeometry(1.95, 0.012, 16, 80);
    const gyro1Mat = new THREE.MeshStandardMaterial({
      color: 0x3ee0c6,
      emissive: 0x3ee0c6,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.55,
    });
    const gyro1 = new THREE.Mesh(gyro1Geom, gyro1Mat);
    gyro1.rotation.x = Math.PI * 0.38;
    scene.add(gyro1);
    rings.push(gyro1);

    // Inclined Amber Sensor Swath Ring
    const gyro2Geom = new THREE.TorusGeometry(2.25, 0.008, 16, 80);
    const gyro2Mat = new THREE.MeshStandardMaterial({
      color: 0xff6b4a,
      emissive: 0xff6b4a,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.4,
    });
    const gyro2 = new THREE.Mesh(gyro2Geom, gyro2Mat);
    gyro2.rotation.y = Math.PI * 0.28;
    gyro2.rotation.x = -Math.PI * 0.22;
    scene.add(gyro2);
    rings.push(gyro2);

    // ----------------------------------------------------
    // G. FLOATING COSMIC TELEMETRY PARTICLES
    // ----------------------------------------------------
    const particleCount = 70;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 2.0 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i] = r * Math.cos(phi) * Math.sin(theta);
      particlePositions[i + 1] = r * Math.sin(phi);
      particlePositions[i + 2] = r * Math.cos(phi) * Math.cos(theta);
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x3ee0c6,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    sceneStateRef.current = {
      targetRotX: 0,
      targetRotY: 0,
      modelGroup,
      rings,
      particles,
    };

    // --- 4. Interactive Mouse Drag & Physics ---
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

      sceneStateRef.current.targetRotY += deltaX * 0.007;
      sceneStateRef.current.targetRotX += deltaY * 0.007;

      // Smooth clamp on vertical tilt so user can appreciate full 3D bevels without flipping
      sceneStateRef.current.targetRotX = Math.max(-0.65, Math.min(0.65, sceneStateRef.current.targetRotX));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // --- 5. Smooth 60FPS Render & Floating Animation Loop ---
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (sceneStateRef.current) {
        const { modelGroup, rings, particles } = sceneStateRef.current;

        // Subtle, elegant breathing floating motion
        const floatY = Math.sin(elapsed * 1.2) * 0.06;
        modelGroup.position.y = floatY;

        // Idle slow intelligent drift when not actively dragged
        if (!isDragging) {
          const idleRotY = sceneStateRef.current.targetRotY + Math.sin(elapsed * 0.6) * 0.12;
          const idleRotX = sceneStateRef.current.targetRotX + Math.cos(elapsed * 0.5) * 0.05;

          modelGroup.rotation.y += (idleRotY - modelGroup.rotation.y) * 0.05;
          modelGroup.rotation.x += (idleRotX - modelGroup.rotation.x) * 0.05;
        } else {
          modelGroup.rotation.y += (sceneStateRef.current.targetRotY - modelGroup.rotation.y) * 0.12;
          modelGroup.rotation.x += (sceneStateRef.current.targetRotX - modelGroup.rotation.x) * 0.12;
        }

        // Gyroscope rotation around the intact 3D core
        rings[0].rotation.z += 0.003;
        rings[1].rotation.z -= 0.002;
        particles.rotation.y += 0.001;

        // Dynamic thermal hotspot pulse
        const pulse = 1.2 + 0.4 * Math.sin(elapsed * 3.5);
        thermalTileMat.emissiveIntensity = pulse;
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

  const handleReset = () => {
    if (sceneStateRef.current) {
      sceneStateRef.current.targetRotX = 0;
      sceneStateRef.current.targetRotY = 0;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto select-none">
      {/* Background Soft Glow Halos */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute w-64 h-64 rounded-full bg-danger/10 blur-2xl pointer-events-none -z-10" />

      {/* 3D WebGL Canvas Viewport */}
      <div className="relative w-full h-[360px] sm:h-[420px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Minimal Floating Telemetry Badge */}
        <div className="absolute top-2 left-3 px-2.5 py-1 rounded-lg bg-panel/85 border border-line-bright text-[10px] font-mono text-slate-300 backdrop-blur-md pointer-events-none shadow-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>3D VOLUMETRIC CORE // TITANIUM BEZEL</span>
        </div>

        {/* Reset Orientation Button */}
        <button
          onClick={handleReset}
          className="absolute top-2 right-3 p-1.5 rounded-lg bg-panel/85 border border-line hover:border-accent text-slate-400 hover:text-accent transition-colors cursor-pointer backdrop-blur-md shadow-sm"
          title="Reset 3D Perspective"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Bottom Interactive Hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-ink/75 border border-line text-[10px] font-mono text-slate-400 backdrop-blur-md pointer-events-none">
          <Compass className="w-3 h-3 text-accent" />
          <span>DRAG TO ROTATE 3D OBJECT (360° DEPTH)</span>
        </div>
      </div>
    </div>
  );
}
