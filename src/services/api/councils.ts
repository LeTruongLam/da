import { del, get, post } from "@/lib/base-api";
import { API_CONFIG } from "./config";

export const createCouncil = () => {
  return post<unknown>(API_CONFIG.ENDPOINTS.COUNCIL.CREATE);
};

type UserType = {
  user_id: number;
  name: string;
  code: string;
  email: string;
};
export type Council = {
  council_id: number;
  members: UserType[];
  thesis_title: string;
  date: string;
  time_to: string;
  room: string;
};

export const getAllCouncils = () =>
  get<Council[]>(API_CONFIG.ENDPOINTS.COUNCIL.GET_ALL);

export type CouncilById = {
  council_id: number;
  request_id: number;
  student_name: string;
  thesis_title: string;
  list_Member: string;
  members: UserType[];
  date: string;
  time_to: string;
  room: string;
  create_at: string;
  update_at: string;
  deleted: boolean;
};

export const getCouncilById = (id: number) =>
  get<CouncilById>(API_CONFIG.ENDPOINTS.COUNCIL.GET_BY_ID(id));

export const deleteCouncil = (id: number) => {
  return del<unknown>(API_CONFIG.ENDPOINTS.COUNCIL.DELETE(id));
};
