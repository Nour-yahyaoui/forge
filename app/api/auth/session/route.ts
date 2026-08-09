// app/api/auth/session/route.ts
import { NextRequest } from "next/server";
import { sql } from "../../../lib/db";
import { successResponse, errorResponse, unauthorizedResponse } from "../../../lib/utils/response";
import { verifyAccessToken } from "../../../lib/auth/jwt";
import { getAccessToken } from "../../../lib/auth/cookies";

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) {
      return unauthorizedResponse();
    }

    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
      return unauthorizedResponse();
    }

    const [user] = await sql`
      SELECT id, email, name, created_at
      FROM users
      WHERE id = ${decoded.userId}
    `;

    if (!user) {
      return unauthorizedResponse();
    }

    return successResponse({ user });
  } catch (error) {
    console.error("Session error:", error);
    return errorResponse("Internal server error", 500);
  }
}