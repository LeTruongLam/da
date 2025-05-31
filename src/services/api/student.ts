import { get } from "@/lib/base-api";
import { API_CONFIG } from "./config";
export interface StudentRespone {
  user_id: number;
  name: string;
  code: string;
  email: string;
  role_name: string;
  isRevoke: boolean;
}


export const getStudents = () =>
  get<StudentRespone[]>(API_CONFIG.ENDPOINTS.STUDENT.LIST);

