import { get, post, put, del } from "@/lib/base-api";
import { API_CONFIG } from "./config";
import { store } from "@/store";

export interface ThesisResponse {
  thesis_id: number;
  title: string;
  status:
    | "available"
    | "in_progress"
    | "completed"
    | "not available"
    | "on hold";
  create_by: number;
  creator_name: string;
}

export interface MaterialsType {
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
}

export interface ThesisDetailResponse {
  thesis_id: number;
  title: string;
  description: string;
  status: string;
  create_at: string;
  update_at: string;
  create_by: number;
  creator_name: string;
  materials: MaterialsType[];
}

export interface ThesisDocument {
  id: string;
  thesisId: string;
  name: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ThesisCreateRequest {
  title: string;
  description: string;
  status: string;
  create_by: number;
}

export interface ThesisUpdateRequest {
  title: string;
  description: string;
  status: string;
  thesis_id: number;
}

/**
 * Thesis API services
 */

// Get all theses
export const getAllTheses = () =>
  get<ThesisResponse[]>(API_CONFIG.ENDPOINTS.THESIS.LIST);

// Get my theses
export const getMyTheses = () =>
  get<ThesisResponse[]>(API_CONFIG.ENDPOINTS.THESIS.MY_THESES);

// Get thesis by ID
export const getThesisById = (id: number) =>
  get<ThesisDetailResponse>(API_CONFIG.ENDPOINTS.THESIS.DETAIL(id));

// Create new thesis
export const createThesis = (data: ThesisCreateRequest) =>
  post<ThesisResponse>(
    API_CONFIG.ENDPOINTS.THESIS.CREATE,
    data as unknown as Record<string, unknown>
  );

// Update thesis
export const updateThesis = (id: number, data: ThesisUpdateRequest) =>
  put<ThesisResponse>(
    API_CONFIG.ENDPOINTS.THESIS.UPDATE(id),
    data as unknown as Record<string, unknown>
  );

// Delete thesis
export const deleteThesis = (id: number) =>
  del<{ success: boolean }>(API_CONFIG.ENDPOINTS.THESIS.DELETE(id));

// Get thesis documents
export const getThesisDocuments = (thesisId: string) =>
  get<ThesisDocument[]>(API_CONFIG.ENDPOINTS.THESIS.DOCUMENTS(thesisId));

// Upload thesis document
export const uploadThesisDocument = (thesisId: string, formData: FormData) => {
  // Using fetch API directly for file uploads
  const token = store.getState().auth.token;
  return fetch(API_CONFIG.ENDPOINTS.THESIS.DOCUMENTS(thesisId), {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
};
