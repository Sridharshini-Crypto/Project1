import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import { TraceProvider } from "./context/TraceProvider";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { RegionSelectionPage } from "./pages/RegionSelectionPage";
import { CommandCenter } from "./pages/CommandCenter";

export default function App() {
  return (
    <SessionProvider>
      <TraceProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Cinematic Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* 2. Authentication Gateway */}
            <Route path="/access" element={<AuthPage />} />

            {/* 3. Observation Zone Selector */}
            <Route path="/region" element={<RegionSelectionPage />} />

            {/* 4. Main TRACE Command Center Dashboard */}
            <Route path="/dashboard" element={<CommandCenter />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TraceProvider>
    </SessionProvider>
  );
}
