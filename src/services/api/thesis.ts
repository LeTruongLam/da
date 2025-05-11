import { get, post, put, del } from "@/lib/base-api";
import { API_CONFIG } from "./config";
import { store } from "@/store";

export interface ThesisResponse {
  thesisId: number;
  title: string;
  description: string;
  status:
    | "available"
    | "in_progress"
    | "completed"
    | "not available"
    | "on hold";
  lecturer: {
    userId: string;
    name: string;
    email: string;
  };
  major: {
    majorId: string;
    majorName: string;
    facultyId: string;
    facultyName: string;
  };
  createAt: string;
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
  studentId?: string;
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
export const getThesisById = (id: string) =>
  get<ThesisResponse>(API_CONFIG.ENDPOINTS.THESIS.DETAIL(id));

// Create new thesis
export const createThesis = (data: ThesisCreateRequest) =>
  post<ThesisResponse>(
    API_CONFIG.ENDPOINTS.THESIS.CREATE,
    data as unknown as Record<string, unknown>
  );

// Update thesis
export const updateThesis = (id: string, data: Partial<ThesisResponse>) =>
  put<ThesisResponse>(
    API_CONFIG.ENDPOINTS.THESIS.UPDATE(id),
    data as unknown as Record<string, unknown>
  );

// Delete thesis
export const deleteThesis = (id: string) =>
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
