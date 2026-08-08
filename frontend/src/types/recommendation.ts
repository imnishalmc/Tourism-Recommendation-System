export interface RecommendedDestination {
  destination: string;
  district: string;
  province: string;
  main_category: string;
  ratings: number;
  popularity: number;
  similarity?: number;
  match_score: number;
  // enriched by the backend after a name match — null if no match found
  id: number | null;
  image_url?: string | string[] | null;
  difficulty_level?: string | null;
  crowd_level?: string | null;
  budget_level?: string | null;
  description?: string | null;
}

export interface RecommendationsResponse {
  matched_destination: RecommendedDestination;
  recommendations: RecommendedDestination[];
}