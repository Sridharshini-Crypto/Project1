import { Satellite, MapPin, User, LogOut, Globe, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrace } from "../hooks/useTrace";
import { useSession } from "../context/SessionContext";

export function Header() {
  const navigate = useNavigate();
  const { dataMode, health, refresh, loading } = useTrace();
  const { session, region, logout } = useSession();
  const demo = dataMode === "demo" || health?.demo_mode;

  const handleLogout = () => {
    logout();
    navigate("/access");
  };

  return (
    <header className="border-b border-line bg-panel/90 px-4 sm:px-5 py-3 backdrop-blur-md sticky top-0 z-30">
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

        {/* Center: Active Observation Zone Badge */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => navigate("/region")}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-panel-light border border-line-bright hover:border-accent text-xs font-mono cursor-pointer transition-colors shadow-sm"
            title="Click to Switch Observation Zone"
          >
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span className="text-slate-400">ZONE:</span>
            <span className="text-white font-bold max-w-[140px] sm:max-w-[200px] truncate">
              {region?.name || "Chennai Sector"}
            </span>
            <span className="text-[10px] text-accent ml-1 underline hidden sm:inline">Change</span>
          </div>

          {session && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink/60 border border-line text-xs font-mono text-slate-300">
              <User className="w-3 h-3 text-cyan-400" />
              <span className="text-slate-400">OPERATOR:</span>
              <span className="text-white font-semibold truncate max-w-[120px]">{session.fullName}</span>
              <span className="text-[10px] text-slate-500">({session.role})</span>
            </div>
          )}
        </div>

        {/* Right: Data Mode, Refresh & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold font-mono ${
              demo ? "border-warn text-warn bg-warn/10" : "border-accent text-accent bg-accent/10"
            }`}
          >
            {demo ? "DEMO DATA" : "LIVE DATA"}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs font-mono text-slate-300 hidden md:inline">
            DB: {health?.database ?? "connected"}
          </span>
          <button
            className="rounded border border-line px-3 py-1 text-xs font-mono text-slate-200 hover:border-accent hover:text-white transition-colors cursor-pointer"
            onClick={() => refresh("live")}
            disabled={loading}
          >
            Refresh live
          </button>
          <button
            className="rounded border border-warn/40 px-3 py-1 text-xs font-mono text-warn hover:border-warn hover:bg-warn/10 transition-colors cursor-pointer"
            onClick={() => refresh("demo")}
            disabled={loading}
          >
            Switch to Demo Mode
          </button>

          {/* Quick Nav Icons */}
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
            title="Mission Briefing & Architecture"
          >
            <Home className="h-4 w-4" />
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded border border-line hover:border-danger text-slate-400 hover:text-danger transition-colors cursor-pointer"
            title="Logout / Change Operator"
          >
            <LogOut className="h-4 w-4" />
          </button>

          <Satellite className="h-4 w-4 text-slate-500 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
