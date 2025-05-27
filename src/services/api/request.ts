import { API_CONFIG } from "./config";
import { get, post, put, del } from "@/lib/base-api";

export type RequestDataRequest = {
  student_id: number;
  lecturer_id: number;
  thesis_id: number;
};

export type CurrentRequestResponse = {
  request_id: number;
  thesis_id: number;
  thesisTitle: string;
  lecturerId: number;
  lecturerName: string;
  lecturerCode: string;
  status: string;
};

export type RequestDetailResponse = {
  request_id: number;
  student: {
    user_id: number;
    name: string;
    code: string;
    email: string;
  };
  lecturer: {
    user_id: number;
    name: string;
    code: string;
    email: string;
  };
  thesis: any;
  status: string;
  reject_reason: null;
  create_at: string;
  accept_at: null;
  tasks: [];
};

export const createRequest = (data: RequestDataRequest) =>
  post<unknown>(API_CONFIG.ENDPOINTS.REQUEST.CREATE, data);

export const getRequestsCurrent = () =>
  get<CurrentRequestResponse>(API_CONFIG.ENDPOINTS.REQUEST.CURRENT);

export const getRequestDetail = (id: number) =>
  get<RequestDetailResponse>(API_CONFIG.ENDPOINTS.REQUEST.DETAIL(id));
