import { apiClient } from "./api";
import type {
    UserRegisterRequest,
    UserLoginRequest,
    User,
    AuthTokens,
    RefreshTokenRequest,
} from "../types/auth";

// Register a new user
export const registerUser = async (data: UserRegisterRequest): Promise<User> => {
  const response = await apiClient.post<User>("/api/v1/auth/register", data);
  return response.data;
};

// Authenticate user and return tokens
export const loginUser = async (data: UserLoginRequest): Promise<AuthTokens> => {
  const response = await apiClient.post<AuthTokens>("/api/v1/auth/login", data);
  return response.data;
};

// Request a new access token using the refresh token
export const refreshAccessToken = async (data: RefreshTokenRequest): Promise<AuthTokens> => {
  const response = await apiClient.post<AuthTokens>("/api/v1/auth/refresh", data);
  return response.data;
};

// Helper function to clear local session data on logout
export const logoutUser = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};