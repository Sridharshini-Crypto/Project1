# TRACE database schema

Schema is created only through `backend/db/migrations` and `npm run migrate`.

Assume PostGIS is already available on the shared cloud database.

## Tables

| Table | Role |
| --- | --- |
| `thermal_events` | Normalized FIRMS/VIIRS detections (`GEOGRAPHY(Point, 4326)` + GIST) |
| `geospatial_features` | OSM (and demo) context features |
| `historical_events` | Snapshot of nearby detections used in persistence |
| `satellite_observations` | Sentinel-2 metadata / image reference |
| `classifications` | Probable source attribution |
| `risk_assessments` | Persistence, anomaly, exposure, risk |
| `alerts` | In-dashboard HIGH/CRITICAL notices |
| `schema_migrations` | Applied migration filenames |

## Spatial operations

The API uses PostGIS `ST_DWithin`, `ST_Distance`, `ST_Buffer`, and `ST_Within` on geography so distances are in meters.

## Reproducing schema

```bash
cd backend
npm run migrate
```
