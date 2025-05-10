import { get, post } from "@/lib/base-api";
import { API_CONFIG } from "./config";
import type { UserRole } from "@/store/slices/authSlice";

// Define User type since it's not exported from types.ts
export interface User {
  userId: string;
  name: string;
  email: string;
  faculty: string;
  major: string;
  role: UserRole;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  role: UserRole;
}

/**
 * Authentication API services
 */

// Login user
export const login = (data: LoginRequest) =>
  post<LoginResponse>(
    API_CONFIG.ENDPOINTS.AUTH.LOGIN,
    data as unknown as Record<string, unknown>
  );

// Register new user
export const register = (userData: RegisterRequest) =>
  post<User>(
    API_CONFIG.ENDPOINTS.AUTH.REGISTER,
    userData as unknown as Record<string, unknown>
  );

// Logout user
export const logout = () =>
  post<{ success: boolean }>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);

// Get current user
export const getCurrentUser = () => get<User>(API_CONFIG.ENDPOINTS.AUTH.ME);

// Refresh authentication token
export const refreshToken = () =>
  post<{ token: string }>(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN);
