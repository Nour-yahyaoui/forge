// lib/auth/rate-limit.ts
// In-memory rate limiter — no external dependencies

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Store rate limit data in memory
const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  windowMs?: number;  // Time window in milliseconds
  maxRequests?: number; // Max requests per window
}

export function rateLimit(
  key: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetIn: number } {
  const { windowMs = 60000, maxRequests = 5 } = options;

  const now = Date.now();
  const entry = store.get(key);

  // If no entry or window expired, create new entry
  if (!entry || now > entry.resetAt) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  // Check if limit exceeded
  if (entry.count >= maxRequests) {
    const resetIn = entry.resetAt - now;
    return { success: false, remaining: 0, resetIn };
  }

  // Increment count
  entry.count++;
  return { success: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now };
}

// Helper to get client IP from request
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}

// Pre-configured rate limiters for auth endpoints
export const authRateLimits = {
  register: (ip: string) => rateLimit(`register:${ip}`, { windowMs: 60000, maxRequests: 3 }),
  login: (ip: string) => rateLimit(`login:${ip}`, { windowMs: 60000, maxRequests: 5 }),
  refresh: (ip: string) => rateLimit(`refresh:${ip}`, { windowMs: 60000, maxRequests: 10 }),
};