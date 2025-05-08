import type { User } from "../pages/Admin/UserManagement";
import type { Thesis } from "../pages/Student/ThesisList";
import type { Meeting } from "../pages/Teacher/MeetingApproval";
import type { SubTask, Document } from "../pages/Teacher/ThesisDetail";
import type { RequestData } from "../pages/Teacher/ApproveRequests";

// Standard API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error response
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Auth responses
export interface LoginResponse {
  user: User;
  token: string;
}

// User responses
export type UserResponse = User;
export type UsersResponse = PaginatedResponse<User>;

// Thesis responses
export type ThesisResponse = Thesis;
export type ThesesResponse = PaginatedResponse<Thesis>;

// Meeting responses
export type MeetingResponse = Meeting;
export type MeetingsResponse = PaginatedResponse<Meeting>;

// Task/SubTask responses
export type TaskResponse = SubTask;
export type TasksResponse = PaginatedResponse<SubTask>;

// Document responses
export type DocumentResponse = Document;
export type DocumentsResponse = PaginatedResponse<Document>;

// Registration request responses
export type RequestResponse = RequestData;
export type RequestsResponse = PaginatedResponse<RequestData>;
