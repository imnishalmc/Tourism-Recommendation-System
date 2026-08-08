import { Star } from "lucide-react";
import { buildImageUrl, buildImageUrlCandidates } from "@/lib/destinationImages";

interface TrendingDestination {
  id: number;
  name: string;
  image_url: string;
  main_category: string;
  district: string;
  province: string;
  ratings: number | null;
  monthly_views: number;
  monthly_reviews: number;
  monthly_average_rating: number | null;
}

interface TrendingDestinationsCardProps {
  destinations: TrendingDestination[];
}

const categoryLabels: Record<string, string> = {
  trekking_adventure: "Trekking",
  cultural_religious: "Cultural",
  natural: "Natural",
  wildlife_conservation: "Wildlife",
  village_rural: "Village",
  urban_modern: "Urban",
  wellness_relaxation: "Wellness",
};

export default function TrendingDestinationsCard({ destinations }: TrendingDestinationsCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-bold">Trending this season</h2>
        <p className="text-sm text-muted-foreground">Most viewed detail pages and reviews this month, with current destination ratings.</p>
      </div>
      <div className="mt-5 space-y-5">
        {destinations.map((destination) => (
          <div key={destination.id} className="flex gap-4">
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-slate-100">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-slate-100">
                <span className="text-xs text-slate-500">No image</span>
              </div>
              <img
                src={buildImageUrl(destination.image_url, destination.name)}
                alt={destination.name}
                data-image-index="0"
                onError={(event) => {
                  const sources = buildImageUrlCandidates(destination.image_url, destination.name);
                  const next = Number(event.currentTarget.dataset.imageIndex || 0) + 1;
                  if (next >= sources.length) {
                    event.currentTarget.style.display = "none";
                    return;
                  }
                  event.currentTarget.dataset.imageIndex = String(next);
                  event.currentTarget.src = sources[next];
                }}
                className="relative h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex flex-1 items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{destination.name}</h3>
                  <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                    {categoryLabels[destination.main_category] || destination.main_category}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {[destination.district, destination.province].filter(Boolean).join(", ")}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Star className="size-4 fill-blue-600 text-blue-600" />
                  <span className="font-semibold">{destination.ratings?.toFixed(1) || "—"}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {destination.monthly_views} views · {destination.monthly_reviews} reviews this month
                </p>
              </div>
            </div>
          </div>
        ))}
        {destinations.length === 0 && <p className="text-sm text-muted-foreground">No trending destinations yet.</p>}
      </div>
    </section>
  );
}
