import { Satellite, MapPin, User, LogOut, Globe, Home, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrace } from "../hooks/useTrace";
import { useSession } from "../context/SessionContext";

export function Header() {
  const navigate = useNavigate();
  const { dataMode, setDataMode, refresh, loading } = useTrace();
  const { session, region, logout } = useSession();

  const handleLogout = () => {
    logout();
    navigate("/access");
  };

  return (
    <header className="border-b border-line bg-panel/90 px-4 sm:px-5 py-2.5 backdrop-blur-md sticky top-0 z-30">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: TRACE Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-lg bg-panel border border-accent/40 p-1 flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(62,224,198,0.2)] hover:border-accent transition-all"
            title="Return to Landing Page"
          >
            <img src="/trace-logo.png" alt="TRACE Shield" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1
                onClick={() => navigate("/")}
                className="text-xl font-bold tracking-wider text-white hover:text-accent transition-colors cursor-pointer"
              >
                TRACE
              </h1>
              <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400 hidden sm:inline">
                Thermal Risk Attribution & Classification Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">From Thermal Detection to Actionable Intelligence</p>
          </div>
        </div>

        {/* Center: 2-Session Mode Toggle (Live Satellite vs Judge Demo Mode) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-0.5 rounded-xl bg-ink/80 border border-line-bright shadow-inner">
            <button
              onClick={() => {
                setDataMode("live");
                refresh("live");
              }}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                dataMode === "live"
                  ? "bg-accent text-ink shadow-[0_0_12px_rgba(62,224,198,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Connect to real-time live NASA FIRMS & Sentinel satellite feeds"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dataMode === "live" ? "bg-ink animate-pulse" : "bg-accent"}`} />
              <Satellite className="w-3.5 h-3.5" />
              <span>LIVE DATA STREAM</span>
            </button>

            <button
              onClick={() => {
                setDataMode("demo");
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                dataMode === "demo"
                  ? "bg-warn text-ink shadow-[0_0_12px_rgba(244,185,66,0.4)]"
                  : "text-slate-400 hover:text-warn"
              }`}
              title="Switch to Judge Instant Demo Mode with pre-loaded curated datasets"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>JUDGE DEMO MODE</span>
            </button>
          </div>

          <div
            onClick={() => navigate("/region")}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-panel-light border border-line-bright hover:border-accent text-xs font-mono cursor-pointer transition-colors shadow-sm hidden md:flex"
            title="Click to Switch Observation Zone"
          >
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span className="text-slate-400">ZONE:</span>
            <span className="text-white font-bold max-w-[140px] truncate">
              {region?.name || "Chennai Sector"}
            </span>
          </div>
        </div>

        {/* Right: Operator Badge & Quick Nav Actions */}
        <div className="flex items-center gap-2">
          {session && (
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink/60 border border-line text-xs font-mono text-slate-300">
              <User className="w-3 h-3 text-cyan-400" />
              <span className="text-white font-semibold truncate max-w-[120px]">{session.fullName}</span>
            </div>
          )}

          <button
            onClick={() => navigate("/region")}
            className="p-1.5 rounded border border-line hover:border-accent text-slate-400 hover:text-accent transition-colors cursor-pointer"
            title="Observation Zone Selector"
          >
            <Globe className="h-4 w-4" />
          </button>

          <button
            onClick={() => navigate("/")}
            className="p-1.5 rounded border border-line hover:border-accent text-slate-400 hover:text-accent transition-colors cursor-pointer"
            title="Return to TRACE Hero & Observatory"
          >
            <Home className="h-4 w-4" />
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded border border-line hover:border-danger text-slate-400 hover:text-danger transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
