// lib/db/index.ts
import { neon, Pool } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL!;

// Create a connection pool
const pool = new Pool({ 
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Use the pool directly
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    console.log(`🔍 Query completed in ${Date.now() - start}ms`);
    return result.rows as T[];
  } catch (error) {
    console.error(`❌ Query failed after ${Date.now() - start}ms:`, error);
    throw error;
  }
}

// Helper for template literals
export function sql<T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]> {
  // Convert template literal to SQL query with parameterized values
  let text = strings[0] || '';
  const params: any[] = [];
  
  for (let i = 0; i < values.length; i++) {
    text += `$${i + 1}` + (strings[i + 1] || '');
    params.push(values[i]);
  }
  
  return query<T>(text, params);
}

// Simple raw query function
export async function sqlRaw<T = any>(text: string, params?: any[]): Promise<T[]> {
  return query<T>(text, params);
}

export async function initDatabase() {
  try {
    const result = await sqlRaw('SELECT NOW() as time');
    console.log(`✅ Database connected successfully at: ${result[0]?.time}`);
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}