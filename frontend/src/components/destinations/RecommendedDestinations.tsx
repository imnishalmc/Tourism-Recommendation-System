import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getRecommendations } from "@/services/recommendationService";
import type { RecommendationsResponse } from "@/types/recommendation";
import { RecommendationCard } from "./RecommendationCard";

export function RecommendedDestinations({ destinationId, destinationName }: { destinationId: number; destinationName: string }) {
  const [data, setData] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    getRecommendations(destinationId)
      .then((result) => { if (!cancelled) setData(result); })
      .catch(() => { if (!cancelled) setData(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [destinationId]);
  if (loading) return <p className="mt-10 text-sm text-muted-foreground">Finding similar destinations...</p>;
  if (!data?.recommendations.length) return null;
  return <section className="mt-10 border-t pt-10"><div className="flex items-center gap-2"><Sparkles className="size-5 text-primary" /><div><h2 className="text-xl font-semibold">You may also like</h2><p className="text-sm text-muted-foreground">Similar places to {destinationName}.</p></div></div><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.recommendations.map((item, index) => <RecommendationCard key={`${item.destination}-${index}`} item={item} />)}</div></section>;
}
