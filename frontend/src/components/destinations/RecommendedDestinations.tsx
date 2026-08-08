import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getRecommendations } from "@/services/recommendationService";
import { RecommendationCard } from "./RecommendationCard";
import type { RecommendationsResponse } from "@/types/recommendation";

export function RecommendedDestinations({
  destinationId,
  destinationName,
}: {
  destinationId: number;
  destinationName: string;
}) {
  const [data, setData] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getRecommendations(destinationId)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setData(null); // supplementary section — fail quietly
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [destinationId]);

  if (loading) {
    return <p className="mt-14 text-sm text-muted-foreground">Finding similar places...</p>;
  }

  if (!data || data.recommendations.length === 0) {
    return null; // quietly hide rather than show an empty/broken section
  }

  return (
    <section className="mt-14">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="size-4" />
        </span>
        <div>
          <h2 className="text-xl font-bold">Matched to your preferences</h2>
          <p className="text-sm text-muted-foreground">
            Because you're exploring <span className="font-semibold text-foreground">{destinationName}</span>, here are places travellers love next.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.recommendations.map((item, i) => (
          <RecommendationCard key={`${item.destination}-${i}`} item={item} />
        ))}
      </div>
    </section>
  );
}