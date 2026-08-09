// types/auth.ts
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  accessToken: string;
  refreshToken: string;
}