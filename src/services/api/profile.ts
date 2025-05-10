import { get, put } from "@/lib/base-api";
import type { User } from "./auth";
import { API_CONFIG } from "./config";

export interface ProfileUpdateRequest {
  fullName?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

/**
 * User Profile API services
 */

// Get user profile
export const getUserProfile = () => get<User>(`${API_CONFIG.BASE_URL}/profile`);

// Update user profile
export const updateUserProfile = (data: ProfileUpdateRequest) =>
  put<User>(
    `${API_CONFIG.BASE_URL}/profile`,
    data as unknown as Record<string, unknown>
  );

// Change password
export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) =>
  put<{ success: boolean }>(
    `${API_CONFIG.BASE_URL}/profile/password`,
    data as unknown as Record<string, unknown>
  );

// Upload profile picture
export const uploadProfilePicture = (formData: FormData) => {
  // Using fetch API directly for file uploads
  return fetch(`${API_CONFIG.BASE_URL}/profile/avatar`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((response) => response.json());
};
