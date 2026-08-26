import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { router } from "./api/routes.js";
import { errorHandler } from "./utils/errors.js";

const app = express();

app.use(
  cors({
    origin: [env.frontendUrl, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: false,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use("/api", router);

app.get("/", (_req, res) => {
  res.json({
    name: "TRACE",
    tagline: "Tracing thermal anomalies from detection to decision.",
    health: "/api/health",
  });
});

app.use(errorHandler);

const server = app.listen(env.port, () => {
  console.log(`TRACE API listening on http://localhost:${env.port}`);
  console.log(`DEMO_MODE=${env.demoMode}`);
  if (!env.databaseUrl) {
    console.warn("DATABASE_URL is not set. Health checks will report disconnected until .env is configured.");
  }
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${env.port} is already in use. Stop the other TRACE API process and retry.`);
    process.exit(1);
  }
  throw error;
});
