import { Router } from "express";
import * as api from "../controllers/apiController.js";
import { asyncHandler } from "../utils/errors.js";

export const router = Router();

router.get("/health", asyncHandler(api.health));
router.get("/firms/hotspots", asyncHandler(api.firmsHotspots));
router.get("/events", asyncHandler(api.events));
router.get("/events/:id", asyncHandler(api.eventById));
router.get("/events/:id/context", asyncHandler(api.eventContext));
router.get("/events/:id/history", asyncHandler(api.eventHistory));
router.get("/events/:id/satellite", asyncHandler(api.eventSatellite));
router.get("/events/:id/classification", asyncHandler(api.eventClassification));
router.get("/events/:id/risk", asyncHandler(api.eventRisk));
router.get("/events/:id/impact", asyncHandler(api.eventImpact));
router.post("/events/:id/analyze", asyncHandler(api.analyze));
router.get("/dashboard/summary", asyncHandler(api.dashboardSummary));
router.get("/alerts", asyncHandler(async (_req, res) => {
  const { listAlerts } = await import("../models/analysisModel.js");
  res.json({ alerts: await listAlerts(30) });
}));
