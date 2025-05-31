import { get, post } from "@/lib/base-api";
import { API_CONFIG } from "./config";

export type FeedBackRequest = {
  comment: string;
  task_id: number;
};

export const addFeedback = (data: FeedBackRequest) => {
  return post<unknown>(API_CONFIG.ENDPOINTS.FEEDBACK.CREATE, data);
};

export type FeedbackResponse = {
  feedback_id: number;
  sender_id: number;
  sender_name: string;
  comment: string;
  create_at: string;
  update_at: string;
  deleted: boolean;
  task_id: number;
  task_name: string;
};

export const getAllFeedbackByTaskId = (taskId: number) => {
  return get<FeedbackResponse[]>(
    API_CONFIG.ENDPOINTS.FEEDBACK.GET_BY_TASK_ID(taskId)
  );
};
