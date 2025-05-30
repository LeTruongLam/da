import { API_CONFIG } from "./config";
import { get, post } from "@/lib/base-api";

export type MaterialsByThesisType = {
  material_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  user_public_id: number;
  user_name: string;
  thesis_id: number;
  create_at: string;
  update_at: string;
  deleted: boolean;
}[];

export const getMaterialByThesis = (thesisId: number) =>
  get<MaterialsByThesisType>(
    API_CONFIG.ENDPOINTS.MATERIAL.LIST_BY_THESIS(thesisId)
  );

export type MaterialTypeRequest = {
  fileName: string;
  filePath: string;
  fileType: string;
  createAt: string;
  user_public_id: number;
  thesis_id: number;
};

export const createMaterial = (values: MaterialTypeRequest) =>
  post<unknown>(
    API_CONFIG.ENDPOINTS.MATERIAL.CREATE,
    values as unknown as Record<string, unknown>
  );
