// lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { query } from "./db";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const isProduction = process.env.NODE_ENV === "production";

// ─── JWT ──────────────────────────────────────────────
export function generateAccessToken(payload: { userId: number; email: string; name: string }) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(payload: { userId: number }) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_SECRET) as { userId: number; email: string; name: string };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { userId: number };
  } catch {
    return null;
  }
}

// ─── COOKIES ──────────────────────────────────────────
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 15 * 60,
    path: "/",
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value;
}

// ─── STORE REFRESH TOKEN ────────────────────────────
export async function storeRefreshToken(userId: number, token: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );
}

export async function deleteRefreshToken(token: string) {
  await query(`DELETE FROM refresh_tokens WHERE token = $1`, [token]);
}

export async function getRefreshTokenFromDB(token: string) {
  const rows = await query(
    `SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()`,
    [token]
  );
  return rows[0] || null;
}

// ─── RATE LIMIT ──────────────────────────────────────
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, maxRequests: number = 5, windowMs: number = 60000) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: maxRequests - entry.count };
}