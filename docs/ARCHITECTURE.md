# TRACE Architecture

TRACE is a single Express API plus a Vite React app. There are no microservices, queues, or containers in the MVP.

```mermaid
flowchart TD
  github[GitHub shared source]
  d1[Developer 1: React + Express]
  d2[Developer 2: React + Express]
  db[(Cloud PostgreSQL + PostGIS)]
  firms[NASA FIRMS / VIIRS]
  osm[OpenStreetMap Overpass]
  s2[Sentinel Hub]
  ui[TRACE Command Center]

  github --> d1
  github --> d2
  d1 --> db
  d2 --> db
  d1 --> firms
  d1 --> osm
  d1 --> s2
  d1 --> ui
```

## Runtime

- Frontend: `http://localhost:5173` (proxies `/api` to Express)
- Backend: `http://localhost:5000`
- Database: shared `DATABASE_URL` only (never localhost for team work)
- Secrets stay on the backend: `DATABASE_URL`, `NASA_FIRMS_MAP_KEY`, Sentinel credentials

## Pipeline

```mermaid
flowchart TD
  A[NASA FIRMS / VIIRS] --> B[Thermal hotspot stored in PostGIS]
  B --> C[OSM geospatial context]
  C --> D[Sentinel-2 if credentials exist]
  D --> E[Historical / persistence]
  E --> F[Probable source attribution]
  F --> G[Abnormality detection]
  G --> H[Risk scoring]
  H --> I[Potential exposure]
  I --> J[TRACE Command Center]
```

## Demo resilience

If FIRMS, Overpass, or Sentinel is unavailable, TRACE still runs:

- `DEMO_MODE=true` or **Switch to Demo Mode** uses `backend/data/demo_firms_chennai.csv`
- Overpass failures fall back to bundled Chennai context features
- Missing Sentinel credentials return `{ available: false }` instead of crashing

## Honesty

TRACE is decision support. It does not confirm fire cause, exact location, or damage. Language in the product is thermal anomaly, probable source, attribution confidence, and potential exposure.
