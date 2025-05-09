import { get, post, put, del } from "../../lib/base-api";

export interface Thesis {
  id: string;
  title: string;
  description: string;
  status: "draft" | "review" | "approved" | "rejected" | "completed";
  studentId: string;
  teacherId?: string;
  createdAt: string;
  updatedAt: string;
  documents?: ThesisDocument[];
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
export const getAllTheses = (params?: {
  status?: string;
  studentId?: string;
  teacherId?: string;
}) => get<Thesis[]>("/theses", params as Record<string, unknown>);

// Get thesis by ID
export const getThesisById = (id: string) => get<Thesis>(`/theses/${id}`);

// Create new thesis
export const createThesis = (data: ThesisCreateRequest) =>
  post<Thesis>("/theses", data as unknown as Record<string, unknown>);

// Update thesis
export const updateThesis = (id: string, data: Partial<Thesis>) =>
  put<Thesis>(`/theses/${id}`, data as unknown as Record<string, unknown>);

// Delete thesis
export const deleteThesis = (id: string) =>
  del<{ success: boolean }>(`/theses/${id}`);

// Get thesis documents
export const getThesisDocuments = (thesisId: string) =>
  get<ThesisDocument[]>(`/theses/${thesisId}/documents`);

// Upload thesis document
export const uploadThesisDocument = (thesisId: string, formData: FormData) => {
  // Using fetch API directly for file uploads
  return fetch(
    `${
      import.meta.env.VITE_API_URL || "http://localhost:3000/api"
    }/theses/${thesisId}/documents`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  ).then((response) => response.json());
};
