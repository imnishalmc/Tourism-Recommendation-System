import { Link } from "react-router-dom";
import { Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildImageUrl, buildImageUrlCandidates } from "@/lib/destinationImages";
import type { RecommendedDestination } from "@/types/recommendation";

export function RecommendationCard({ item }: { item: RecommendedDestination }) {
  const imageSources = buildImageUrlCandidates(item.image_url, item.destination);
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={buildImageUrl(item.image_url, item.destination)}
          alt={item.destination}
          data-image-index="0"
          onError={(event) => {
            const nextIndex = Number(event.currentTarget.dataset.imageIndex || 0) + 1;
            if (nextIndex >= imageSources.length) {
              event.currentTarget.onerror = null;
              event.currentTarget.style.display = "none";
              return;
            }
            event.currentTarget.dataset.imageIndex = String(nextIndex);
            event.currentTarget.src = imageSources[nextIndex];
          }}
          className="size-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-primary">
          {Math.round(item.match_score)}% match
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-sm font-semibold">
          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />{Number(item.ratings || 0).toFixed(1)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{item.destination}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{item.district}, {item.province}</p>
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{item.description || "A destination matched to your interests."}</p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
         {item.id && (
  <Link to={`/destination/${item.id}`}>
    <Button
      variant="outline"
      className="w-full rounded-full"
    >
      Details
    </Button>
  </Link>
)}
          <Link to={`/itinerary?destination=${encodeURIComponent(item.destination)}`} className={item.id ? "" : "col-span-2"}><Button className="w-full rounded-full"><Calendar className="size-4" />Plan trip</Button></Link>
        </div>
      </div>
    </article>
  );
}
