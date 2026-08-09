// lib/db.ts
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10,
  idleTimeoutMillis: 30000,
});

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}
