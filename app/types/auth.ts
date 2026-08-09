// types/auth.ts
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

export interface JwtPayload {
  userId: number;
  email: string;
  name: string;
  exp?: number;
  iat?: number;
}

export interface RefreshTokenPayload {
  userId: number;
  exp?: number;
  iat?: number;
}

export interface AuthResponse {
  user: Omit<User, "password_hash">;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}