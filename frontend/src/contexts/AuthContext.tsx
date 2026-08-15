import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "@/services/api";
import type { User } from "@/types/auth";
import { AuthContext } from "./auth-context";
interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}




interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {//provider mounts, initial phase 
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {//step 1 
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      await refreshProfile();
    } finally {
      setLoading(false);
    }
  }

  async function refreshProfile() {//if access token exits
    try {
      const response = await api.get<User>("/accounts/profile/");

      setUser(response.data);
    } catch {
      logout();
    }
  }

  async function login(
    email: string,
    password: string
  ): Promise<User> {
    const response = await api.post<LoginResponse>(
      "/accounts/login/",
      {
        email,
        password,
      }
    );

    const { access, refresh, user } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    setUser(user);

    return user;
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
