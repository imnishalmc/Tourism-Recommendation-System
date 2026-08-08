import axios from 'axios';
import api from '@/services/api';
import type { ItineraryRequest, ItineraryResponse, ItineraryErrorResponse } from '@/types/itinerary';

export class ItineraryGenerationError extends Error {}

export async function generateItinerary(req: ItineraryRequest): Promise<ItineraryResponse> {
  const payload = {
    ...req,
    ...(req.latitude === undefined ? {} : { latitude: req.latitude }),
    ...(req.longitude === undefined ? {} : { longitude: req.longitude }),
  };

  try {
    const response = await api.post<ItineraryResponse | ItineraryErrorResponse>(
      '/itinerary/generate/',
      payload,
    );

    if ('error' in response.data) {
      throw new ItineraryGenerationError(response.data.error);
    }

    return response.data;
  } catch (err) {
    if (err instanceof ItineraryGenerationError) throw err;

    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ItineraryErrorResponse | undefined;
      throw new ItineraryGenerationError(
        data?.error || 'Could not reach the itinerary service. Please try again.',
      );
    }

    throw new ItineraryGenerationError('Something went wrong generating this itinerary.');
  }
}