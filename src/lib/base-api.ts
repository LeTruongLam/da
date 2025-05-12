import axiosClient from "@/lib/axios-client";

// GET request
export const get = async <T>(
  url: string,
  params?: Record<string, unknown>
): Promise<T> => {
  const response = await axiosClient.get<T>(url, { params });
  return response.data;
};

// POST request
export const post = async <T>(
  url: string,
  data?: Record<string, unknown>
): Promise<T> => {
  const response = await axiosClient.post<T>(url, data);
  return response.data;
};

// PUT request
export const put = async <T>(
  url: string,
  data?: Record<string, unknown>
): Promise<T> => {
  const response = await axiosClient.put<T>(url, data);
  return response.data;
};

// PATCH request
export const patch = async <T>(
  url: string,
  data?: Record<string, unknown>
): Promise<T> => {
  const response = await axiosClient.patch<T>(url, data);
  return response.data;
};

// DELETE request
export const del = async <T>(url: string): Promise<T> => {
  const response = await axiosClient.delete<T>(url);
  return response.data;
};
