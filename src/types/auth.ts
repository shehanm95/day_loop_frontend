export const UserRole = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Corresponds to UserBase & UserCreate
export interface UserRegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// Corresponds to UserLogin schema
export interface UserLoginRequest {
  email: string;
  password: string;
}

// Corresponds to UserRead schema
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: string; // ISO date string from Python datetime
  updated_at: string;
}

// Corresponds to Token schema returned by /login and /refresh
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

// Corresponds to RefreshTokenRequest schema
export interface RefreshTokenRequest {
  refresh_token: string;
}