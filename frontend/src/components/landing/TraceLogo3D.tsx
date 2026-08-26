import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw, Compass } from "lucide-react";

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

    const width = mount.clientWidth || 480;
    const height = mount.clientHeight || 480;

    // --- 1. Three.js Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- 2. Master 3D Model Group ---
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // --- 3. Exact Ultra-HD 3D Emblem (Front & Back for 360° Depth) ---
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/trace-shield-isolated.png", (texture) => {
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      // Aspect ratio of trace-shield-isolated: 955w x 791h
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
      frontEmblem.position.set(0, 0, 0.02);
      modelGroup.add(frontEmblem);

      // Back Face (Mirrored for seamless 360° rotation)
      const backEmblem = new THREE.Mesh(planeGeom, planeMat);
      backEmblem.rotation.y = Math.PI;
      backEmblem.position.set(0, 0, -0.02);
      modelGroup.add(backEmblem);
    });

    sceneStateRef.current = {
      targetRotX: 0,
      targetRotY: 0,
      modelGroup,
    };

    // --- 4. Interactive Mouse Drag Controls with Smooth Inertia ---
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
        const floatY = Math.sin(elapsed * 1.2) * 0.04;
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
      {/* Crisp 3D WebGL Viewport */}
      <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Minimal Badge */}
        <div className="absolute top-2 left-3 px-2.5 py-1 rounded-lg bg-panel/85 border border-line-bright text-[10px] font-mono text-slate-300 backdrop-blur-md pointer-events-none shadow-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>TRACE 3D VOLUMETRIC SHIELD</span>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="absolute top-2 right-3 p-1.5 rounded-lg bg-panel/85 border border-line hover:border-accent text-slate-400 hover:text-accent transition-colors cursor-pointer backdrop-blur-md shadow-sm"
          title="Reset 3D Perspective"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Bottom Drag Hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-ink/75 border border-line text-[10px] font-mono text-slate-400 backdrop-blur-md pointer-events-none">
          <Compass className="w-3 h-3 text-accent" />
          <span>DRAG TO ROTATE 3D MODEL (360° DEPTH)</span>
        </div>
      </div>
    </div>
  );
}
