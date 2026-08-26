import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw, Compass } from "lucide-react";

// Precise 3D Shield Outline matching the exact HD reference image proportions (955 x 791)
function createShieldShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.35);
  shape.lineTo(1.08, 1.12);
  shape.quadraticCurveTo(1.22, 0.25, 0.98, -0.45);
  shape.quadraticCurveTo(0.72, -1.15, 0, -1.55);
  shape.quadraticCurveTo(-0.72, -1.15, -0.98, -0.45);
  shape.quadraticCurveTo(-1.22, 0.25, -1.08, 1.12);
  shape.lineTo(0, 1.35);
  return shape;
}

export function TraceLogo3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneStateRef = useRef<{
    targetRotX: number;
    targetRotY: number;
    modelGroup: THREE.Group;
  } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    // --- 1. Three.js Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.NoToneMapping;
    mount.appendChild(renderer.domElement);

    // --- 2. Balanced Studio Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const sideLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sideLight.position.set(-3.0, 3.5, 3.5);
    scene.add(sideLight);

    const rimLight = new THREE.DirectionalLight(0x3ee0c6, 0.8);
    rimLight.position.set(3.5, 1.0, -2.0);
    scene.add(rimLight);

    // --- 3. Master 3D Model Group ---
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // ----------------------------------------------------
    // A. 3D EXTRUDED SHIELD CASING (Physical Depth & Bevels)
    // ----------------------------------------------------
    const shieldShape = createShieldShape();
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    };

    const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeometry.center();

    // Dark Brushed Titanium Material for the 3D Extruded Sides
    const shieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x182433,
      metalness: 0.75,
      roughness: 0.35,
    });
    const shieldMesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
    modelGroup.add(shieldMesh);

    // ----------------------------------------------------
    // B. EXACT ULTRA-HD 3D EMBLEM (Front & Back Faces)
    // ----------------------------------------------------
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/trace-shield-isolated.png", (texture) => {
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      // Exact aspect ratio of trace-shield-isolated: 955w x 791h
      const planeWidth = 2.45;
      const planeHeight = 2.45 * (791 / 955);

      const planeGeom = new THREE.PlaneGeometry(planeWidth, planeHeight);
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });

      // Front Face
      const frontEmblem = new THREE.Mesh(planeGeom, planeMat);
      frontEmblem.position.set(0, 0, 0.102);
      modelGroup.add(frontEmblem);

      // Back Face (For full 360° rotation)
      const backEmblem = new THREE.Mesh(planeGeom, planeMat);
      backEmblem.rotation.y = Math.PI;
      backEmblem.position.set(0, 0, -0.102);
      modelGroup.add(backEmblem);
    });

    sceneStateRef.current = {
      targetRotX: 0,
      targetRotY: 0,
      modelGroup,
    };

    // --- 4. Interactive Mouse Drag Controls with Inertia ---
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
      sceneStateRef.current.targetRotX = Math.max(-0.65, Math.min(0.65, sceneStateRef.current.targetRotX));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // --- 5. 60FPS Floating & Render Loop ---
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (sceneStateRef.current) {
        const { modelGroup } = sceneStateRef.current;

        // Subtle floating breathing motion
        const floatY = Math.sin(elapsed * 1.2) * 0.05;
        modelGroup.position.y = floatY;

        if (!isDragging) {
          const idleRotY = sceneStateRef.current.targetRotY + Math.sin(elapsed * 0.6) * 0.1;
          const idleRotX = sceneStateRef.current.targetRotX + Math.cos(elapsed * 0.5) * 0.04;

          modelGroup.rotation.y += (idleRotY - modelGroup.rotation.y) * 0.05;
          modelGroup.rotation.x += (idleRotX - modelGroup.rotation.x) * 0.05;
        } else {
          modelGroup.rotation.y += (sceneStateRef.current.targetRotY - modelGroup.rotation.y) * 0.12;
          modelGroup.rotation.x += (sceneStateRef.current.targetRotX - modelGroup.rotation.x) * 0.12;
        }
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
      {/* Clean 3D WebGL Canvas Viewport */}
      <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Minimal Floating Telemetry Badge */}
        <div className="absolute top-2 left-3 px-2.5 py-1 rounded-lg bg-panel/85 border border-line-bright text-[10px] font-mono text-slate-300 backdrop-blur-md pointer-events-none shadow-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>TRACE 3D VOLUMETRIC SHIELD // TITANIUM BEZEL</span>
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
          <span>DRAG TO ROTATE 3D MODEL (360° DEPTH)</span>
        </div>
      </div>
    </div>
  );
}
