import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildImageUrl } from "@/lib/destinationImages";
import { DIFFICULTY_LEVELS, CROWD_LEVELS } from "@/constants/categories";
import type { RecommendedDestination } from "@/types/recommendation";

const difficultyStyles: Record<string, string> = {
  easy: "bg-soft-green text-secondary",
  moderate: "bg-light-blue text-primary",
  hard: "bg-primary/10 text-primary",
  very_hard: "bg-primary/20 text-primary",
};

const crowdStyles: Record<string, string> = {
  very_low: "bg-secondary/10 text-secondary",
  low: "bg-secondary/10 text-secondary",
  moderate: "bg-muted text-muted-foreground",
  high: "bg-primary/10 text-primary",
  very_high: "bg-primary/20 text-primary",
};

const budgetStyles: Record<string, string> = {
  low: "bg-soft-green text-secondary",
  medium: "bg-light-blue text-primary",
  high: "bg-primary/10 text-primary",
};

function label(list: { value: string; label: string }[], value?: string | null) {
  if (!value) return null;
  return list.find((x) => x.value === value)?.label ?? value;
}

export function RecommendationCard({ item }: { item: RecommendedDestination }) {
  const detailHref = item.id ? `/destination/${item.id}` : null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={buildImageUrl(item.image_url, item.destination)}
          alt={item.destination}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-secondary shadow-sm">
          <span className="size-1.5 rounded-full bg-secondary" />
          {Math.round(item.match_score)}% match
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
          {item.main_category}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-bold leading-tight">{item.destination}</h3>
          <p className="text-sm text-muted-foreground">
            {item.district}, {item.province}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {item.difficulty_level && (
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", difficultyStyles[item.difficulty_level])}>
              {label(DIFFICULTY_LEVELS, item.difficulty_level)}
            </span>
          )}
          {item.crowd_level && (
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", crowdStyles[item.crowd_level])}>
              {label(CROWD_LEVELS, item.crowd_level)}
            </span>
          )}
          {item.budget_level && (
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", budgetStyles[item.budget_level])}>
              {item.budget_level}
            </span>
          )}
        </div>

        {item.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        )}

        <span className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
          {item.ratings.toFixed(1)}
        </span>

        {detailHref ? (
          <Link
            to={detailHref}
            className="mt-auto inline-flex w-full items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            View Details
          </Link>
        ) : (
          <span className="mt-auto inline-flex w-full items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground opacity-60">
            Details unavailable
          </span>
        )}
      </div>
    </div>
  );
}