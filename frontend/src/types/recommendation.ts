export interface RecommendedDestination {
  id: number | null;

  destination: string;
  district: string;
  province: string;
  main_category: string;

  ratings: number;
  popularity: number;

  match_score: number;

  image_url?: string | string[] | null;

  difficulty_level?: string | null;
  crowd_level?: string | null;
  budget_level?: string | null;

  description?: string | null;

  similarity?: number;
}

export interface RecommendationsResponse {
  matched_destination: RecommendedDestination;
  recommendations: RecommendedDestination[];
}