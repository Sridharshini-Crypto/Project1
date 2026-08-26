import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculatePersistence } from "../services/historyService.js";
import { attributeSource } from "../services/attributionService.js";
import { calculateRisk } from "../services/riskService.js";
import { detectAnomaly } from "../services/anomalyService.js";
import type { ThermalEvent } from "../models/types.js";

const event: ThermalEvent = {
  id: "test",
  external_id: "x",
  latitude: 13.16,
  longitude: 80.26,
  acquisition_date: new Date().toISOString().slice(0, 10),
  acquisition_time: "1842",
  satellite: "N",
  instrument: "VIIRS",
  source: "TEST",
  frp: 48,
  confidence: "high",
  bright_ti4: 345,
  bright_ti5: 300,
  day_night: "N",
  created_at: new Date().toISOString(),
};

describe("persistence calculation", () => {
  it("returns a 0-100 explainable score", () => {
    const today = new Date().toISOString().slice(0, 10);
    const result = calculatePersistence([
      { acquisition_date: today, frp: 40, day_night: "N" },
      { acquisition_date: today, frp: 42, day_night: "N" },
      { acquisition_date: today, frp: 38, day_night: "N" },
    ]);
    assert.ok(result.persistence_score >= 0 && result.persistence_score <= 100);
  });
});

describe("attribution", () => {
  it("leans industrial when a factory is nearby", () => {
    const history = {
      total: 5,
      last_7_day: 3,
      last_30_day: 5,
      average_frp: 22,
      maximum_frp: 48,
      nighttime_count: 4,
      nighttime_share: 0.8,
      recurrence_frequency: 0.16,
      persistence_score: 70,
      persistence_level: "HIGH" as const,
      formula: "",
      weights: { recentFrequency: 0.4, recurrence: 0.3, temporalConcentration: 0.2, frpConsistency: 0.1 },
      events: [event],
    };
    const result = attributeSource({
      event,
      features: [
        {
          id: "1",
          osm_id: "n1",
          name: "Plant",
          feature_type: "industrial",
          latitude: 13.162,
          longitude: 80.262,
          tags: {},
          distance_meters: 700,
        },
      ],
      history,
      ndvi: 0.12,
    });
    assert.equal(result.classification, "INDUSTRIAL");
    assert.ok(result.confidence >= 50);
    assert.ok(result.factors.length > 0);
  });
});

describe("risk calculation", () => {
  it("exposes contributors", () => {
    const history = {
      total: 5,
      last_7_day: 3,
      last_30_day: 5,
      average_frp: 22,
      maximum_frp: 48,
      nighttime_count: 4,
      nighttime_share: 0.8,
      recurrence_frequency: 0.16,
      persistence_score: 70,
      persistence_level: "HIGH" as const,
      formula: "",
      weights: { recentFrequency: 0.4, recurrence: 0.3, temporalConcentration: 0.2, frpConsistency: 0.1 },
      events: [event],
    };
    const attribution = attributeSource({
      event,
      features: [],
      history,
      ndvi: 0.2,
    });
    const anomaly = detectAnomaly({
      event,
      history,
      classification: attribution.classification,
      industryKm: 0.7,
      vegetationKm: 4,
    });
    const risk = calculateRisk({
      history,
      anomaly,
      attribution,
      features: [
        {
          id: "r",
          osm_id: null,
          name: "Ward",
          feature_type: "residential",
          latitude: 13.16,
          longitude: 80.26,
          tags: {},
          distance_meters: 800,
        },
      ],
    });
    assert.ok(risk.score >= 0 && risk.score <= 100);
    assert.ok(risk.contributors.length >= 5);
  });
});
