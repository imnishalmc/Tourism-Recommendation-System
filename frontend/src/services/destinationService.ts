import api from "./api";
import type {
  Destination,
  PaginatedResponse,
} from "@/types/destination";

export interface DestinationFilters {
  search?: string;
  main_category?: string;
  district?: string;
  difficulty_level?: string;
  crowd_level?: string;
  budget_level?: string;
  ordering?: string;
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

  return responseData;
}

export async function getDestination(id: number) {
  const response = await api.get<Destination>(
    `/destinations/${id}/`
  );

  return response.data;
}