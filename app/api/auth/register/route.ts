// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "../../../lib/db";
import { registerSchema } from "../../../lib/validators/auth";
import { authRateLimits, getClientIp } from "../../../lib/auth/rate-limit";
import { generateAccessToken, generateRefreshToken } from "../../../lib/auth/jwt";
import { setAuthCookies } from "../../../lib/auth/cookies";

export async function POST(req: NextRequest) {
  try {
    console.log("📥 Register request received");
    
    const ip = getClientIp(req);
    console.log("📍 IP:", ip);
    
    const rateLimitResult = authRateLimits.register(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    console.log("📦 Body:", body);

    const result = registerSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.errors[0];
      console.log("❌ Validation failed:", firstError.message);
      return NextResponse.json(
        { success: false, error: firstError.message },
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;
    console.log("✅ Validated:", { email, name });

    // Check if user exists
    console.log("🔍 Checking if user exists...");
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      console.log("❌ User already exists");
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    console.log("📝 Creating user...");
    const [user] = await sql`
      INSERT INTO users (email, password, name)
      VALUES (${email}, ${passwordHash}, ${name})
      RETURNING id, email, name, created_at
    `;
    console.log("✅ User created:", user);

    // Generate tokens
    console.log("🔑 Generating tokens...");
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    const refreshToken = generateRefreshToken({ userId: user.id });

    // Store refresh token
    console.log("💾 Storing refresh token...");
    await sql`
      INSERT INTO refresh_tokens (user_id, token)
      VALUES (${user.id}, ${refreshToken})
    `;

    setAuthCookies(accessToken, refreshToken);

    console.log("✅ Registration complete");
    return NextResponse.json(
      { success: true, data: { user, accessToken, refreshToken } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Registration error:", error);
    console.error("❌ Error stack:", error.stack);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}