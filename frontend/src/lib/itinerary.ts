import axios from "axios";
import api from "@/services/api";
import type { ItineraryErrorResponse, ItineraryRequest, ItineraryResponse } from "@/types/itinerary";

export class ItineraryGenerationError extends Error {}

export async function generateItinerary(req: ItineraryRequest): Promise<ItineraryResponse> {
  try {
    const response = await api.post<ItineraryResponse | ItineraryErrorResponse>("/itinerary/generate/", req);
    if ("error" in response.data) throw new ItineraryGenerationError(response.data.error);
    return response.data;
  } catch (error) {
    if (error instanceof ItineraryGenerationError) throw error;
    if (axios.isAxiosError(error)) {
      throw new ItineraryGenerationError((error.response?.data as ItineraryErrorResponse | undefined)?.error || "Could not reach the itinerary service. Please try again.");
    }
    throw new ItineraryGenerationError("Something went wrong generating this itinerary.");
  }
}
