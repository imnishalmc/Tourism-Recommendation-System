import { Mountain } from "lucide-react";

export function GeneratingState({ destination }: { destination: string }) {
  return <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card px-6 py-16 text-center"><Mountain className="size-12 animate-pulse text-primary" /><div><h3 className="text-lg font-bold">Charting your route to {destination}...</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">We&apos;re sequencing stops and daily pacing into one smooth trail.</p></div></div>;
}
