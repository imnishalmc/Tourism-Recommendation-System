import api from "./api";
import type {
  Destination,
  PaginatedResponse,
} from "@/types/destination";

export interface DestinationFilters {
  search?: string;
  main_category?: string;
  province?: string;
  district?: string;
  difficulty_level?: string;
  crowd_level?: string;
  budget_level?: string;
  ordering?: string;
  is_featured?: string;
}

export async function getDestinations(
  filters: DestinationFilters = {}
) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const response = await api.get<
    PaginatedResponse<Destination> | Destination[]
  >(`/destinations/?${params.toString()}`);

  const responseData = response.data;

  if (Array.isArray(responseData)) {
    return {
      count: responseData.length,
      next: null,
      previous: null,
      results: responseData,
    };
  }

  // Some deployments return a plain object without pagination metadata.
  // Always give the UI an array so list pages never render against undefined.
  return {
    count: Number(responseData?.count) || 0,
    next: responseData?.next ?? null,
    previous: responseData?.previous ?? null,
    results: Array.isArray(responseData?.results) ? responseData.results : [],
  };
}

export async function getDestination(id: number) {
  const response = await api.get<Destination>(
    `/destinations/${id}/`
  );

  // Viewing a detail page contributes to this month's trending destinations.
  // A tracking failure must never prevent travellers from reading the page.
  void api.post(`/destinations/${id}/record_view/`).catch(() => undefined);

  return response.data;
}
