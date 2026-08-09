// app/api/auth/logout/route.ts
import { NextRequest } from "next/server";
import { sql } from "../../../lib/db";
import { successResponse, errorResponse } from "../../../lib/utils/response";
import { clearAuthCookies, getRefreshToken } from "../../../lib/auth/cookies";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      await sql`DELETE FROM refresh_tokens WHERE token = ${refreshToken}`;
    }

    clearAuthCookies();

    return successResponse({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse("Internal server error", 500);
  }
}