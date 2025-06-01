import { put } from "@/lib/base-api";
import { API_CONFIG } from "./config";

/**
 * User Profile API services
 */

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
