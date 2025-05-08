// Common pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Common sorting and filtering parameters
export interface SortFilterParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filter?: Record<string, string | number | boolean | string[]>;
}

// User related parameters
export interface UserParams extends PaginationParams, SortFilterParams {
  role?: string;
  status?: string;
}

// Thesis related parameters
export interface ThesisParams extends PaginationParams, SortFilterParams {
  studentId?: string;
  teacherId?: string;
  status?: string;
  major?: string;
}

// Thesis registration parameters
export interface ThesisRegistrationParams {
  thesisId: string;
  studentId: string;
  message?: string;
}

// Meeting related parameters
export interface MeetingParams extends PaginationParams {
  thesisId?: string;
  teacherId?: string;
  studentId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Document related parameters
export interface DocumentParams extends PaginationParams {
  thesisId?: string;
  uploadedBy?: string;
  type?: string;
}

// Task related parameters
export interface TaskParams extends PaginationParams {
  thesisId?: string;
  status?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
}
