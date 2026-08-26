import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface SatelliteDot {
  x: number;
  y: number;
  radius: number;
  angle: number;
  speed: number;
  color: string;
  label: string;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener("resize", handleResize);

    const stars: Star[] = [];
    const numStars = Math.min(180, Math.floor((width * height) / 8000));

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.3,
          speed: Math.random() * 0.15 + 0.03,
          opacity: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    initStars();

    const satellites: SatelliteDot[] = [
      {
        x: width * 0.5,
        y: height * 0.5,
        radius: Math.min(width, height) * 0.38,
        angle: 0.2,
        speed: 0.0008,
        color: "#3ee0c6",
        label: "NOAA-20 / VIIRS",
      },
      {
        x: width * 0.5,
        y: height * 0.5,
        radius: Math.min(width, height) * 0.46,
        angle: 2.1,
        speed: -0.0006,
        color: "#22d3ee",
        label: "SENTINEL-2A",
      },
      {
        x: width * 0.5,
        y: height * 0.5,
        radius: Math.min(width, height) * 0.54,
        angle: 4.3,
        speed: 0.0005,
        color: "#f4b942",
        label: "TERRA / MODIS",
      },
    ];

    let radarAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space gradient backdrop
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, "#081528");
      bgGrad.addColorStop(0.4, "#050e1c");
      bgGrad.addColorStop(0.85, "#030712");
      bgGrad.addColorStop(1, "#02040a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle cyan/emerald nebula glow in center
      const nebulaGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        10,
        width * 0.5,
        height * 0.4,
        Math.min(width, height) * 0.45
      );
      nebulaGrad.addColorStop(0, "rgba(62, 224, 198, 0.07)");
      nebulaGrad.addColorStop(0.5, "rgba(14, 165, 233, 0.03)");
      nebulaGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Starfield
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y -= s.speed;
        if (s.y < 0) s.y = height;

        s.twinklePhase += s.twinkleSpeed;
        const currentOpacity = s.opacity * (0.6 + 0.4 * Math.sin(s.twinklePhase));

        ctx.fillStyle = `rgba(220, 240, 255, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw faint orbital ellipses
      const centerX = width * 0.5;
      const centerY = height * 0.42;

      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      [0.32, 0.44, 0.56].forEach((scale, idx) => {
        ctx.strokeStyle = idx === 0 ? "rgba(62, 224, 198, 0.15)" : "rgba(27, 58, 75, 0.35)";
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          width * scale * 0.55,
          height * scale * 0.35,
          -0.2,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Draw Satellite Telemetry Nodes on orbital rings
      satellites.forEach((sat) => {
        sat.angle += sat.speed;
        const rx = width * 0.42;
        const ry = height * 0.28;
        const sx = centerX + Math.cos(sat.angle) * rx;
        const sy = centerY + Math.sin(sat.angle) * ry;

        // Pulse ring
        ctx.strokeStyle = sat.color;
        ctx.fillStyle = sat.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(sx, sy, 8, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        ctx.globalAlpha = 0.5;
        ctx.font = "9px 'IBM Plex Mono', monospace";
        ctx.fillText(sat.label, sx + 10, sy + 3);
        ctx.globalAlpha = 1.0;
      });

      // Subtle rotating radar sweep in background
      radarAngle += 0.006;
      const radarRadius = Math.min(width, height) * 0.45;
      const sweepGrad = ctx.createConicGradient(radarAngle, centerX, centerY);
      sweepGrad.addColorStop(0, "rgba(62, 224, 198, 0.04)");
      sweepGrad.addColorStop(0.1, "rgba(62, 224, 198, 0)");
      sweepGrad.addColorStop(1, "rgba(62, 224, 198, 0)");
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radarRadius, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none" />
    </div>
  );
}

