// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import { authRateLimits, getClientIp } from "../../../lib/auth/rate-limit";
import { successResponse, errorResponse } from "../../../lib/utils/response";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../../../lib/auth/jwt";
import { setAuthCookies, getRefreshToken } from "../../../lib/auth/cookies";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitResult = authRateLimits.refresh(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return errorResponse("Refresh token required", 400);
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return errorResponse("Invalid refresh token", 401);
    }

    const [stored] = await sql`
      SELECT user_id FROM refresh_tokens WHERE token = ${refreshToken}
    `;

    if (!stored) {
      return errorResponse("Invalid refresh token", 401);
    }

    const [user] = await sql`
      SELECT id, email, name FROM users WHERE id = ${stored.user_id}
    `;

    if (!user) {
      return errorResponse("User not found", 404);
    }

    await sql`DELETE FROM refresh_tokens WHERE token = ${refreshToken}`;

    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    const newRefreshToken = generateRefreshToken({ userId: user.id });

    await sql`
      INSERT INTO refresh_tokens (user_id, token)
      VALUES (${user.id}, ${newRefreshToken})
    `;

    setAuthCookies(newAccessToken, newRefreshToken);

    return successResponse({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Refresh error:", error);
    return errorResponse("Internal server error", 500);
  }
}