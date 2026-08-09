// app/api/auth/login/route.ts
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "../../../lib/db";
import { loginSchema } from "../../../lib/validators/auth";
import { successResponse, errorResponse } from "../../../lib/utils/response";
import { generateAccessToken, generateRefreshToken } from "../../../lib/auth/jwt";
import { setAuthCookies } from "../../../lib/auth/cookies";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const { email, password } = result.data;

    // Get user
    const [user] = await sql`
      SELECT id, email, name, password_hash
      FROM users
      WHERE email = ${email}
    `;

    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return errorResponse("Invalid email or password", 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, email: user.email, name: user.name });
    const refreshToken = generateRefreshToken({ userId: user.id });

    // Store refresh token (delete old ones first)
    await sql`DELETE FROM refresh_tokens WHERE user_id = ${user.id}`;
    await sql`
      INSERT INTO refresh_tokens (user_id, token)
      VALUES (${user.id}, ${refreshToken})
    `;

    setAuthCookies(accessToken, refreshToken);

    return successResponse({
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Internal server error", 500);
  }
}