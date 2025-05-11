import { get } from "@/lib/base-api";
import { API_CONFIG } from "./config";

export interface Major {
  majorId: number;
  majorName: string;
  facultyId: number;
  faculty: {
    facultyId: number;
    facultyName: string;
  };
}

export const getMajors = () => get<Major[]>(API_CONFIG.ENDPOINTS.MAJOR.LIST);
