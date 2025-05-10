export const API_CONFIG = {
  BASE_URL: "https://thesis-h7aqe0buf9hncygr.ukwest-01.azurewebsites.net/api",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      ME: "/auth/me",
      REFRESH_TOKEN: "/auth/refresh-token",
    },
    PROFILE: {
      GET: "/profile",
      UPDATE: "/profile",
      CHANGE_PASSWORD: "/profile/password",
      UPLOAD_AVATAR: "/profile/avatar",
    },
    THESIS: {
      LIST: "/theses",
      DETAIL: (id: string) => `/theses/${id}`,
      CREATE: "/theses",
      UPDATE: (id: string) => `/theses/${id}`,
      DELETE: (id: string) => `/theses/${id}`,
      DOCUMENTS: (id: string) => `/theses/${id}/documents`,
    },
    DASHBOARD: {
      STATS: "/dashboard/stats",
      RECENT_THESES: "/dashboard/recent-theses",
      ACTIVITIES: "/dashboard/activities",
      USER_STATS: "/dashboard/user-stats",
      ASSIGNED_STUDENTS: "/dashboard/assigned-students",
      THESIS_PROGRESS: "/dashboard/thesis-progress",
    },
  },
} as const;
