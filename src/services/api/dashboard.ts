import { get } from "@/lib/base-api";
import type { Thesis } from "./thesis";
import type { User } from "./auth";
import { API_CONFIG } from "./config";

export interface DashboardStats {
  totalTheses: number;
  pendingTheses: number;
  completedTheses: number;
  totalStudents: number;
  totalTeachers: number;
}

export interface RecentActivity {
  id: string;
  type:
    | "thesis_created"
    | "thesis_updated"
    | "document_uploaded"
    | "status_changed";
  thesisId: string;
  thesisTitle: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

/**
 * Dashboard API services
 */

// Get dashboard statistics
export const getDashboardStats = () =>
  get<DashboardStats>(API_CONFIG.ENDPOINTS.DASHBOARD.STATS);

// Get recent theses
export const getRecentTheses = (limit = 5) =>
  get<Thesis[]>(API_CONFIG.ENDPOINTS.DASHBOARD.RECENT_THESES, { limit });

// Get recent activities
export const getRecentActivities = (limit = 10) =>
  get<RecentActivity[]>(API_CONFIG.ENDPOINTS.DASHBOARD.ACTIVITIES, { limit });

// Admin only: Get user statistics
export const getUserStats = () =>
  get<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    usersByRole: { role: string; count: number }[];
  }>(API_CONFIG.ENDPOINTS.DASHBOARD.USER_STATS);

// Teacher only: Get assigned students
export const getAssignedStudents = () =>
  get<User[]>(API_CONFIG.ENDPOINTS.DASHBOARD.ASSIGNED_STUDENTS);

// Student only: Get thesis progress
export const getThesisProgress = () =>
  get<{
    currentThesis?: Thesis;
    progress: number;
    nextMilestone?: string;
    dueDates: { title: string; date: string }[];
  }>(API_CONFIG.ENDPOINTS.DASHBOARD.THESIS_PROGRESS);
