import axios from "axios";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear any stored auth state and redirect to login
      window.location.href = "/login";
    }
    if (error.response?.status === 419) {
      // CSRF token mismatch, reinitialize and retry
      await initializeCSRF();
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
