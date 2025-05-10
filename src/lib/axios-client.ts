import axios from "axios";
import { API_CONFIG } from "@/services/api/config";
import { message } from "antd";
import { store } from "@/store";

// Create axios instance with default config
const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token, etc.
axiosClient.interceptors.request.use(
  (config) => {
    // Get token from Redux store
    const token = store.getState().auth.token;

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log("Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
axiosClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log("Response:", {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error("Response error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle specific error status codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized (e.g., logout user, redirect to login)
          store.dispatch({ type: "auth/logout" });
          message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
          window.location.href = "/login";
          break;
        case 403:
          // Handle forbidden
          message.error("Bạn không có quyền truy cập vào tài nguyên này");
          break;
        case 404:
          message.error("Không tìm thấy tài nguyên yêu cầu");
          break;
        case 500:
          // Handle server error
          message.error("Lỗi server, vui lòng thử lại sau");
          break;
        default:
          message.error(error.response.data?.message || "Đã có lỗi xảy ra");
      }
    } else if (error.request) {
      // Request made but no response received
      message.error(
        "Không thể kết nối đến server, vui lòng kiểm tra kết nối mạng"
      );
    } else {
      // Error in setting up request
      message.error("Đã có lỗi xảy ra khi gửi yêu cầu");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
