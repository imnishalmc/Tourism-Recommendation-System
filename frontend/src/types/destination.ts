export interface Destination {
  id: number;
  name: string;
  district: string;
  province: string;

  main_category: string;

  difficulty_level:
  | "easy"
  | "moderate"
  | "hard"
  | "very_hard";

  crowd_level:
  | "very_low"
  | "low"
  | "moderate"
  | "high"
  | "very_high";

  budget_level?: "low" | "medium" | "high";

  description: string;
  image_url?: string | string[];
  latitude?: number;
  longitude?: number;

  ratings: number | null;
  popularity: number | null;


  best_season?: string;
  activities?: string;
  accessibility?: string;
  transportation?: string;
  visit_duration_days?: number;
  review_count?: number;
  tags?: string[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}