import dns from "node:dns";
import { promises as dnsPromises } from "node:dns";
import pg from "pg";
import { env, getDatabaseConfig, type DatabaseConfig } from "./env.js";

dns.setDefaultResultOrder("verbatim");

const { Pool, Client } = pg;

let pool: pg.Pool | null = null;
let poolReady: Promise<pg.Pool> | null = null;

type Target = {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
  ssl: false | { rejectUnauthorized: boolean; servername: string };
  connectionString?: string;
  label: string;
};

const POOLER_REGIONS = [
  "ap-northeast-1",
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "ap-east-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "eu-west-1",
  "eu-west-2",
  "eu-central-1",
  "eu-north-1",
  "ca-central-1",
  "sa-east-1",
  "me-central-1",
];

function supabaseRef(host: string): string | null {
  const match = host.match(/^db\.([a-z0-9]+)\.supabase\.co$/i);
  return match ? match[1] : null;
}

async function ipv4Host(hostname: string): Promise<string | null> {
  try {
    const res = await dnsPromises.lookup(hostname, { family: 4 });
    return res.address ?? null;
  } catch {
    try {
      const records = await dnsPromises.resolve4(hostname);
      return records[0] ?? null;
    } catch {
      return null;
    }
  }
}

async function probe(target: Target): Promise<string | null> {
  const client = new Client(
    target.connectionString
      ? {
          connectionString: target.connectionString,
          ssl: target.ssl,
          connectionTimeoutMillis: 6000,
        }
      : {
          user: target.user,
          password: target.password,
          host: target.host,
          port: target.port,
          database: target.database,
          ssl: target.ssl,
          connectionTimeoutMillis: 6000,
        }
  );
  try {
    await client.connect();
    await client.query("SELECT 1");
    await client.end();
    return null;
  } catch (error) {
    try {
      await client.end();
    } catch {
      /* ignore */
    }
    return error instanceof Error ? error.message.split("\n")[0] : "connection failed";
  }
}

function encodePassword(password: string): string {
  return encodeURIComponent(password);
}

function poolerTargets(config: DatabaseConfig): Target[] {
  const ref = supabaseRef(config.host);
  if (!ref) return [];
  const encoded = encodePassword(config.password);
  const targets: Target[] = [];
  for (const region of POOLER_REGIONS) {
    for (const n of [0, 1, 2]) {
      const host = `aws-${n}-${region}.pooler.supabase.com`;
      for (const port of [6543, 5432]) {
        targets.push({
          user: `${config.user}.${ref}`,
          password: config.password,
          host,
          port,
          database: config.database,
          ssl: { rejectUnauthorized: false, servername: host },
          label: `${host}:${port} user.ref`,
        });
        targets.push({
          user: config.user,
          password: config.password,
          host,
          port,
          database: config.database,
          ssl: { rejectUnauthorized: false, servername: `${ref}.supabase.co` },
          connectionString: `postgresql://${config.user}:${encoded}@${host}:${port}/${config.database}?options=reference%3D${ref}`,
          label: `${host}:${port} options+sni`,
        });
      }
    }
  }
  return targets;
}

async function pickTarget(config: DatabaseConfig): Promise<Target> {
  const local = config.host.includes("localhost");
  if (local) {
    const localTarget: Target = { ...config, ssl: false, label: "localhost" };
    const reason = await probe(localTarget);
    if (reason) throw new Error(reason);
    return localTarget;
  }

  const v4 = await ipv4Host(config.host);
  if (v4) {
    const direct: Target = {
      ...config,
      host: v4,
      ssl: { rejectUnauthorized: false, servername: config.host },
      label: `direct IPv4 ${config.host}`,
    };
    const reason = await probe(direct);
    if (!reason) return direct;
    console.log(`direct IPv4 failed: ${reason}`);
  }

  const candidates = poolerTargets(config);
  const uniqueHosts = [...new Set(candidates.map((target) => target.host))];
  const reachable = new Set<string>();
  await Promise.all(
    uniqueHosts.map(async (host) => {
      if (await ipv4Host(host)) reachable.add(host);
    })
  );

  const live = candidates.filter((target) => reachable.has(target.host));
  const concurrency = 6;
  let halt = false;
  let winner: Target | null = null;
  const errors = new Set<string>();

  for (let i = 0; i < live.length && !halt; i += concurrency) {
    const batch = live.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async (target) => {
        if (halt) return;
        const reason = await probe(target);
        if (!reason) {
          winner = target;
          halt = true;
          return;
        }
        errors.add(reason.replace(target.host, "pooler"));
      })
    );
    void results;
    if (winner) break;
  }

  if (winner) {
    const found = winner as Target;
    console.log(`Connected via ${found.label}`);
    return found;
  }

  const sample = [...errors].slice(0, 5).join(" | ");
  throw new Error(
    `Could not reach the shared PostgreSQL database over IPv4. Direct db.*.supabase.co is IPv6-only on this network. Pooler replies: ${sample}. Open Supabase → Connect → Session pooler and paste that URI into DATABASE_URL (username must be postgres.<project-ref>).`
  );
}

export async function getPool(): Promise<pg.Pool> {
  if (pool) return pool;
  if (!poolReady) {
    poolReady = (async () => {
      const config = getDatabaseConfig();
      const target = await pickTarget(config);
      pool = new Pool(
        target.connectionString
          ? {
              connectionString: target.connectionString,
              ssl: target.ssl,
              max: 10,
              connectionTimeoutMillis: 20000,
            }
          : {
              user: target.user,
              password: target.password,
              host: target.host,
              port: target.port,
              database: target.database,
              ssl: target.ssl,
              max: 10,
              connectionTimeoutMillis: 20000,
            }
      );
      return pool;
    })().catch((error) => {
      poolReady = null;
      throw error;
    });
  }
  return poolReady;
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<pg.QueryResult<T>> {
  const client = await getPool();
  return client.query<T>(text, params);
}

export async function checkDatabase(): Promise<{ ok: boolean; postgis?: string; error?: string }> {
  if (!env.databaseUrl) {
    return { ok: false, error: "DATABASE_URL is not configured" };
  }
  try {
    const result = await query<{ extversion: string }>(
      `SELECT extversion FROM pg_extension WHERE extname = 'postgis'`
    );
    return { ok: true, postgis: result.rows[0]?.extversion ?? "unknown" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    return { ok: false, error: message };
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    poolReady = null;
  }
}
