import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar, Route, Wallet } from "lucide-react";
import { ItineraryControls } from "./ItineraryControls";
import { TrailTimeline } from "./TrailTimeline";
import { GeneratingState } from "./GeneratingState";
import { generateItinerary, ItineraryGenerationError } from "@/lib/itinerary";
import type { ItineraryRequest, ItineraryResponse } from "@/types/itinerary";

type Status = "idle" | "generating" | "ready" | "error";

export function ItineraryGenerator() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [plan, setPlan] = useState<ItineraryResponse | null>(null);
  const [pendingDestination, setPendingDestination] = useState("");
  const [error, setError] = useState("");
  const generate = async (request: ItineraryRequest) => {
    setStatus("generating"); setPendingDestination(request.destination); setError("");
    try { setPlan(await generateItinerary(request)); setStatus("ready"); }
    catch (reason) { setError(reason instanceof ItineraryGenerationError ? reason.message : "Could not generate an itinerary right now."); setStatus("error"); }
  };
  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-16 md:px-8"><div className="grid gap-6 lg:grid-cols-[360px_1fr]"><aside className="lg:sticky lg:top-24 lg:self-start"><ItineraryControls initialDestination={params.get("destination") ?? ""} onGenerate={generate} busy={status === "generating"} /></aside><div className="min-w-0">
    {status === "idle" && <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center"><h2 className="text-xl font-bold">Your trail appears here</h2><p className="mt-2 max-w-sm text-sm text-muted-foreground">Set your destination, starting point, and interests, then generate a day-by-day route.</p></div>}
    {status === "generating" && <GeneratingState destination={pendingDestination} />}
    {status === "error" && <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center"><h2 className="text-lg font-bold text-destructive">Couldn&apos;t generate this itinerary</h2><p className="mt-2 text-sm text-muted-foreground">{error}</p></div>}
    {status === "ready" && plan && <div className="flex flex-col gap-6"><div className="rounded-2xl bg-gradient-to-br from-primary to-secondary-foreground p-6 text-primary-foreground shadow-sm"><h1 className="text-2xl font-bold">{plan.days}-day journey to {plan.destination}</h1><div className="mt-4 flex flex-wrap gap-4 text-sm text-primary-foreground/90"><span className="inline-flex items-center gap-1"><Calendar className="size-4" />{plan.days} days</span><span className="inline-flex items-center gap-1"><Route className="size-4" />From {plan.starting_location}</span><span className="inline-flex items-center gap-1"><Wallet className="size-4" />{plan.plan_type}</span></div></div><TrailTimeline stops={plan.itinerary} /></div>}
  </div></div></section>;
}
