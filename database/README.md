# TRACE Cloud PostgreSQL + PostGIS

All developers connect to the **same shared cloud database**.

Do **not** run PostgreSQL on localhost for this project.

## Requirements

- Managed PostgreSQL (Supabase, Neon, RDS, or similar)
- PostGIS enabled
- A single `DATABASE_URL` shared privately with the team (never committed)

## Enable PostGIS

In the cloud SQL editor:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

Then from `/backend`:

```bash
copy .env.example .env
# paste DATABASE_URL into .env
npm run migrate
```

Migrations are the source of truth for tables. Do not create schema by hand in pgAdmin.

## Connection rules

- Backend only. Never send `DATABASE_URL` to React.
- Fail if `DATABASE_URL` is missing.
- Do not auto-create databases from Node.
