import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

export const query = (sql, params) => pool.query(sql, params);

export function camel(row) {
  if (!row) return row;
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    out[key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = value;
  }
  return out;
}

export const camelAll = (rows = []) => rows.map(camel);

export async function tx(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

export async function initDb() {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const schema = fs.readFileSync(path.join(dir, 'schema.sql'), 'utf8');

  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      await pool.query('select 1');
      break;
    } catch (err) {
      if (attempt === 29) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  await pool.query(schema);
}
