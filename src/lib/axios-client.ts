import axios from "axios";

// Create axios instance with default config
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token, etc.
axiosClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error status codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized (e.g., logout user, redirect to login)
          localStorage.removeItem("token");
          break;
        case 403:
          // Handle forbidden
          console.error("Access forbidden");
          break;
        case 500:
          // Handle server error
          console.error("Server error");
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("No response received from server");
    } else {
      // Error in setting up request
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
