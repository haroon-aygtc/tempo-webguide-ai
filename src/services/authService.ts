import { apiClient } from "@/config/api";
import { ApiResponse, AuthResponse, User } from "@/types/api";

export class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      {
        email,
        password,
      },
    );

    if (response.data.success) {
      const { token } = response.data.data;
      localStorage.setItem("auth_token", token);
      return response.data.data;
    }

    throw new Error(response.data.message || "Login failed");
  }

  static async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      {
        name,
        email,
        password,
        password_confirmation: password,
      },
    );

    if (response.data.success) {
      const { token } = response.data.data;
      localStorage.setItem("auth_token", token);
      return response.data.data;
    }

    throw new Error(response.data.message || "Registration failed");
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      localStorage.removeItem("auth_token");
    }
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>("/auth/user");

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to get user");
  }

  static isAuthenticated(): boolean {
    // Session-based auth doesn't need local storage check
    // Authentication state is managed by the server session
    return true; // This will be properly checked by getCurrentUser()
  }
}
