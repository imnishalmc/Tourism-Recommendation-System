import api from "./api";
import type { Review } from "@/types/review";

const unpack = (data: Review[] | { results: Review[] }) => Array.isArray(data) ? data : data.results;

export const reviewService = {
  list: (destination: number) => api.get<Review[] | { results: Review[] }>(`/reviews/?destination=${destination}`).then((r) => unpack(r.data)),
  create: (data: Pick<Review, "destination" | "rating" | "comment">) => api.post<Review>("/reviews/", data).then((r) => r.data),
  update: (id: number, data: Pick<Review, "rating" | "comment">) => api.patch<Review>(`/reviews/${id}/`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/reviews/${id}/`),
};
