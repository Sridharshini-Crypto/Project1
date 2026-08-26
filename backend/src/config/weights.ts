export const SCORE_WEIGHTS = {
  persistence: {
    recentFrequency: 0.4,
    recurrence: 0.3,
    temporalConcentration: 0.2,
    frpConsistency: 0.1,
  },
  risk: {
    anomaly: 0.3,
    persistence: 0.2,
    attributionConfidence: 0.2,
    populationExposure: 0.15,
    criticalInfrastructure: 0.1,
    historicalRecurrence: 0.05,
  },
} as const;

export const RISK_LEVELS = {
  LOW: { min: 0, max: 30 },
  MODERATE: { min: 31, max: 60 },
  HIGH: { min: 61, max: 80 },
  CRITICAL: { min: 81, max: 100 },
} as const;
