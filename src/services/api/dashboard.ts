import { get } from "../../lib/base-api";
import type { Thesis } from "./thesis";
import type { User } from "./auth";

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
export const getDashboardStats = () => get<DashboardStats>("/dashboard/stats");

// Get recent theses
export const getRecentTheses = (limit = 5) =>
  get<Thesis[]>("/dashboard/recent-theses", { limit });

// Get recent activities
export const getRecentActivities = (limit = 10) =>
  get<RecentActivity[]>("/dashboard/activities", { limit });

// Admin only: Get user statistics
export const getUserStats = () =>
  get<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    usersByRole: { role: string; count: number }[];
  }>("/dashboard/user-stats");

// Teacher only: Get assigned students
export const getAssignedStudents = () =>
  get<User[]>("/dashboard/assigned-students");

// Student only: Get thesis progress
export const getThesisProgress = () =>
  get<{
    currentThesis?: Thesis;
    progress: number;
    nextMilestone?: string;
    dueDates: { title: string; date: string }[];
  }>("/dashboard/thesis-progress");
