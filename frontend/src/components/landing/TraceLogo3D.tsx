import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw, Compass } from "lucide-react";

// Precise 3D Shield Outline matching the exact reference proportions
function createShieldShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.5);
  shape.lineTo(1.05, 1.25);
  shape.quadraticCurveTo(1.18, 0.28, 0.95, -0.45);
  shape.quadraticCurveTo(0.72, -1.15, 0, -1.65);
  shape.quadraticCurveTo(-0.72, -1.15, -0.95, -0.45);
  shape.quadraticCurveTo(-1.18, 0.28, -1.05, 1.25);
  shape.lineTo(0, 1.5);
  return shape;
}

// Inner Cutout for the Hollow Frame
function createInnerShieldHole(): THREE.Path {
  const hole = new THREE.Path();
  hole.moveTo(0, 1.34);
  hole.lineTo(0.9, 1.12);
  hole.quadraticCurveTo(1.02, 0.24, 0.82, -0.38);
  hole.quadraticCurveTo(0.62, -0.98, 0, -1.45);
  hole.quadraticCurveTo(-0.62, -0.98, -0.82, -0.38);
  hole.quadraticCurveTo(-1.02, 0.24, -0.9, 1.12);
  hole.lineTo(0, 1.34);
  return hole;
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
    camera.position.set(0, 0, 4.9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // --- 2. Cinematic PBR Studio Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    // Top-Left Key Light (Matches reference lighting on shield)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(-3.5, 4.5, 4.0);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Right Soft Rim Light
    const rightRim = new THREE.DirectionalLight(0x22d3ee, 1.8);
    rightRim.position.set(4.0, 1.5, -2.0);
    scene.add(rightRim);

    // Front Soft Fill
    const frontLight = new THREE.PointLight(0xffffff, 1.2, 8);
    frontLight.position.set(0, 0.5, 3.8);
    scene.add(frontLight);

    // --- 3. Master 3D Model Group ---
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // ----------------------------------------------------
    // A. 3D EXTRUDED SHIELD FRAME (Dark Navy Outer Rim)
    // ----------------------------------------------------
    const shieldShape = createShieldShape();
    const shieldHole = createInnerShieldHole();
    shieldShape.holes.push(shieldHole);

    const frameExtrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.26,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };

    const frameGeometry = new THREE.ExtrudeGeometry(shieldShape, frameExtrudeSettings);
    frameGeometry.center();

    // Dark Navy Satin PBR Material
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x182433,
      metalness: 0.75,
      roughness: 0.3,
    });
    const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
    frameMesh.castShadow = true;
    frameMesh.receiveShadow = true;
    modelGroup.add(frameMesh);

    // ----------------------------------------------------
    // B. WHITE BEVELED INNER CONTOUR BORDER
    // ----------------------------------------------------
    const innerLipShape = createInnerShieldHole();
    const innerLipPath = new THREE.Path(innerLipShape.getPoints());
    const innerLipGeom = new THREE.BufferGeometry().setFromPoints(innerLipPath.getPoints(64));
    const innerLipMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 3,
    });
    const innerLipLine = new THREE.LineLoop(innerLipGeom, innerLipMat);
    innerLipLine.position.z = 0.14;
    modelGroup.add(innerLipLine);

    // ----------------------------------------------------
    // C. EXACT 3D EMBLEM INLAYS (Clean Front & Back 360°)
    // ----------------------------------------------------
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/trace-3d-model-transparent.png", (texture) => {
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      // Front Emblem Plane
      const planeGeom = new THREE.PlaneGeometry(2.35, 2.5);
      const planeMat = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        metalness: 0.45,
        roughness: 0.25,
        side: THREE.DoubleSide,
      });
      const frontEmblem = new THREE.Mesh(planeGeom, planeMat);
      frontEmblem.position.set(0, -0.05, 0.08);
      modelGroup.add(frontEmblem);

      // Back Emblem Plane (Visible when rotated 180°)
      const backEmblem = new THREE.Mesh(planeGeom, planeMat);
      backEmblem.rotation.y = Math.PI;
      backEmblem.position.set(0, -0.05, -0.08);
      modelGroup.add(backEmblem);
    });

    sceneStateRef.current = {
      targetRotX: 0,
      targetRotY: 0,
      modelGroup,
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
      sceneStateRef.current.targetRotX = Math.max(-0.65, Math.min(0.65, sceneStateRef.current.targetRotX));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // --- 5. 60FPS Render & Floating Animation Loop ---
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (sceneStateRef.current) {
        const { modelGroup } = sceneStateRef.current;

        // Floating breathing physics
        const floatY = Math.sin(elapsed * 1.2) * 0.06;
        modelGroup.position.y = floatY;

        if (!isDragging) {
          const idleRotY = sceneStateRef.current.targetRotY + Math.sin(elapsed * 0.6) * 0.12;
          const idleRotX = sceneStateRef.current.targetRotX + Math.cos(elapsed * 0.5) * 0.05;

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
      {/* Background Soft Glow Halos */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute w-64 h-64 rounded-full bg-danger/10 blur-2xl pointer-events-none -z-10" />

      {/* 3D WebGL Canvas Viewport */}
      <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Telemetry Badge */}
        <div className="absolute top-2 left-3 px-2.5 py-1 rounded-lg bg-panel/85 border border-line-bright text-[10px] font-mono text-slate-300 backdrop-blur-md pointer-events-none shadow-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>TRACE 3D VOLUMETRIC SHIELD // METALLIC CORE</span>
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
