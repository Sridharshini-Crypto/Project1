import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  User,
  Building,
  Briefcase,
  ArrowRight,
  KeyRound,
  Fingerprint,
  ChevronLeft,
  Shield,
  Radio,
} from "lucide-react";
import { useSession } from "../context/SessionContext";
import { SpaceBackground } from "../components/landing/SpaceBackground";
import { LandingTelemetry } from "../components/landing/LandingTelemetry";

export function AuthPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  const [tab, setTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("commander@trace.isro-nasa.gov");
  const [loginPassword, setLoginPassword] = useState("••••••••••••");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regOrg, setRegOrg] = useState("");
  const [regRole, setRegRole] = useState("Incident Commander");
  const [regPassword, setRegPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setError("Please enter a valid operator email.");
      return;
    }
    setLoading(true);
    setError(null);

    setTimeout(() => {
      login({
        fullName: loginEmail.split("@")[0].toUpperCase() || "COMMAND OPERATOR",
        email: loginEmail,
        organization: "Earth Observation Command Network",
        role: "Incident Commander",
      });
      setLoading(false);
      navigate("/region");
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regOrg) {
      setError("Please fill in all mission credential fields.");
      return;
    }
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setDataMode("live");
      void refresh("live");
      login({
        fullName: regName,
        email: regEmail,
        organization: regOrg,
        role: regRole,
      });
      setLoading(false);
      navigate("/region");
    }, 400);
  };

  const handleQuickDemoAccess = () => {
    setDataMode("demo");
    login({
      fullName: "Judge / Evaluator (Demo)",
      email: "judge@trace.eval",
      organization: "Smart India Hackathon Jury",
      role: "Lead Evaluation Panel",
    });
    navigate("/app");
  };

  return (
    <div className="relative min-h-screen bg-space text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-accent selection:text-ink font-sans">
      <SpaceBackground />
      <LandingTelemetry />

      {/* Header with Back button */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel/80 border border-line hover:border-accent text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-accent" />
          <span>RETURN TO OBSERVATORY</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-mono text-accent">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            SECURE ACCESS TERMINAL
          </span>
        </div>
      </div>

      {/* Main Terminal Box */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md rounded-3xl bg-panel/90 border border-line-bright p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative"
        >
          {/* Logo & Heading */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-panel border border-accent/40 p-2 mb-3 shadow-[0_0_20px_rgba(62,224,198,0.25)] flex items-center justify-center">
              <img src="/trace-logo.png" alt="TRACE Shield" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">TRACE</h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              SECURE ACCESS TERMINAL
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-ink/70 border border-line mb-6">
            <button
              onClick={() => setTab("login")}
              className={`py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                tab === "login"
                  ? "bg-accent text-ink shadow-[0_0_12px_rgba(62,224,198,0.3)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              OPERATOR SIGN IN
            </button>
            <button
              onClick={() => setTab("register")}
              className={`py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                tab === "register"
                  ? "bg-accent text-ink shadow-[0_0_12px_rgba(62,224,198,0.3)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ENROLL AGENCY
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-danger/15 border border-danger/30 text-danger text-xs font-mono">
              {error}
            </div>
          )}

          {/* Tabs Content */}
          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">OPERATOR EMAIL</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="commander@trace.isro-nasa.gov"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-ink/60 border border-line focus:border-accent text-xs font-mono text-white placeholder-slate-600 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">SECURITY ACCESS KEY</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-ink/60 border border-line focus:border-accent text-xs font-mono text-white placeholder-slate-600 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 mt-2 rounded-xl bg-accent text-ink font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-accent/90 shadow-[0_0_20px_rgba(62,224,198,0.3)] transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>AUTHENTICATING TELEMETRY...</span>
                  ) : (
                    <>
                      <span>ENTER LIVE OPERATIONAL COMMAND</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegisterSubmit}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">OFFICER FULL NAME</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Dr. Sridharshini K."
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-ink/60 border border-line focus:border-accent text-xs font-mono text-white placeholder-slate-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">OFFICIAL EMAIL</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="sridharshini@disaster.gov.in"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-ink/60 border border-line focus:border-accent text-xs font-mono text-white placeholder-slate-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">ORGANIZATION</label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regOrg}
                      onChange={(e) => setRegOrg(e.target.value)}
                      placeholder="National Remote Sensing Centre (ISRO)"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-ink/60 border border-line focus:border-accent text-xs font-mono text-white placeholder-slate-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">OPERATIONAL ROLE</label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-panel border border-line focus:border-accent text-xs font-mono text-white outline-none"
                    >
                      <option value="Incident Commander">Incident Commander</option>
                      <option value="Disaster Response Specialist">Disaster Response Specialist</option>
                      <option value="Geospatial Intelligence Analyst">Geospatial Intelligence Analyst</option>
                      <option value="Forest Fire Officer">Forest Fire Officer</option>
                      <option value="Industrial Safety Inspector">Industrial Safety Inspector</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">PASSWORD</label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-ink/60 border border-line focus:border-accent text-xs font-mono text-white placeholder-slate-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 mt-2 rounded-xl bg-accent text-ink font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-accent/90 shadow-[0_0_20px_rgba(62,224,198,0.3)] transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>ENROLLING OPERATOR...</span>
                  ) : (
                    <>
                      <span>ENROLL & CONFIGURE REGION</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Quick Demo Access Bypass Button */}
          <div className="mt-6 pt-4 border-t border-line text-center">
            <button
              onClick={handleQuickDemoAccess}
              className="w-full py-2 px-3 rounded-lg bg-panel-light hover:bg-line/40 border border-line text-xs font-mono text-slate-300 hover:text-accent flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Fingerprint className="w-3.5 h-3.5 text-accent" />
              <span>INSTANT JUDGE / DEMO ACCESS (1-CLICK)</span>
            </button>
          </div>

          {/* Trust Footnote */}
          <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-accent">
              <Shield className="w-3 h-3" />
              SECURE CONNECTION
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Radio className="w-3 h-3" />
              GEOSPATIAL NETWORK ACTIVE
            </span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-4 text-[10px] font-mono text-slate-500">
        TRACE GEOSPATIAL OBSERVATORY // ACCESS PORTAL
      </div>
    </div>
  );
}
