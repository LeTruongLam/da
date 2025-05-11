export const API_CONFIG = {
  BASE_URL: "https://thesis-h7aqe0buf9hncygr.ukwest-01.azurewebsites.net/api",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      ME: "/auth/me",
      REFRESH_TOKEN: "/auth/refresh-token",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
    },
    PROFILE: {
      GET: "/profile",
      UPDATE: "/profile",
      CHANGE_PASSWORD: "/profile/password",
      UPLOAD_AVATAR: "/profile/avatar",
    },
    USER: {
      LIST: "/users",
      DETAIL: (id: number) => `/users/${id}`,
      UPDATE: (id: string) => `/users/${id}`,
    },
    THESIS: {
      LIST: "/theses",
      MY_THESES: "/users/my-thesis",
      DETAIL: (id: number) => `/theses/${id}`,
      CREATE: "/theses",
      UPDATE: (id: string) => `/theses/${id}`,
      DELETE: (id: string) => `/theses/${id}`,
      DOCUMENTS: (thesisId: string) => `/theses/${thesisId}/documents`,
    },
    TEACHER: {
      LIST: "/users/lectures",
      DETAIL: (id: string) => `/teachers/${id}`,
    },
    DASHBOARD: {
      STATS: "/dashboard/stats",
      RECENT_THESES: "/dashboard/recent-theses",
      ACTIVITIES: "/dashboard/activities",
      USER_STATS: "/dashboard/user-stats",
      ASSIGNED_STUDENTS: "/dashboard/assigned-students",
      THESIS_PROGRESS: "/dashboard/thesis-progress",
    },
    MAJOR: {
      LIST: "/majors",
      DETAIL: (id: number) => `/majors/${id}`,
      CREATE: "/majors",
      UPDATE: (id: number) => `/majors/${id}`,
      DELETE: (id: number) => `/majors/${id}`,
    },
  },
} as const;
