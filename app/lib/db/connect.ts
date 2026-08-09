// lib/db/connect.ts
// No retry needed — the pool handles reconnections
// Just export a simple wrapper
export { sql } from "./index";