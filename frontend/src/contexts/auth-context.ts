import { createContext } from "react";
import type { User } from "@/types/auth";

export interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<User>;

  logout: () => void;

  refreshProfile: () => Promise<void>;

  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);