import { get, post } from "../../lib/api";

// Define User type since it's not exported from types.ts
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "student" | "teacher" | "admin";
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  role: "student" | "teacher" | "admin";
}

/**
 * Authentication API services
 */

// Login user
export const login = (credentials: LoginRequest) =>
  post<LoginResponse>(
    "/auth/login",
    credentials as unknown as Record<string, unknown>
  );

// Register new user
export const register = (userData: RegisterRequest) =>
  post<User>("/auth/register", userData as unknown as Record<string, unknown>);

// Logout user
export const logout = () => post<{ success: boolean }>("/auth/logout");

// Get current user
export const getCurrentUser = () => get<User>("/auth/me");

// Refresh authentication token
export const refreshToken = () =>
  post<{ token: string }>("/auth/refresh-token");
