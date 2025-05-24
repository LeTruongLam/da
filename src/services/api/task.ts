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


export const getTasks = (params?: Record<string, unknown>) =>
  get<TaskResponse[]>(API_CONFIG.ENDPOINTS.TASK.LIST, params);

export const createTask = (values: CreateTaskRequest) =>
  post<{ success: boolean }>(
    API_CONFIG.ENDPOINTS.TASK.CREATE,
    values as unknown as Record<string, unknown>
  );

export const deleteTask = (id: number) =>
  del<{ success: boolean }>(API_CONFIG.ENDPOINTS.TASK.DELETE(id));

export const updateTask = (id: number, values: CreateTaskRequest) =>
  put<{ success: boolean }>(
    API_CONFIG.ENDPOINTS.TASK.UPDATE(id),
    values as unknown as Record<string, unknown>
  );
