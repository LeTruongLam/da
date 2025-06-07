import { API_CONFIG } from "./config";
import { get, post, put, del } from "@/lib/base-api";

export interface TaskResponse {
  task_id: number;
  task_name: string;
  status: string;
  due_date: string;
  num_Submit: number;
}

export interface CreateTaskRequest {
  task_name: string;
  description: string;
  due_date: string;
  request_id: number;
}

export interface UpdateTaskRequest {
  task_name?: string;
  description?: string;
  file_path?: string;
  file_name?: string;
  status?: string;
  comment?: string;
  due_date?: string;
}

export const getTasks = (params?: Record<string, unknown>) =>
  get<TaskResponse[]>(API_CONFIG.ENDPOINTS.TASK.LIST, params);

export const createTask = (values: CreateTaskRequest) =>
  post<{ success: boolean }>(
    API_CONFIG.ENDPOINTS.TASK.CREATE,
    values as unknown as Record<string, unknown>
  );

export const deleteTask = (id: number) =>
  del<{ success: boolean }>(API_CONFIG.ENDPOINTS.TASK.DELETE(id));

export const updateTask = (id: number, values: UpdateTaskRequest) =>
  post<{ success: boolean }>(
    API_CONFIG.ENDPOINTS.TASK.UPDATE(id),
    values as unknown as Record<string, unknown>
  );

export const getTasksByRequest = (id: number) =>
  get<TaskResponse[]>(API_CONFIG.ENDPOINTS.TASK.LIST_BY_REQUEST(id));

export interface TaskDetailResponse {
  task_id: number;
  task_name: string;
  description: string;
  status: string;
  file_Name: string;
  file_Path: string;
  comment: string;
  num_Submit: number;
  due_date: string;
  create_at: string;
  update_at: string;
  deleted: boolean;
  request_id: number;
  student_id: number;
  student_name: string;
  feedbacks: [];
}

export const getTaskDetail = (id: number) =>
  get<TaskDetailResponse>(API_CONFIG.ENDPOINTS.TASK.DETAIL(id));

export type TaskFinnalResponse = {
  task_id: number;
  task_name: string;
  status: string;
  file_name: string;
  file_path: string;
  due_date: string;
  num_Submit: number;
  thesis_id: number;
  thesis_title: string;
  lecturer_name: string;
  student_name: string;
};

export const getTaskFinnalList = () =>
  get<TaskFinnalResponse[]>(API_CONFIG.ENDPOINTS.TASK.LIST);
