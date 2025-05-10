// Pagination
export const DEFAULT_PAGE_SIZE = 5;
export const TABLE_PAGE_SIZE = 10;

// User Roles
export const USER_ROLES = {
  STUDENT: "Student",
  LECTURER: "Lecturer",
  ADMIN: "Admin",
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.STUDENT]: "Sinh viên",
  [USER_ROLES.LECTURER]: "Giảng viên",
  [USER_ROLES.ADMIN]: "Quản trị viên",
};

export const USER_ROLE_COLORS = {
  [USER_ROLES.STUDENT]: "blue",
  [USER_ROLES.LECTURER]: "green",
  [USER_ROLES.ADMIN]: "red",
};

// Thesis Status
export const THESIS_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  DELAYED: "delayed",
  COMPLETED: "completed",
  OPEN: "Đang mở",
  CLOSED: "Đã đóng",
  FINISHED: "Đã hoàn thành",
};

export const THESIS_STATUS_LABELS = {
  [THESIS_STATUS.PENDING]: "Chờ duyệt",
  [THESIS_STATUS.IN_PROGRESS]: "Đang thực hiện",
  [THESIS_STATUS.DELAYED]: "Trễ hạn",
  [THESIS_STATUS.COMPLETED]: "Hoàn thành",
  [THESIS_STATUS.OPEN]: "Đang mở",
  [THESIS_STATUS.CLOSED]: "Đã đóng",
  [THESIS_STATUS.FINISHED]: "Đã hoàn thành",
};

export const THESIS_STATUS_COLORS = {
  [THESIS_STATUS.PENDING]: "default",
  [THESIS_STATUS.IN_PROGRESS]: "processing",
  [THESIS_STATUS.DELAYED]: "error",
  [THESIS_STATUS.COMPLETED]: "success",
  [THESIS_STATUS.OPEN]: "green",
  [THESIS_STATUS.CLOSED]: "red",
  [THESIS_STATUS.FINISHED]: "purple",
};

// Task Status
export const TASK_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  LATE: "late",
  UPCOMING: "upcoming",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.NOT_STARTED]: "Chưa bắt đầu",
  [TASK_STATUS.IN_PROGRESS]: "Đang thực hiện",
  [TASK_STATUS.COMPLETED]: "Hoàn thành",
  [TASK_STATUS.LATE]: "Trễ hạn",
  [TASK_STATUS.UPCOMING]: "Sắp tới",
  [TASK_STATUS.PENDING]: "Chờ xác nhận",
  [TASK_STATUS.APPROVED]: "Đã xác nhận",
  [TASK_STATUS.REJECTED]: "Từ chối",
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.NOT_STARTED]: "default",
  [TASK_STATUS.IN_PROGRESS]: "processing",
  [TASK_STATUS.COMPLETED]: "success",
  [TASK_STATUS.LATE]: "error",
  [TASK_STATUS.UPCOMING]: "blue",
  [TASK_STATUS.PENDING]: "orange",
  [TASK_STATUS.APPROVED]: "cyan",
  [TASK_STATUS.REJECTED]: "red",
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
  MEETING_APPROVAL: "/meeting-approval",
};
