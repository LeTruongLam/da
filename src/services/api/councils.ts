import { del, get, post } from "@/lib/base-api";
import { API_CONFIG } from "./config";

export const createCouncil = (
  type: number,
  value?: {
    requestIds: string;
    list_Member: string;
    date: string;
  }
) => {
  return post<unknown>(API_CONFIG.ENDPOINTS.COUNCIL.CREATE(type), value);
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

export type TeachersCouncilParams = {
  listMember?: string;
  requestId?: number;
  date: string;
  session?: string;
};

export type TeachersCouncilResponse = {
  user_id: number;
  name: string;
  code: string;
  email: string;
};

export const getTeachersCouncil = (params: TeachersCouncilParams) =>
  get<TeachersCouncilResponse[]>(
    API_CONFIG.ENDPOINTS.COUNCIL.GET_LECTURERS,
    params
  );

export type RequestCouncilResponse = {
  create_at: string;
  lecturer_code: string;
  lecturer_name: string;
  request_id: number;
  status: string;
  student_code: string;
  student_name: string;
  thesis_title: string;
};

export const getRequestCouncil = (value: { listMember: string }) =>
  post<RequestCouncilResponse[]>(
    API_CONFIG.ENDPOINTS.COUNCIL.GET_REQUESTS,
    value
  );

export const updateCouncil = (
  id: number,
  data: {
    list_Member: string;
    requst_Id: string;
    date: string;
  }
) => post<unknown>(API_CONFIG.ENDPOINTS.COUNCIL.UPDATE(id), data);
