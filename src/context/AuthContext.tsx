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

  // On initial app load, restore session from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user_profile");

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Session restoration failed", error);
        apiLogout();
        localStorage.removeItem("user_profile");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: UserLoginRequest) => {
    setIsLoading(true);
    try {
      const response = await loginUser(credentials);
      
      const accessToken = response.access_token;
      const refreshToken = response.refresh_token;
      const loggedInUser = response.user;

      // Save tokens to storage
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Validate that the user logging in has ADMIN privileges based on your requirements
      if (loggedInUser.role !== UserRole.ADMIN) {
        localStorage.clear();
        throw new Error("Access denied. Admin privileges required.");
      }

      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_profile");
    apiLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!localStorage.getItem("access_token"),
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