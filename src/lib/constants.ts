// Pagination
export const DEFAULT_PAGE_SIZE = 5;
export const TABLE_PAGE_SIZE = 10;

// User Roles
export const USER_ROLES = {
  STUDENT: "student",
  INSIDE_LECTURER: "inside lecturer",
  OUTSIDE_LECTURER: "outside lecturer",
  ADMIN: "admin",
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.STUDENT]: "Sinh viên",
  [USER_ROLES.INSIDE_LECTURER]: "Giảng viên nội bộ",
  [USER_ROLES.OUTSIDE_LECTURER]: "Giảng viên khách",
  [USER_ROLES.ADMIN]: "Quản trị viên",
};

export const USER_ROLE_COLORS = {
  [USER_ROLES.STUDENT]: "blue",
  [USER_ROLES.INSIDE_LECTURER]: "green",
  [USER_ROLES.OUTSIDE_LECTURER]: "orange",
  [USER_ROLES.ADMIN]: "red",
};

// Thesis Status
export const THESIS_STATUS = {
  AVAILABLE: "available",
  IN_PROGRESS: "in_progress",
  CANCEL: "cancel",
  LECTURER_REJECT: "lecturer_reject",
  ADMIN_REJECT: "admin_reject",
  ON_HOLD: "on_hold",
  REVOKE: "revoke",
} as const;

export const THESIS_STATUS_LABELS = {
  [THESIS_STATUS.AVAILABLE]: "Đang mở",
  [THESIS_STATUS.IN_PROGRESS]: "Đang thực hiện",
  [THESIS_STATUS.CANCEL]: "Hủy",
  [THESIS_STATUS.LECTURER_REJECT]: "Giảng viên từ chối",
  [THESIS_STATUS.ADMIN_REJECT]: "Quản trị viên từ chối",
  [THESIS_STATUS.REVOKE]: "Hệ thống hủy tư cách",
  [THESIS_STATUS.ON_HOLD]: "Đang chờ duyệt",
} as const;

export const THESIS_STATUS_COLORS = {
  [THESIS_STATUS.AVAILABLE]: "processing",
  [THESIS_STATUS.IN_PROGRESS]: "processing",
  [THESIS_STATUS.CANCEL]: "default",
  [THESIS_STATUS.LECTURER_REJECT]: "warning",
  [THESIS_STATUS.ADMIN_REJECT]: "warning",
  [THESIS_STATUS.ON_HOLD]: "warning",
} as const;

// request status
export const REQUEST_STATUS = {
  IN_PROGRESS: "in_progress",
  CANCEL: "cancel",
  LECTURER_REJECT: "lecturer_reject",
  ADMIN_REJECT: "admin_reject",
  ON_HOLD: "on_hold",
  REVOKE: "revoke",
};

export const REQUEST_STATUS_LABELS = {
  [REQUEST_STATUS.IN_PROGRESS]: "Đang thực hiện",
  [REQUEST_STATUS.CANCEL]: "Hủy",
  [REQUEST_STATUS.LECTURER_REJECT]: "Giảng viên từ chối",
  [REQUEST_STATUS.ADMIN_REJECT]: "Quản trị viên từ chối",
  [REQUEST_STATUS.ON_HOLD]: "Đang chờ duyệt",
  [REQUEST_STATUS.REVOKE]: "Hệ thống hủy tư cách",
}

// Task Status
export const TASK_STATUS = {
  IN_PROGRESS: "in_progress",
  TO_DO: "to_do",
  DONE: "done",
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TO_DO]: "Chưa bắt đầu",
  [TASK_STATUS.IN_PROGRESS]: "Đang thực hiện",
  [TASK_STATUS.DONE]: "Hoàn thành",
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.TO_DO]: "default",
  [TASK_STATUS.IN_PROGRESS]: "processing",
  [TASK_STATUS.DONE]: "success",
};

// Date Formats
export const DATE_FORMAT = "YYYY-MM-DD";
export const TIME_FORMAT = "HH:mm";
export const DATETIME_FORMAT = "YYYY-MM-DD HH:mm";
export const DISPLAY_DATE_FORMAT = "DD/MM/YYYY";
export const DISPLAY_DATETIME_FORMAT = "DD/MM/YYYY HH:mm";

// Routes
export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/",
  USER_MANAGEMENT: "/user-management",
  SYSTEM_NOTIFICATIONS: "/system-notifications",
  SYSTEM_SETTINGS: "/system-settings",
  THESIS_LIST: "/thesis-list",
  THESIS_DETAIL: "/my-thesis",
  TEACHER_LIST: "/teacher-list",
  THESIS_MANAGEMENT: "/thesis-management",
  CREATE_THESIS: "/create-thesis",
  THESIS_DETAIL_TEACHER: "/thesis-detail",
  APPROVE_REQUESTS: "/approve-requests",
};
