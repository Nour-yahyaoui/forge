// lib/utils/response.ts
import { NextResponse } from "next/server";
import { ApiResponse } from "../../types/auth";

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400, code?: string): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: message,
    code,
  };
  return NextResponse.json(response, { status });
}

export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: "Too many requests, please try again later" },
    { status: 429 }
  );
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  );
}