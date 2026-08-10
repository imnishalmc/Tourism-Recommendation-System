import api from "@/services/api";
import type { RecommendationsResponse } from "@/types/recommendation";

export async function getRecommendations(
  destinationId: number,
  category?: string
) {
  const response = await api.post<RecommendationsResponse>(
    "/recommend/",
    {
      destination_id: destinationId,
      ...(category ? { category } : {}),
    }
  );

  return response.data;
}