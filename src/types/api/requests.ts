import type { UserRole } from "../../store/slices/authSlice";
import type { MeetingFormValues } from "../pages/Teacher/ThesisDetail";

// Auth requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

// User requests
export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
  password?: string;
}

export interface ResetPasswordRequest {
  userId: string;
  newPassword: string;
}

// Thesis requests
export interface CreateThesisRequest {
  title: string;
  description: string;
  major: string;
  deadline: string;
  requirements: string;
  objectives: string;
}

export interface UpdateThesisRequest {
  title?: string;
  description?: string;
  major?: string;
  deadline?: string;
  requirements?: string;
  objectives?: string;
  status?: string;
}

// Thesis registration requests
export interface RegisterThesisRequest {
  thesisId: string;
  studentId: string;
  message: string;
}

export interface RespondToRegistrationRequest {
  requestId: string;
  status: "approved" | "rejected";
  feedback?: string;
}

// Meeting requests
export interface CreateMeetingRequest
  extends Omit<MeetingFormValues, "meetingDate" | "meetingTime"> {
  meetingDate: string;
  meetingTime: string;
  thesisId: string;
  teacherId: string;
  studentId: string;
}

export interface UpdateMeetingRequest {
  status?: "approved" | "rejected" | "cancelled";
  link?: string;
  feedback?: string;
}

// Task/Subtask requests
export interface CreateTaskRequest {
  name: string;
  description: string;
  startDate: string;
  deadline: string;
  thesisId: string;
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  startDate?: string;
  deadline?: string;
  status?: string;
}

export interface SubmitTaskRequest {
  taskId: string;
  note?: string;
  files?: {
    name: string;
    content: string; // base64 encoded content
    type: string;
  }[];
}

export interface EvaluateTaskRequest {
  taskId: string;
  score: number;
  feedback: string;
}

// Document requests
export interface UploadDocumentRequest {
  thesisId: string;
  name: string;
  type: string;
  content: string; // base64 encoded content
  description?: string;
}

// Student evaluation
export interface EvaluateStudentRequest {
  studentId: string;
  thesisId: string;
  rating: number;
  comment: string;
}

// Progress update
export interface UpdateProgressRequest {
  thesisId: string;
  studentId: string;
  progress: number;
}
