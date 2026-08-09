import api from "./api";

export type SiteStats = {
  destinations: number;
  travel_routes: number;
  provinces_covered: number;
  registered_travelers: number;
};

export async function getSiteStats(): Promise<SiteStats> {
  const response = await api.get<SiteStats>("/stats/");

  return response.data;
}