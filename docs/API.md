# TRACE API

Base URL (local): `http://localhost:5000`

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | API + database status |
| GET | `/api/firms/hotspots` | Fetch/store FIRMS hotspots (`region`, `startDate`, `endDate`, `source`, `demo`) |
| GET | `/api/events` | Stored thermal events |
| GET | `/api/events/:id` | Single event |
| GET | `/api/events/:id/context` | OSM geospatial context |
| GET | `/api/events/:id/history` | Historical detections + persistence |
| GET | `/api/events/:id/satellite` | Sentinel-2 context |
| GET | `/api/events/:id/classification` | Probable source attribution |
| GET | `/api/events/:id/risk` | Risk score |
| GET | `/api/events/:id/impact` | Potential exposure (`radiusKm` = 1, 2, or 5) |
| POST | `/api/events/:id/analyze` | Full TRACE pipeline |
| GET | `/api/dashboard/summary` | Metrics, charts, alerts |
| GET | `/api/alerts` | In-dashboard alerts |

Secrets (`DATABASE_URL`, FIRMS map key, Sentinel credentials) stay on the backend.
