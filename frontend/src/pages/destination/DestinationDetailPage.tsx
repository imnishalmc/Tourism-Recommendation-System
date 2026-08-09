import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  Users,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { getDestination } from "@/services/destinationService";
import type { Destination } from "@/types/destination";

import {
  DIFFICULTY_LEVELS,
  CROWD_LEVELS,
} from "@/constants/categories";

import { buildImageUrl, buildImageUrlCandidates } from '@/lib/destinationImages'
import { ReviewSection } from "@/components/destination/ReviewSection";
import { RecommendedDestinations } from "@/components/destinations/RecommendedDestinations";

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

export default function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] =
    useState<Destination | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const destinationId = Number(id);

    if (Number.isNaN(destinationId)) {
      setError("Invalid destination.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getDestination(destinationId);

        if (!cancelled) {
          setDestination(data);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Could not load this destination. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <p className="text-muted-foreground">
          Loading destination...
        </p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="py-32 text-center">
        <p className="text-destructive">
          {error || "Destination not found."}
        </p>

        <Link to="/destination">
          <Button
            variant="outline"
            className="mt-6 rounded-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Destinations
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-10">

      <Link
        to="/destination"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Destinations
      </Link>

      {/* Hero Image */}

      <div className="mt-6 overflow-hidden rounded-3xl shadow-lg">
        <img
          src={buildImageUrl(
            destination.image_url,
            destination.name
          )}
          alt={destination.name}
          data-image-index="0"
          onError={(e) => {
            const sources = buildImageUrlCandidates(
              destination.image_url,
              destination.name
            );
            const currentIndex = Number(
              e.currentTarget.dataset.imageIndex || 0
            );
            const nextIndex = currentIndex + 1;

            if (nextIndex >= sources.length) {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = "none";
              return;
            }

            e.currentTarget.dataset.imageIndex = String(nextIndex);
            e.currentTarget.src = sources[nextIndex];
          }}
          className="h-64 w-full object-cover sm:h-80 lg:h-[450px]"
        />
      </div>

      {/* Header */}

      <div className="mt-6 flex flex-col justify-between gap-4 sm:mt-8 lg:flex-row">

        <div>

            <h1 className="break-words text-3xl font-bold sm:text-4xl">
            {destination.name}
          </h1>

          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {destination.district},{" "}
            {destination.province}
          </p>

        </div>

        {destination.ratings != null && (
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-5 py-3 font-semibold">

            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

            {destination.ratings.toFixed(1)}

            {destination.review_count != null &&
              destination.review_count > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({destination.review_count} reviews)
                </span>
              )}

          </div>
        )}

      </div>

      {/* Badges */}

      <div className="mt-8 flex flex-wrap gap-3">

        <span
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium",
            difficultyStyles[destination.difficulty_level]
          )}
        >
          {label(
            DIFFICULTY_LEVELS,
            destination.difficulty_level
          )}
        </span>

        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
            crowdStyles[destination.crowd_level]
          )}
        >
          <Users className="h-4 w-4" />
          {label(
            CROWD_LEVELS,
            destination.crowd_level
          )}{" "}
          Crowd
        </span>

        {destination.visit_duration_days != null && (
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            {destination.visit_duration_days} day
            {destination.visit_duration_days !== 1
              ? "s"
              : ""}
          </span>
        )}

      </div>

      {/* Description */}

      <div className="mt-10">

        <h2 className="mb-3 text-2xl font-semibold">
          About
        </h2>

        <p className="leading-8 text-muted-foreground">
          {destination.description}
        </p>

      </div>

      {/* Information */}

      <div className="mt-12 grid gap-6 md:grid-cols-2">

        <div className="rounded-2xl border p-6">
          <h3 className="font-semibold">
            Best Season
          </h3>

          <p className="mt-2 text-muted-foreground">
            {destination.best_season}
          </p>
        </div>

        <div className="rounded-2xl border p-6">
          <h3 className="font-semibold">
            Activities
          </h3>

          <p className="mt-2 text-muted-foreground">
            {destination.activities}
          </p>
        </div>

        <div className="rounded-2xl border p-6">
          <h3 className="font-semibold">
            Accessibility
          </h3>

          <p className="mt-2 text-muted-foreground">
            {destination.accessibility}
          </p>
        </div>

        <div className="rounded-2xl border p-6">
          <h3 className="font-semibold">
            Transportation
          </h3>

          <p className="mt-2 text-muted-foreground">
            {destination.transportation}
          </p>
        </div>

      </div>

      {/* Tags */}

      {destination.tags &&
        destination.tags.length > 0 && (
          <div className="mt-10">

            <h3 className="mb-3 text-xl font-semibold">
              Tags
            </h3>

            <div className="flex flex-wrap gap-2">

              {destination.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-sm"
                >
                  {tag}
                </span>
              ))}

            </div>

          </div>
        )}

      <div className="mt-10 rounded-2xl border p-6">
        <h3 className="flex items-center gap-2 font-semibold"><Calendar className="h-4 w-4 text-primary" />Plan around {destination.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">Build a day-by-day itinerary around this destination.</p>
        <Button className="mt-4 w-full rounded-full" onClick={() => navigate(`/itinerary?destination=${encodeURIComponent(destination.name)}`)}>Generate itinerary</Button>
      </div>

      <RecommendedDestinations
        destinationId={destination.id}
        destinationName={destination.name}
      />

      <ReviewSection destinationId={destination.id} />

    </article>
  );
}
