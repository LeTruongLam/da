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

type CurrentRequestType = {
  request_id: number;
  thesis_id: number;
  thesisTitle: string;
  lecturerId: number;
  lecturerName: string;
  lecturerCode: string;
  status: string;
};

export type UserByIdResponse = {
  user_id: number;
  name: string;
  code: string;
  email: string;
  semester: number;
  year: number;
  isRevoke: boolean;
  revoke_reason: string | null;
  createdTheses: {
    thesis_id: number;
    title: string;
    description: string;
    status: string;
    create_by: number;
    creator_name: string;
  }[];
  currentRequest: CurrentRequestType | null | CurrentRequestType[];
  tasks: {
    task_id: number;
    task_name: string;
    description: string;
    due_date: string;
    status: string;
  }[];
};

export const getUserById = (id: number) =>
  get<UserByIdResponse>(API_CONFIG.ENDPOINTS.USER.BY_ID(id));

export const revokeUserById = (id: number) =>
  post<unknown>(API_CONFIG.ENDPOINTS.USER.IS_REVOKE(id));

export type CreateUserRequest = {
  email: string;
  password: string;
  name: string;
  code: string;
  isRevoke: boolean;
  revoke_reason: string;
  semester: number;
  year: number;
  role_id: number;
};

export const createUser = (data: CreateUserRequest) =>
  post<LoginResponse>(
    API_CONFIG.ENDPOINTS.USER.CREATE_USER,
    data as unknown as Record<string, unknown>
  );

export const userRevoke = (id: number) =>
  post<unknown>(API_CONFIG.ENDPOINTS.USER.IS_REVOKE(id));

export const importUsersExcel = (data: string) =>
  post<unknown>(
    API_CONFIG.ENDPOINTS.USER.IMPORT_USERS_FROM_EXCEL,
    JSON.stringify(data) as unknown as Record<string, unknown>
  );
