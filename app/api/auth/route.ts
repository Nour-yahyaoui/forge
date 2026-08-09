// app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  storeRefreshToken,
  deleteRefreshToken,
  getRefreshTokenFromDB,
  getRefreshToken,
  rateLimit,
} from "@/lib/auth";

const isProduction = process.env.NODE_ENV === "production";

// ─── LOGIN ────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limit = rateLimit(`login:${ip}`, 5, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: "Too many attempts" },
        { status: 429 }
      );
    }

    const [user] = await query(
      `SELECT id, email, name, password FROM users WHERE email = $1`,
      [email]
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [user.id]);
    await storeRefreshToken(user.id, refreshToken);

    const response = NextResponse.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        accessToken,
        refreshToken,
      },
    });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// ─── REGISTER ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Email, password, and name required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limit = rateLimit(`register:${ip}`, 3, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    const existing = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [user] = await query(
      `INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at`,
      [email, passwordHash, name]
    );

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await storeRefreshToken(user.id, refreshToken);

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at },
          accessToken,
          refreshToken,
        },
      },
      { status: 201 }
    );

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// ─── REFRESH ──────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "Refresh token required" },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limit = rateLimit(`refresh:${ip}`, 10, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const stored = await getRefreshTokenFromDB(refreshToken);
    if (!stored) {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const [user] = await query(
      `SELECT id, email, name FROM users WHERE id = $1`,
      [stored.user_id]
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    await deleteRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    const newRefreshToken = generateRefreshToken({ userId: user.id });

    await storeRefreshToken(user.id, newRefreshToken);

    const response = NextResponse.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: { id: user.id, email: user.email, name: user.name },
      },
    });

    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── LOGOUT ────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
    }

    const response = NextResponse.json({
      success: true,
      data: { message: "Logged out" },
    });

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── SESSION ──────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [user] = await query(
      `SELECT id, email, name, created_at FROM users WHERE id = $1`,
      [decoded.userId]
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}