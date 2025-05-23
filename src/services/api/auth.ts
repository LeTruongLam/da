import { get, post } from "@/lib/base-api";
import { API_CONFIG } from "./config";
import type { User } from "@/store/slices/authSlice";

// Define User type since it's not exported from types.ts

export interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  majorId: number;
}

export interface forgotPasswordRequest {
  newPassword: string;
  token: string;
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
export const register = (data: RegisterData) =>
  post<LoginResponse>(
    API_CONFIG.ENDPOINTS.AUTH.REGISTER,
    data as unknown as Record<string, unknown>
  );

// Logout user
export const logout = () =>
  post<{ success: boolean }>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);

// Get current user
export const getCurrentUser = () => get<User>(API_CONFIG.ENDPOINTS.AUTH.ME);

// Refresh authentication token
export const refreshToken = () =>
  post<{ token: string }>(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN);

// Forgot password
export const forgotPassword = (email: string) =>
  post<{ message: string }>(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
    email,
  });

// Reset password
export const resetPassword = async (token: string, newPassword: string) =>
  await post<unknown>(
    `${API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD}?${new URLSearchParams({
      token,
      newPassword,
    }).toString()}`
  );
