/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111d",
        space: "#040913",
        panel: "#0d1b2a",
        "panel-light": "#13253a",
        line: "#1b3a4b",
        "line-bright": "#2c5d79",
        accent: "#3ee0c6",
        "accent-glow": "rgba(62, 224, 198, 0.4)",
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
          900: "#164e63",
        },
        warn: "#f4b942",
        danger: "#ff6b4a",
        "danger-glow": "rgba(255, 107, 74, 0.4)",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "Segoe UI", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 25s linear infinite",
        "spin-reverse": "spin-rev 35s linear infinite",
        "scan-line": "scanline 8s linear infinite",
        "radar-sweep": "radar 4s linear infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        "spin-rev": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
