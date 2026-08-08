import api from "@/services/api";

export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AdminUser;
}

export async function loginAdmin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/accounts/login/",
    {
      email,
      password,
    },
  );

  const data = response.data;

  if (data.user.role !== "admin") {
    throw new Error(
      "Access denied. Administrator account required.",
    );
  }

  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  localStorage.setItem(
    "admin_user",
    JSON.stringify(data.user),
  );

  return data;
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem("admin_user");

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const token = localStorage.getItem("access_token");
  const user = getAdminUser();

  return Boolean(
    token &&
      user &&
      user.role === "admin",
  );
}

export function logoutAdmin() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("admin_user");

  window.location.href = "/login";
}
