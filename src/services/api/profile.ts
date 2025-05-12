import { get, put } from "@/lib/base-api";
import { API_CONFIG } from "./config";
import { store } from "@/store";

export interface ProfileUpdateRequest {
  name: string;
  majorId: number;
  isNotificationsEnabled: boolean;
}

export interface UserProfileResponse {
  userId: number;
  name: string;
  email: string;
  role: string;
  major: {
    majorId: number;
    majorName: string;
    facultyId: number;
    facultyName: string;
  };
  isNotificationsEnabled: boolean;
}

/**
 * User Profile API services
 */

// Get user profile
export const getUserProfile = (id: number) =>
  get<UserProfileResponse>(API_CONFIG.ENDPOINTS.USER.DETAIL(id));

// Update user profile
export const updateUserProfile = (data: ProfileUpdateRequest) =>
  put<unknown>(
    API_CONFIG.ENDPOINTS.USER.UPDATE,
    data as unknown as Record<string, unknown>
  );

// Change password
export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) =>
  put<{ success: boolean }>(
    API_CONFIG.ENDPOINTS.PROFILE.CHANGE_PASSWORD,
    data as unknown as Record<string, unknown>
  );

// Upload profile picture
export const uploadProfilePicture = (formData: FormData) => {
  // Using fetch API directly for file uploads
  const token = store.getState().auth.token;
  return fetch(API_CONFIG.ENDPOINTS.PROFILE.UPLOAD_AVATAR, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
};
