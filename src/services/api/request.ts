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

export type AllRequestResponse = {
  request_id: number;
  student_name: string;
  student_code: string;
  lecturer_name: string;
  lecturer_code: string;
  thesis_title: string;
  status: string;
  create_at: string;
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
  thesis: {
    thesis_id: number;
    title: string;
    description: string;
    status: string;
    create_by: number;
    creator_name: string;
  };
  status: string;
  reject_reason: null;
  create_at: string;
  accept_at: null;
  tasks: {
    task_id: number;
    task_name: string;
    status: string;
    due_date: string;
    num_Submit: number;
  }[];
};

export type UpdateStatusRequest = {
  status: string;
  rejectReason: string;
};

export const createRequest = (data: RequestDataRequest) =>
  post<unknown>(API_CONFIG.ENDPOINTS.REQUEST.CREATE, data);

export const getRequestsCurrent = () =>
  get<CurrentRequestResponse>(API_CONFIG.ENDPOINTS.REQUEST.CURRENT);

export const getRequestsAll = (status?: string) =>
  get<AllRequestResponse[]>(API_CONFIG.ENDPOINTS.REQUEST.ALL, { status });

export const getRequestDetail = (id: number) =>
  get<RequestDetailResponse>(API_CONFIG.ENDPOINTS.REQUEST.DETAIL(id));

export const updateRequestStatus = (id: number, data: UpdateStatusRequest) =>
  put<unknown>(API_CONFIG.ENDPOINTS.REQUEST.UPDATE_STATUS(id), data);
