import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { UserRole, type User, type UserLoginRequest } from "../types/auth";
import { loginUser, logoutUser as apiLogout } from "../services/authService";
import { apiClient } from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: UserLoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // On initial app load, check if tokens exist and fetch current admin profile if needed
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          // Optional: If you have an endpoint like GET /api/v1/users/me, fetch user info here
          // For now, we can decode or retrieve role if stored, or fetch profile
          // Example: const response = await apiClient.get<User>("/api/v1/users/me");
          // setUser(response.data);
        } catch (error) {
          console.error("Session restoration failed", error);
          apiLogout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: UserLoginRequest) => {
    setIsLoading(true);
    try {
      const tokens = await loginUser(credentials);
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);

      // Fetch user profile after successful login to check role
      // Assuming your login or /me endpoint returns the User object containing the role
      const userResponse = await apiClient.get<User>("/api/v1/users/me"); 
      
      // Ensure the user logging in is actually an ADMIN based on your rules
      if (userResponse.data.role !== UserRole.ADMIN) {
        apiLogout();
        throw new Error("Access denied. Admin privileges required.");
      }

      setUser(userResponse.data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    apiLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user || !!localStorage.getItem("access_token"),
        isAdmin: user?.role === UserRole.ADMIN,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context easily
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};