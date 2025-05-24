import { get } from "@/lib/base-api";
import { API_CONFIG } from "./config";
export interface TeacherResponse {
  user_id: number;
  name: string;
  code: string;
  email: string;
  role_name: string;
  isRevoke: boolean;
}

export const getInternalLecturers = () =>
  get<TeacherResponse[]>(API_CONFIG.ENDPOINTS.TEACHER.INTERNAL_LECTURERS);

export const getExternalLecturers = () =>
  get<TeacherResponse[]>(API_CONFIG.ENDPOINTS.TEACHER.EXTERNAL_LECTURERS);

// // Get teacher by ID
// export const getTeacherById = (id: string) =>
//   get<TeacherResponse>(API_CONFIG.ENDPOINTS.TEACHER.DETAIL(id));
