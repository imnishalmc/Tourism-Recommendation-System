import { useEffect, useState } from "react";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { getDestinations } from "@/services/destinationService";

import type { Destination } from "@/types/destination";

import {
  DIFFICULTY_LEVELS,
  CROWD_LEVELS,
} from "@/constants/categories";
import { buildImageUrl } from "@/lib/destinationImages";

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

function label(
  list: { value: string; label: string }[],
  value: string
) {
  return list.find((x) => x.value === value)?.label ?? value;
}

export function DestinationsSection() {
  const [destinations, setDestinations] = useState<
    Destination[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDestinations() {
      try {
        const data = await getDestinations({
          ordering: "-popularity",
        });

        setDestinations(data.results.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDestinations();
  }, []);

  return (
    <section
      id="destinations"
      className="scroll-mt-16 bg-muted/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">

        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Popular Destinations
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Iconic places to begin your journey
            </h2>
          </div>

          <Link to="destination">
            <Button
              variant="ghost"
              className="rounded-full font-semibold text-primary"
            >
              View all destinations
              <ArrowRight className="size-4" />
            </Button>
          </Link>

        </div>

        {loading ? (
          <p className="mt-12 text-center">
            Loading destinations...
          </p>
        ) : destinations.length === 0 ? (
          <p className="mt-12 text-center">
            No destinations found.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {destinations.map((d) => (

              <article
                key={d.id}
                className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1"
              >

                <div className="relative aspect-[4/3] overflow-hidden">

                  <img
                    src={buildImageUrl(d.image_url)}
                    alt={d.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/placeholder.jpg";
                    }}
                    className="size-full object-cover transition group-hover:scale-105"
                  />

                  {d.ratings && (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-background px-3 py-1">

                      <Star className="size-3 fill-yellow-400 text-yellow-400" />

                      {d.ratings.toFixed(1)}

                    </span>
                  )}
                </div>

                <div className="p-6">

                  <h3 className="text-lg font-semibold">
                    {d.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {d.district}
                  </p>

                  <div className="mt-4 flex gap-2">

                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs",
                        difficultyStyles[
                        d.difficulty_level
                        ]
                      )}
                    >
                      {label(
                        DIFFICULTY_LEVELS,
                        d.difficulty_level
                      )}
                    </span>

                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs",
                        crowdStyles[d.crowd_level]
                      )}
                    >
                      {label(
                        CROWD_LEVELS,
                        d.crowd_level
                      )}
                    </span>

                  </div>

                  <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                    {d.description}
                  </p>

                  <Link
                    to={`/destination/${d.id}`}
                  >
                    <Button
                      variant="outline"
                      className="mt-5 w-full rounded-full"
                    >
                      View Details
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>

                </div>

              </article>

            ))}

          </div>
        )}

      </div>
    </section>
  );
}