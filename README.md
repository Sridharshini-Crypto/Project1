# TRACE

**Thermal Risk Attribution & Classification Engine**

> Tracing thermal anomalies from detection to decision.

TRACE is a Smart India Hackathon geospatial intelligence prototype. NASA FIRMS/VIIRS can report that a thermal anomaly exists. TRACE adds context: what it is likely to be, whether it is persistent or abnormal, what sits around it, how risky it is, and which assets could be affected.

This is **decision support**, not ground truth. TRACE does **not** claim exact fire location, confirmed cause, 100% accurate classification, or predicted damage.

## Architecture

```mermaid
flowchart LR
  subgraph devs [Team machines]
    FE[React Vite localhost:5173]
    BE[Express localhost:5000]
  end
  GH[GitHub]
  DB[(Shared cloud PostgreSQL + PostGIS)]
  FIRMS[NASA FIRMS]
  OSM[Overpass OSM]
  S2[Sentinel Hub]

  GH --> FE
  GH --> BE
  FE -->|/api proxy| BE
  BE --> DB
  BE --> FIRMS
  BE --> OSM
  BE --> S2
```

```mermaid
flowchart TD
  A[NASA FIRMS / VIIRS] --> B[Thermal hotspot]
  B --> C[OSM geospatial context]
  C --> D[Sentinel-2 if credentials exist]
  D --> E[Historical / persistence]
  E --> F[Probable source attribution]
  F --> G[Abnormality detection]
  G --> H[Risk scoring]
  H --> I[Potential exposure]
  I --> J[TRACE Command Center]
```

Every developer runs React and Node locally. Everyone uses the **same** `DATABASE_URL` for the shared cloud database. The frontend never receives database credentials, the NASA FIRMS map key, or Sentinel secrets.

## Technology stack

| Layer | Stack |
| --- | --- |
| Frontend | React, Vite, TypeScript, Tailwind CSS, React-Leaflet, Recharts, Axios, Lucide |
| Backend | Node.js, Express, TypeScript, Axios, pg, Turf.js |
| Database | Cloud PostgreSQL + PostGIS |

## Team setup

### 1. Clone

```bash
git clone <repository-url>
cd trace
```

### 2. Backend environment

```bash
cd backend
copy .env.example .env
```

On macOS/Linux: `cp .env.example .env`

Edit `backend/.env`. Required for a working map:

```
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
NASA_FIRMS_MAP_KEY=
SENTINEL_CLIENT_ID=
SENTINEL_CLIENT_SECRET=
DEMO_MODE=true
FRONTEND_URL=http://localhost:5173
```

- Never commit `.env`.
- Never put `DATABASE_URL` in the React app.
- Do not use `localhost` PostgreSQL for this project unless you are experimenting alone. The team architecture is one shared cloud database.

### 3. Install backend

```bash
cd backend
npm install
```

### 4. Enable PostGIS (once, on the shared database)

In the provider SQL editor (Supabase, Neon, etc.):

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### 5. Run migrations

```bash
cd backend
npm run migrate
```

This applies pending SQL files in `backend/db/migrations`.

### 6. Start backend

```bash
cd backend
npm run dev
```

API: `http://localhost:5000`  
Health: `http://localhost:5000/api/health`

### 7. Install and start frontend

```bash
cd frontend
npm install
npm run dev
```

Command Center: `http://localhost:5173`

Vite proxies `/api` to the Express server.

## Demo mode vs live mode

| `DEMO_MODE` | Data |
| --- | --- |
| `true` (default) | Bundled Chennai FIRMS-like sample (`backend/data/demo_firms_chennai.csv`). UI shows **DEMO DATA**. |
| `false` | Real NASA FIRMS Area API. Requires `NASA_FIRMS_MAP_KEY`. UI shows **LIVE DATA**. |

The dashboard never pretends sample points are live satellite detections.

If live FIRMS fails, use **Switch to Demo Mode** in the header. The full TRACE pipeline still runs in demo mode (OSM may fall back to bundled Chennai context if Overpass is rate-limited; Sentinel-2 returns a graceful “not configured” response if credentials are missing).

### NASA FIRMS

1. Request a map key from [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/api/area/).
2. Set `NASA_FIRMS_MAP_KEY` in `backend/.env` only.
3. Set `DEMO_MODE=false`.
4. Default region is Chennai, Tamil Nadu (`west,south,east,north` in `src/config/regions.ts`).

### Sentinel Hub (optional)

Set `SENTINEL_CLIENT_ID` and `SENTINEL_CLIENT_SECRET`. If they are absent, `GET /api/events/:id/satellite` returns:

```json
{ "available": false, "reason": "Sentinel-2 credentials are not configured" }
```

NDVI is contextual evidence only. It does not identify fire.

### OpenStreetMap

The backend queries Overpass for industry, vegetation, settlements, transport, hospitals, and other infrastructure within 5 km (configurable). Nearby OSM features **do not prove** the cause of a thermal anomaly.

## API

See [docs/API.md](docs/API.md).

Health example:

```json
{
  "status": "ok",
  "database": "connected",
  "environment": "development"
}
```

Full analysis: `POST /api/events/:id/analyze`

## Database

See [database/README.md](database/README.md) and [docs/DATABASE.md](docs/DATABASE.md).

## Tests

```bash
cd backend
npm test
```

Covers FIRMS CSV parsing, coordinate validation, persistence, attribution, risk, and DATABASE_URL configuration rules.

## Scientific limitations

- VIIRS/FIRMS detections have spatial uncertainty (often hundreds of meters to >1 km). TRACE treats them as **thermal anomalies**, not exact fire perimeters.
- Source classes are **probable source attribution**, not confirmed cause.
- Risk is a transparent weighted score, not a physical fire-spread model.
- **Potential exposure** lists nearby assets inside a radius. It is not predicted damage.
- Ground verification is required before operational decisions.

## Project layout

```
trace/
  frontend/     React Command Center
  backend/      Express API, migrations, demo CSV
  database/     Cloud DB notes
  docs/         Architecture and API
```

## Commands cheat sheet

```bash
# backend
cd backend
npm install
copy .env.example .env
npm run migrate
npm run dev
npm test

# frontend
cd frontend
npm install
npm run dev
```
