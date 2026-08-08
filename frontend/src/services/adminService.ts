import api from "./api";
import type { User } from "@/types/auth";
import type { Destination } from "@/types/destination";

export interface AdminDashboard {
  users: number;
  active_users: number;
  destinations: number;
  reviews: number;
  overview_metrics: Record<"users" | "destinations" | "reviews", {
    this_month?: number;
    percent_change?: number | null;
    trend: number[];
  }>;
  user_registrations: Array<{
    month: string;
    users: number;
    admins: number;
  }>;
  destination_categories: Array<{
    name: string;
    value: number;
  }>;
  province_distribution: Array<{
    name: string;
    value: number;
  }>;
  trending_destinations: Array<{
    id: number;
    name: string;
    image_url: string;
    main_category: string;
    district: string;
    province: string;
    ratings: number | null;
    monthly_views: number;
    monthly_reviews: number;
    monthly_average_rating: number | null;
  }>;
  most_reviewed: Array<{
    id: number;
    name: string;
    district: string;
    review_total: number;
  }>;
  recent_reviews: Array<{
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user__full_name: string;
    user__email: string;
    destination__name: string;
  }>;
}

export interface AdminReview {
  id: number;
  destination: number;
  destination_name: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string;
  created_at: string;
}

const list = async <T,>(url: string): Promise<T[]> => {
  const response = await api.get<T[] | { results: T[] }>(url);
  return Array.isArray(response.data) ? response.data : response.data.results;
};

export const adminService = {
  dashboard: () => api.get<AdminDashboard>("/accounts/admin/dashboard/").then((r) => r.data),
  users: (search = "", role = "", isActive = "") => list<User>(`/accounts/admin/users/?search=${encodeURIComponent(search)}&role=${role}&is_active=${isActive}`),
  updateUser: (id: number, data: Partial<Pick<User, "is_active" | "full_name" | "email" | "role">>) => api.patch<User>(`/accounts/admin/users/${id}/`, data).then((r) => r.data),
  deleteUser: (id: number) => api.delete(`/accounts/admin/users/${id}/`),
  destinations: (search = "") => list<Destination>(`/destinations/?search=${encodeURIComponent(search)}`),
  createDestination: (data: Partial<Destination>) => api.post<Destination>("/destinations/", data).then((r) => r.data),
  updateDestination: (id: number, data: Partial<Destination>) => api.patch<Destination>(`/destinations/${id}/`, data).then((r) => r.data),
  deleteDestination: (id: number) => api.delete(`/destinations/${id}/`),
  reviews: () => list<AdminReview>("/reviews/"),
  deleteReview: (id: number) => api.delete(`/reviews/${id}/`),
};
