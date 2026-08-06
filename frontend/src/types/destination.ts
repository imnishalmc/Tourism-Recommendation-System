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

  description: string;

  image_url: string;

  ratings: number | null;
  popularity: number | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}