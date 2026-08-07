export interface User {
  id: number;
  email: string;
  full_name: string;

  role: "admin" | "user";

  is_staff: boolean;
  is_superuser: boolean;

  trip_duration: number | null;
  interests: string[];
  date_joined: string;
}