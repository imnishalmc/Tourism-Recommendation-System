export type BudgetLevel = 'Low' | 'Medium' | 'High';
export type Pace = 'relaxed' | 'moderate' | 'fast';

export interface ItineraryRequest {
  destination: string;
  days: number;
  budget: BudgetLevel;
  travelers: number;
  pace: Pace;
  interests: string[];
  starting_location: string; // send '' (empty) to force GPS-based start
  latitude?: number;
  longitude?: number;
}

export interface ItineraryStop {
  day: number;
  title: string;
  from: string;
  to: string;
  badge: string;
  description: string;
}

export interface ItineraryResponse {
  destination: string;
  plan_type: string;
  days: number;
  travelers: number;
  category: string;
  starting_location: string;
  itinerary: ItineraryStop[];
}

export interface ItineraryErrorResponse {
  error: string;
  raw_response?: unknown;
}