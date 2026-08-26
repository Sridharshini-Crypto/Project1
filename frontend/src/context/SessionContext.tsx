import React, { createContext, useContext, useEffect, useState } from "react";

export interface UserSession {
  fullName: string;
  email: string;
  organization: string;
  role: string;
  authenticatedAt: string;
  token?: string;
}

export interface ObservationRegion {
  id: "chennai" | "india" | "global" | "custom";
  name: string;
  country: string;
  coordinates: string;
  lat: number;
  lng: number;
  zoom: number;
  satelliteFeed: string;
  resolution: string;
  status: "ACTIVE" | "SYNCHRONIZED" | "STANDBY";
  description: string;
}

export const PRESET_REGIONS: Record<string, ObservationRegion> = {
  chennai: {
    id: "chennai",
    name: "Chennai & Ennore Industrial Corridor",
    country: "India (Tamil Nadu)",
    coordinates: "13.0827° N, 80.2707° E",
    lat: 13.0827,
    lng: 80.2707,
    zoom: 11,
    satelliteFeed: "VIIRS-SNPP / Sentinel-2 L2A (Live Sync)",
    resolution: "375m Thermal / 10m Multi-Spectral",
    status: "ACTIVE",
    description: "Primary operational command sector. Real-time telemetry linked with backend FIRMS ingestion pipeline.",
  },
  india: {
    id: "india",
    name: "India National Forest & Industrial Grid",
    country: "Republic of India",
    coordinates: "20.5937° N, 78.9629° E",
    lat: 20.5937,
    lng: 78.9629,
    zoom: 5,
    satelliteFeed: "VIIRS-NOAA20 / MODIS Aqua-Terra",
    resolution: "375m - 1km Grid Matrix",
    status: "SYNCHRONIZED",
    description: "National scale thermal anomaly monitoring across agricultural, forestry, and petrochemical zones.",
  },
  global: {
    id: "global",
    name: "Worldwide Earth Observation Matrix",
    country: "Global Orbital Coverage",
    coordinates: "0.0000° N, 0.0000° E",
    lat: 20.0,
    lng: 0.0,
    zoom: 2,
    satelliteFeed: "Global Constellation Telemetry (NASA LANCE)",
    resolution: "1km Global Swath",
    status: "STANDBY",
    description: "Planetary level thermal anomaly tracking across all continent orbital swaths.",
  },
};

interface SessionContextType {
  session: UserSession | null;
  region: ObservationRegion;
  login: (sessionData: Omit<UserSession, "authenticatedAt">) => void;
  logout: () => void;
  setRegion: (region: ObservationRegion) => void;
  setRegionById: (regionId: string) => void;
}

const STORAGE_SESSION_KEY = "TRACE_USER_SESSION";
const STORAGE_REGION_KEY = "TRACE_ACTIVE_REGION";

const DEFAULT_SESSION: UserSession = {
  fullName: "Mission Director",
  email: "director@trace.isro-nasa.gov",
  organization: "Geospatial Anomaly Response Taskforce",
  role: "Incident Commander",
  authenticatedAt: new Date().toISOString(),
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SESSION_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SESSION;
    } catch {
      return DEFAULT_SESSION;
    }
  });

  const [region, setRegionState] = useState<ObservationRegion>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_REGION_KEY);
      return stored ? JSON.parse(stored) : PRESET_REGIONS.chennai;
    } catch {
      return PRESET_REGIONS.chennai;
    }
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem(STORAGE_REGION_KEY, JSON.stringify(region));
  }, [region]);

  const login = (sessionData: Omit<UserSession, "authenticatedAt">) => {
    const fullSession: UserSession = {
      ...sessionData,
      authenticatedAt: new Date().toISOString(),
    };
    setSessionState(fullSession);
  };

  const logout = () => {
    setSessionState(null);
  };

  const setRegion = (newRegion: ObservationRegion) => {
    setRegionState(newRegion);
  };

  const setRegionById = (regionId: string) => {
    if (PRESET_REGIONS[regionId]) {
      setRegionState(PRESET_REGIONS[regionId]);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        region,
        login,
        logout,
        setRegion,
        setRegionById,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

