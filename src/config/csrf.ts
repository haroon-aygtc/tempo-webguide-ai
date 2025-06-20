import { apiClient } from "./api";

export async function initializeCSRF() {
  try {
    await apiClient.get("/sanctum/csrf-cookie", { withCredentials: true }); // Add withCredentials: true to include cookies in the request
  } catch (error) {
    console.error("Failed to initialize CSRF token:", error);
  }
}
