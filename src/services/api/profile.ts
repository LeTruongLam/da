import { get, put } from "../../lib/api";
import type { User } from "./auth";

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
export const getUserProfile = () => get<User>("/profile");

// Update user profile
export const updateUserProfile = (data: ProfileUpdateRequest) =>
  put<User>("/profile", data as unknown as Record<string, unknown>);

// Change password
export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) =>
  put<{ success: boolean }>(
    "/profile/password",
    data as unknown as Record<string, unknown>
  );

// Upload profile picture
export const uploadProfilePicture = (formData: FormData) => {
  // Using fetch API directly for file uploads
  return fetch(
    `${
      import.meta.env.VITE_API_URL || "http://localhost:3000/api"
    }/profile/avatar`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  ).then((response) => response.json());
};
