import { Mountain } from 'lucide-react';

export function GeneratingState({ destination }: { destination: string }) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card px-6 py-16 text-center">
      <div className="relative h-40 w-full max-w-md">
        <svg viewBox="0 0 400 160" className="h-full w-full text-primary" aria-hidden>
          <path
            d="M0 150 L60 90 L110 120 L170 50 L230 100 L300 40 L360 95 L400 60"
            fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="3"
          />
          <path
            d="M0 150 L60 90 L110 120 L170 50 L230 100 L300 40 L360 95 L400 60"
            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
            className="animate-trail-draw"
          />
        </svg>
        <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <Mountain className="size-6 animate-pulse" aria-hidden />
        </span>
      </div>
      <div>
        <h3 className="font-display text-lg font-bold">Charting your route to {destination}…</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          We're sequencing stops and daily pacing into one smooth trail. This only takes a moment.
        </p>
      </div>
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}