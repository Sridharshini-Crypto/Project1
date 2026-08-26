import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "../config/env.js";
import { closePool, query } from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, "../../db/migrations");

async function migrate() {
  if (!env.databaseUrl) {
    console.error("DATABASE_URL is missing. Set it in backend/.env before running migrations.");
    process.exit(1);
  }

  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const applied = await query<{ filename: string }>("SELECT filename FROM schema_migrations");
  const appliedSet = new Set(applied.rows.map((row) => row.filename));

  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`skip  ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    console.log(`apply ${file}`);
    await query(sql);
    await query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
  }

  console.log("Migrations complete.");
  await closePool();
}

migrate().catch(async (error) => {
  console.error("Migration failed:", error instanceof Error ? error.message : error);
  await closePool();
  process.exit(1);
});
