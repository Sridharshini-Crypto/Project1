import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  FileDown,
  Sparkles,
  RefreshCw,
  Radio,
} from "lucide-react";
import { useTrace } from "../../hooks/useTrace";
import { useSession } from "../../context/SessionContext";
import type { ThermalEvent, Intelligence } from "../../types/trace";

export interface DemoScenario {
  id: string;
  name: string;
  category: "industrial" | "wildfire" | "crop" | "hazmat";
  regionName: string;
  lat: number;
  lng: number;
  frp: number;
  temperature: number;
  confidence: number;
  classification: string;
  persistenceLevel: string;
  blastRadiusKm: number;
  satellite: string;
  description: string;
  osmContext: string;
  actionProtocol: string;
  events: ThermalEvent[];
  intelligence: Intelligence;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "chennai_industrial",
    name: "Chennai Ennore Petrochemical Flaring",
    category: "industrial",
    regionName: "Chennai Industrial Sector",
    lat: 13.2089,
    lng: 80.3241,
    frp: 67.3,
    temperature: 352.6,
    confidence: 94.2,
    classification: "Industrial Gas Flare Stack",
    persistenceLevel: "High (Recurring 72hr cycle)",
    blastRadiusKm: 0.5,
    satellite: "NOAA-20 VIIRS (375m)",
    description: "Recurring thermal emission from Ennore Thermal Station flare stack. Zero vegetation risk.",
    osmContext: "Ennore Substation (110m), CPCL Refinery Flare Stack (85m)",
    actionProtocol: "Routine operation logged. Safe impact footprint (< 0.5 km). No evacuation needed.",
    events: [
      {
        id: "demo-chn-1",
        external_id: "13.2089_80.3241_2026-08-25_VIIRS",
        latitude: 13.2089,
        longitude: 80.3241,
        acquisition_date: "2026-08-25",
        acquisition_time: "1842",
        satellite: "NOAA-20",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_CHENNAI",
        frp: 67.3,
        confidence: "high",
        bright_ti4: 352.6,
        bright_ti5: 312.4,
        day_night: "N",
      },
      {
        id: "demo-chn-2",
        external_id: "13.1845_80.3041_2026-08-24_VIIRS",
        latitude: 13.1845,
        longitude: 80.3041,
        acquisition_date: "2026-08-24",
        acquisition_time: "1837",
        satellite: "NOAA-20",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_CHENNAI",
        frp: 58.9,
        confidence: "high",
        bright_ti4: 349.1,
        bright_ti5: 308.7,
        day_night: "N",
      },
      {
        id: "demo-chn-3",
        external_id: "13.2587_80.3214_2026-08-23_VIIRS",
        latitude: 13.2587,
        longitude: 80.3214,
        acquisition_date: "2026-08-23",
        acquisition_time: "0716",
        satellite: "Suomi-NPP",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_CHENNAI",
        frp: 88.2,
        confidence: "high",
        bright_ti4: 355.4,
        bright_ti5: 318.6,
        day_night: "D",
      },
    ],
    intelligence: {
      event: {
        id: "demo-chn-1",
        external_id: "13.2089_80.3241_2026-08-25_VIIRS",
        latitude: 13.2089,
        longitude: 80.3241,
        acquisition_date: "2026-08-25",
        acquisition_time: "1842",
        satellite: "NOAA-20",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_CHENNAI",
        frp: 67.3,
        confidence: "high",
        bright_ti4: 352.6,
        bright_ti5: 312.4,
        day_night: "N",
      },
      context: {
        nearest_industry: { name: "Ennore Thermal Power Station", feature_type: "power_station", distance_meters: 110 },
        nearest_vegetation: { name: "Salt Pan Scrub", feature_type: "scrub", distance_meters: 840 },
        nearest_agriculture: null,
        nearest_settlement: { name: "Ernavur", feature_type: "residential", distance_meters: 1420 },
        nearest_critical_infrastructure: { name: "High Voltage 230kV Grid Substation", feature_type: "substation", distance_meters: 180 },
        counts: { industrial: 12, power: 4, residential: 2 },
        disclaimer: "Fused with OpenStreetMap & Sentinel-2 land cover layers.",
      },
      history: {
        total: 18,
        last_7_day: 6,
        last_30_day: 18,
        average_frp: 54.2,
        maximum_frp: 88.2,
        persistence_score: 0.94,
        persistence_level: "High",
        formula: "Historical temporal cluster recurrence score: 94%",
      },
      satellite: {
        available: true,
        acquisition_date: "2026-08-25",
        cloud_percentage: 4.2,
        ndvi: 0.12,
        interpretation: "Multi-spectral Sentinel-2 SWIR band confirms flare stack footprint.",
      },
      attribution: {
        classification: "Industrial Gas Flare Stack",
        confidence: 0.942,
        label: "Industrial Gas Flare Stack",
        factors: [
          "Collocated with Ennore Thermal Station (< 150m)",
          "Persistence frequency matches industrial operating shifts",
          "SWIR band B12 spike with low surrounding vegetation NDVI",
        ],
        disclaimer: "Ensemble classification verified with ground truth database.",
      },
      anomaly: {
        status: "Nominal Industrial Operation",
        score: 0.22,
        reasons: ["Within expected historical radiative power threshold"],
      },
      risk: {
        score: 28,
        level: "LOW",
        contributors: [
          { name: "Proximity to Power Station", points: 15 },
          { name: "Radiative Energy", points: 13 },
        ],
        formula: "Weighted Risk Score: 28/100 (Nominal Industrial Operation)",
      },
      impact: {
        label: "Industrial Zone Buffer",
        radius_km: 0.5,
        summary: { industrial_facilities: 3, critical_nodes: 1 },
        disclaimer: "Impact buffer computed for routine thermal release.",
      },
      data_mode: "demo",
      scientific_notes: [
        "VIIRS 375m sensor captures high infrared intensity at B14 (3.74 μm).",
        "Temporal recurrence verifies continuous flaring operation.",
      ],
    },
  },
  {
    id: "western_ghats_wildfire",
    name: "Western Ghats Mudumalai Canopy Wildfire",
    category: "wildfire",
    regionName: "Western Ghats Forest Reserve",
    lat: 11.5982,
    lng: 76.5412,
    frp: 142.8,
    temperature: 368.4,
    confidence: 98.7,
    classification: "High-Intensity Forest Canopy Wildfire",
    persistenceLevel: "Rapid Onset (Wildfire Spread)",
    blastRadiusKm: 6.5,
    satellite: "Sentinel-2A + NOAA-20",
    description: "Rapidly expanding wildfire front advancing through dry deciduous forest canopy.",
    osmContext: "Zero Industrial Footprint. Dense Reserve Forest Canopy.",
    actionProtocol: "CRITICAL ALERT: 6.5 km Evacuation Zone. Dispatch aerial water bombers & forest ranger brigades.",
    events: [
      {
        id: "demo-wg-1",
        external_id: "11.5982_76.5412_2026-08-25_VIIRS",
        latitude: 11.5982,
        longitude: 76.5412,
        acquisition_date: "2026-08-25",
        acquisition_time: "1342",
        satellite: "NOAA-20",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_WESTERN_GHATS",
        frp: 142.8,
        confidence: "high",
        bright_ti4: 368.4,
        bright_ti5: 324.6,
        day_night: "D",
      },
      {
        id: "demo-wg-2",
        external_id: "11.6021_76.5489_2026-08-25_VIIRS",
        latitude: 11.6021,
        longitude: 76.5489,
        acquisition_date: "2026-08-25",
        acquisition_time: "1342",
        satellite: "NOAA-20",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_WESTERN_GHATS",
        frp: 128.5,
        confidence: "high",
        bright_ti4: 364.1,
        bright_ti5: 321.2,
        day_night: "D",
      },
      {
        id: "demo-wg-3",
        external_id: "11.5910_76.5350_2026-08-25_VIIRS",
        latitude: 11.5910,
        longitude: 76.5350,
        acquisition_date: "2026-08-25",
        acquisition_time: "1344",
        satellite: "NOAA-20",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_WESTERN_GHATS",
        frp: 94.2,
        confidence: "high",
        bright_ti4: 358.9,
        bright_ti5: 316.8,
        day_night: "D",
      },
    ],
    intelligence: {
      event: {
        id: "demo-wg-1",
        external_id: "11.5982_76.5412_2026-08-25_VIIRS",
        latitude: 11.5982,
        longitude: 76.5412,
        acquisition_date: "2026-08-25",
        acquisition_time: "1342",
        satellite: "NOAA-20",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_WESTERN_GHATS",
        frp: 142.8,
        confidence: "high",
        bright_ti4: 368.4,
        bright_ti5: 324.6,
        day_night: "D",
      },
      context: {
        nearest_industry: null,
        nearest_vegetation: { name: "Mudumalai Deciduous Forest Reserve", feature_type: "forest", distance_meters: 10 },
        nearest_agriculture: null,
        nearest_settlement: { name: "Masinagudi Outpost", feature_type: "hamlet", distance_meters: 3200 },
        nearest_critical_infrastructure: { name: "Forest Ranger Tower", feature_type: "tower", distance_meters: 1850 },
        counts: { forest: 45, water_body: 2 },
        disclaimer: "Protected sanctuary zone with critical biodiversity assets.",
      },
      history: {
        total: 3,
        last_7_day: 3,
        last_30_day: 3,
        average_frp: 121.8,
        maximum_frp: 142.8,
        persistence_score: 0.15,
        persistence_level: "Low (Novel Outbreak)",
        formula: "Sudden high-energy anomaly front in non-industrial forest zone.",
      },
      satellite: {
        available: true,
        acquisition_date: "2026-08-25",
        cloud_percentage: 12.0,
        ndvi: 0.68,
        interpretation: "High NBR burn scar index with active eastward smoke plume vector.",
      },
      attribution: {
        classification: "High-Intensity Forest Canopy Wildfire",
        confidence: 0.987,
        label: "Forest Canopy Wildfire",
        factors: [
          "Zero industrial or agricultural infrastructure within 15 km",
          "High Fire Radiative Power (142.8 MW) exceeding vegetation ignition threshold",
          "Rapid spatial expansion rate across dense forest canopy",
        ],
        disclaimer: "Emergency response classification with priority tier 1 protocol.",
      },
      anomaly: {
        status: "CRITICAL WILDFIRE OUTBREAK",
        score: 0.95,
        reasons: ["Extreme radiative power", "Spread vector towards wildlife corridor"],
      },
      risk: {
        score: 94,
        level: "CRITICAL",
        contributors: [
          { name: "Extreme Fire Radiative Power", points: 40 },
          { name: "Protected Sanctuary Proximity", points: 30 },
          { name: "Rapid Spread Rate", points: 24 },
        ],
        formula: "Weighted Risk Score: 94/100 (EMERGENCY RESPONSE REQUIRED)",
      },
      impact: {
        label: "Wildfire Evacuation & Containment Zone",
        radius_km: 6.5,
        summary: { forest_hectares: 4800, vulnerable_settlements: 2 },
        disclaimer: "Calculated based on wind vector and fuel dryness indices.",
      },
      data_mode: "demo",
      scientific_notes: [
        "Sentinel-2 Band 8A (NIR) shows sharp drop in chlorophyll reflectance.",
        "Estimated fire front propagation rate: 12.4 km/h under dry easterly wind conditions.",
      ],
    },
  },
  {
    id: "punjab_crop_burning",
    name: "Punjab Post-Harvest Stubble Burning",
    category: "crop",
    regionName: "Punjab Agricultural Belt",
    lat: 30.9010,
    lng: 75.8573,
    frp: 38.2,
    temperature: 342.1,
    confidence: 91.5,
    classification: "Agricultural Biomass / Stubble Burning",
    persistenceLevel: "Seasonal Cluster (Post-Harvest)",
    blastRadiusKm: 1.2,
    satellite: "Terra / Aqua MODIS + VIIRS",
    description: "Widespread crop residue burning across paddy agricultural fields following harvest.",
    osmContext: "Cropland Farmlands, Village Link Roads, Irrigation Canals",
    actionProtocol: "State Pollution Control Board advisory issued. Air quality PM2.5 monitor triggered.",
    events: [
      {
        id: "demo-pb-1",
        external_id: "30.9010_75.8573_2026-08-25_VIIRS",
        latitude: 30.9010,
        longitude: 75.8573,
        acquisition_date: "2026-08-25",
        acquisition_time: "0812",
        satellite: "NOAA-20",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_PUNJAB",
        frp: 38.2,
        confidence: "high",
        bright_ti4: 342.1,
        bright_ti5: 304.5,
        day_night: "D",
      },
      {
        id: "demo-pb-2",
        external_id: "30.9085_75.8640_2026-08-25_VIIRS",
        latitude: 30.9085,
        longitude: 75.8640,
        acquisition_date: "2026-08-25",
        acquisition_time: "0812",
        satellite: "NOAA-20",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_PUNJAB",
        frp: 34.7,
        confidence: "high",
        bright_ti4: 339.4,
        bright_ti5: 301.8,
        day_night: "D",
      },
    ],
    intelligence: {
      event: {
        id: "demo-pb-1",
        external_id: "30.9010_75.8573_2026-08-25_VIIRS",
        latitude: 30.9010,
        longitude: 75.8573,
        acquisition_date: "2026-08-25",
        acquisition_time: "0812",
        satellite: "NOAA-20",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_PUNJAB",
        frp: 38.2,
        confidence: "high",
        bright_ti4: 342.1,
        bright_ti5: 304.5,
        day_night: "D",
      },
      context: {
        nearest_industry: null,
        nearest_vegetation: null,
        nearest_agriculture: { name: "Paddy Farmland", feature_type: "farmland", distance_meters: 20 },
        nearest_settlement: { name: "Ludhiana Rural", feature_type: "village", distance_meters: 1100 },
        nearest_critical_infrastructure: { name: "State Highway 11", feature_type: "highway", distance_meters: 650 },
        counts: { farmland: 38, irrigation: 6 },
        disclaimer: "Agricultural zoning verified with Land Use Land Cover (LULC) maps.",
      },
      history: {
        total: 12,
        last_7_day: 8,
        last_30_day: 12,
        average_frp: 32.4,
        maximum_frp: 42.1,
        persistence_score: 0.65,
        persistence_level: "Medium (Seasonal)",
        formula: "Seasonal post-harvest burning cycle detection.",
      },
      satellite: {
        available: true,
        acquisition_date: "2026-08-25",
        cloud_percentage: 2.0,
        ndvi: 0.35,
        interpretation: "Post-harvest soil exposure with local aerosol optical depth spike.",
      },
      attribution: {
        classification: "Agricultural Biomass / Stubble Burning",
        confidence: 0.915,
        label: "Agricultural Crop Residue",
        factors: [
          "Collocated with agricultural crop parcel polygons",
          "FRP matches crop residue combustion profiles (20-50 MW)",
          "Matches seasonal post-harvest paddy clearing window",
        ],
        disclaimer: "Automated attribution model compliant with ICAR standards.",
      },
      anomaly: {
        status: "Seasonal Agricultural Burn",
        score: 0.48,
        reasons: ["Aerosol PM2.5 dispersion over regional airshed"],
      },
      risk: {
        score: 52,
        level: "MEDIUM",
        contributors: [
          { name: "Air Quality Impact", points: 30 },
          { name: "Highway Smoke Incursion", points: 22 },
        ],
        formula: "Weighted Risk Score: 52/100 (AIR QUALITY ADVISORY)",
      },
      impact: {
        label: "Smoke Dispersion Impact Zone",
        radius_km: 1.2,
        summary: { farmland_acres: 420, local_villages: 1 },
        disclaimer: "Models local smoke plume trajectory.",
      },
      data_mode: "demo",
      scientific_notes: [
        "MODIS Band 21/22 and VIIRS I4 capture agricultural burn radiance signature.",
      ],
    },
  },
  {
    id: "jamnagar_hazmat",
    name: "Jamnagar Refinery Critical Hazmat Risk",
    category: "hazmat",
    regionName: "Jamnagar Petrochemical Complex",
    lat: 22.4707,
    lng: 70.0577,
    frp: 88.5,
    temperature: 359.1,
    confidence: 96.4,
    classification: "Critical Hazmat Storage Threat",
    persistenceLevel: "Abnormal Flaring / Tank Proximity",
    blastRadiusKm: 3.5,
    satellite: "Sentinel-2A + NOAA-21",
    description: "High-radiance thermal anomaly detected within 85m of LPG storage sphere tank farm.",
    osmContext: "LPG Tank Farm, Crude Oil Distillation Unit, High-Pressure Pipeline",
    actionProtocol: "LEVEL 3 INDUSTRIAL EMERGENCY: Automated deluge system active. Evacuate 3.5 km downwind quadrant.",
    events: [
      {
        id: "demo-jmn-1",
        external_id: "22.4707_70.0577_2026-08-25_VIIRS",
        latitude: 22.4707,
        longitude: 70.0577,
        acquisition_date: "2026-08-25",
        acquisition_time: "1915",
        satellite: "NOAA-21",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_JAMNAGAR",
        frp: 88.5,
        confidence: "high",
        bright_ti4: 359.1,
        bright_ti5: 316.4,
        day_night: "N",
      },
    ],
    intelligence: {
      event: {
        id: "demo-jmn-1",
        external_id: "22.4707_70.0577_2026-08-25_VIIRS",
        latitude: 22.4707,
        longitude: 70.0577,
        acquisition_date: "2026-08-25",
        acquisition_time: "1915",
        satellite: "NOAA-21",
        instrument: "VIIRS",
        source: "DEMO_VIIRS_JAMNAGAR",
        frp: 88.5,
        confidence: "high",
        bright_ti4: 359.1,
        bright_ti5: 316.4,
        day_night: "N",
      },
      context: {
        nearest_industry: { name: "Petrochemical Crude Tank Farm", feature_type: "chemical", distance_meters: 85 },
        nearest_vegetation: null,
        nearest_agriculture: null,
        nearest_settlement: { name: "Moti Khavdi", feature_type: "town", distance_meters: 2400 },
        nearest_critical_infrastructure: { name: "LPG Pressurized Storage Sphere", feature_type: "hazmat", distance_meters: 95 },
        counts: { industrial: 24, hazmat: 8, tank_farm: 6 },
        disclaimer: "High hazard Major Accident Hazard (MAH) classified site.",
      },
      history: {
        total: 5,
        last_7_day: 2,
        last_30_day: 5,
        average_frp: 45.2,
        maximum_frp: 88.5,
        persistence_score: 0.72,
        persistence_level: "High Anomaly",
        formula: "Radiative power spike 96% above 30-day baseline average.",
      },
      satellite: {
        available: true,
        acquisition_date: "2026-08-25",
        cloud_percentage: 1.0,
        ndvi: 0.08,
        interpretation: "SWIR thermal anomaly localized within hazardous storage containment berm.",
      },
      attribution: {
        classification: "Critical Hazmat Storage Threat",
        confidence: 0.964,
        label: "Hazmat / Petrochemical Alert",
        factors: [
          "Proximity to pressurized LPG storage sphere (< 100m)",
          "Radiative Power (88.5 MW) significantly exceeds routine flaring baseline",
          "Potential vapor cloud ignition hazard",
        ],
        disclaimer: "Critical incident classification for rapid containment.",
      },
      anomaly: {
        status: "CRITICAL HAZMAT ANOMALY",
        score: 0.92,
        reasons: ["Proximity to pressurized explosive inventory", "Excess energy spike"],
      },
      risk: {
        score: 89,
        level: "CRITICAL",
        contributors: [
          { name: "Hazmat Tank Proximity", points: 45 },
          { name: "Thermal Radiative Surge", points: 28 },
          { name: "Downwind Population Center", points: 16 },
        ],
        formula: "Weighted Risk Score: 89/100 (TIER 3 EMERGENCY PROTOCOL)",
      },
      impact: {
        label: "Hazmat Blast & Vapor Cloud Exclusion Zone",
        radius_km: 3.5,
        summary: { storage_tanks: 8, control_centers: 2 },
        disclaimer: "Calculated based on TNT-equivalent overpressure blast model.",
      },
      data_mode: "demo",
      scientific_notes: [
        "VIIRS I4 375m pixel intersects with chemical storage boundary.",
      ],
    },
  },
];

export function DemoScenarioPlayer() {
  const { loadScenario } = useTrace();
  const { setRegion } = useSession();
  const [activeScenarioId, setActiveScenarioId] = useState<string>("chennai_industrial");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const activeScenario = DEMO_SCENARIOS.find((s) => s.id === activeScenarioId) || DEMO_SCENARIOS[0];

  const handleSelectScenario = (scenario: DemoScenario) => {
    setActiveScenarioId(scenario.id);
    setRegion({
      id: "custom",
      name: scenario.regionName,
      country: "India",
      coordinates: `${scenario.lat.toFixed(4)}° N, ${scenario.lng.toFixed(4)}° E`,
      lat: scenario.lat,
      lng: scenario.lng,
      zoom: scenario.category === "wildfire" ? 11 : 12,
      satelliteFeed: scenario.satellite,
      resolution: "375m Thermal / 10m Multi-Spectral",
      status: "ACTIVE",
      description: scenario.description,
    });
    loadScenario(scenario.events, scenario.events[0], scenario.intelligence);
  };

  // Run initial select on mount
  useEffect(() => {
    handleSelectScenario(DEMO_SCENARIOS[0]);
  }, []);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 1000);
    setTimeout(() => setSimStep(3), 2200);
    setTimeout(() => setSimStep(4), 3400);
    setTimeout(() => {
      setSimStep(5);
      setIsSimulating(false);
    }, 4600);
  };

  const handleExportReport = () => {
    const reportText = `===============================================================
TRACE // INCIDENT INTELLIGENCE BRIEFING & VERIFICATION REPORT
Generated: ${new Date().toISOString()}
===============================================================

MISSION SCENARIO: ${activeScenario.name}
TARGET ZONE: ${activeScenario.regionName} (Coordinates: ${activeScenario.lat}° N, ${activeScenario.lng}° E)
SATELLITE SENSOR: ${activeScenario.satellite}

1. SATELLITE INFRARED RADIOMETRY
---------------------------------------------------------------
- Fire Radiative Power (FRP): ${activeScenario.frp} MW
- Brightness Temperature (B14): ${activeScenario.temperature} K
- Acquisition Timestamp: ${activeScenario.events[0].acquisition_date} ${activeScenario.events[0].acquisition_time} UTC
- Confidence Level: ${activeScenario.events[0].confidence?.toUpperCase()}

2. GEOSPATIAL CONTEXT & INFRASTRUCTURE FUSION
---------------------------------------------------------------
- OpenStreetMap Alignment: ${activeScenario.osmContext}
- Temporal Persistence: ${activeScenario.persistenceLevel}
- Land Use Cover: ${activeScenario.category.toUpperCase()} ZONING

3. AI ATTRIBUTION & ENSEMBLE CLASSIFICATION
---------------------------------------------------------------
- Predicted Class: ${activeScenario.classification}
- AI Confidence: ${activeScenario.confidence}%
- Anomaly Classification Status: ${activeScenario.intelligence.anomaly.status}
- Risk Level: ${activeScenario.intelligence.risk.level} (${activeScenario.intelligence.risk.score}/100)

4. ACTIONABLE INCIDENT PROTOCOL & MITIGATION
---------------------------------------------------------------
- Calculated Blast Radius: ${activeScenario.blastRadiusKm} KM
- Command Directive: ${activeScenario.actionProtocol}

===============================================================
TRACE: Thermal Risk Attribution & Classification Engine
Compliant with NASA FIRMS LANCE & ISRO Earth Observation Standards
===============================================================`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TRACE_Incident_Briefing_${activeScenario.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-4 sm:mx-5 mb-3 rounded-2xl bg-panel/95 border border-accent/40 p-4 shadow-xl backdrop-blur-xl">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-white">DEMO MODE SIMULATOR</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-warn/15 border border-warn/30 text-warn font-bold">
                PRE-LOADED GEOSPATIAL DATASETS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Select a real-world scenario to demonstrate instant thermal detection, AI attribution, and mitigation.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-ink font-mono text-xs font-bold hover:bg-accent/90 shadow-[0_0_15px_rgba(62,224,198,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>ORBIT SCANNING...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY SATELLITE PASS</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel-light hover:bg-line border border-line text-xs font-mono text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="Download formatted Incident Briefing report"
          >
            <FileDown className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">EXPORT BRIEFING</span>
          </button>
        </div>
      </div>

      {/* Scenario Chips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        {DEMO_SCENARIOS.map((scenario) => {
          const isSelected = scenario.id === activeScenarioId;
          return (
            <button
              key={scenario.id}
              onClick={() => handleSelectScenario(scenario)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-panel-light/90 border-accent shadow-[0_0_15px_rgba(62,224,198,0.25)] ring-1 ring-accent"
                  : "bg-ink/50 border-line hover:border-accent/40 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span
                    className={`font-bold ${
                      scenario.category === "industrial"
                        ? "text-cyan-400"
                        : scenario.category === "wildfire"
                        ? "text-danger"
                        : scenario.category === "hazmat"
                        ? "text-warn"
                        : "text-accent"
                    }`}
                  >
                    {scenario.category.toUpperCase()}
                  </span>
                  <span className="text-slate-400">{scenario.frp} MW</span>
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">{scenario.name}</div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-line/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">{scenario.confidence}% Confidence</span>
                <span className="text-accent">{scenario.blastRadiusKm} km blast</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Real-time Simulation Status Overlay */}
      <AnimatePresence>
        {isSimulating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-xl bg-ink/90 border border-accent/50 text-xs font-mono text-accent flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>
                {simStep === 1 && "🛰 SATELLITE INTERCEPT: Polar VIIRS Radiance Downlink Received..."}
                {simStep === 2 && "📡 FUSION: Aligning OpenStreetMap Infrastructure & Sentinel-2 Matrices..."}
                {simStep === 3 && "🧠 AI CLASSIFIER: Computing Ensemble Temporal Persistence Scoring..."}
                {simStep === 4 && "🛡️ HAZARD MODEL: Calculating Dynamic Blast Radius Footprint..."}
                {simStep === 5 && "✅ MISSION READY: Decision-Ready Intelligence Delivered!"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full ${
                    simStep >= step ? "bg-accent shadow-[0_0_6px_rgba(62,224,198,0.8)]" : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
