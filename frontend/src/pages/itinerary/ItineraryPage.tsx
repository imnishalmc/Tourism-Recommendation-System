import { Sparkles } from "lucide-react";

import { SiteNavbar } from "../../components/common/SiteNavbar";
import { SiteFooter } from "../../components/common/SiteFooter";
import { ItineraryGenerator } from "../../components/itinerary/ItineraryGenerator";

export default function ItineraryPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar />

      {/* Page Header */}
      <section className="border-b border-border bg-gradient-to-b from-light-blue/60 to-background px-5 pb-8 pt-28 md:px-8 md:pb-12 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary shadow-sm">
            <Sparkles className="size-3.5" />
            AI Itinerary Planner
          </span>

          <h1 className="mt-4 max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Generate your perfect Nepal itinerary
          </h1>

          <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Answer a few quick questions and let Sajilo Yatra build a smart,
            day-by-day plan tuned to your budget, pace, and the experiences you
            love most.
          </p>
        </div>
      </section>

      <ItineraryGenerator />

      <SiteFooter />
    </main>
  );
}
