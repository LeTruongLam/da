import { get } from "@/lib/base-api";
import { API_CONFIG } from "./config";
import type { ThesisResponse } from "./thesis";
export interface TeacherResponse {
  userId: string;
  name: string;
  email: string;
  theses: ThesisResponse[];
}

// Get all teachers
export const getAllTeachers = () =>
  get<TeacherResponse[]>(API_CONFIG.ENDPOINTS.TEACHER.LIST);

// // Get teacher by ID
// export const getTeacherById = (id: string) =>
//   get<TeacherResponse>(API_CONFIG.ENDPOINTS.TEACHER.DETAIL(id));
