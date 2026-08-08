import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ItineraryStop } from '@/types/itinerary';

const BADGE_STYLES: Record<string, string> = {
  Travel: 'bg-secondary text-secondary-foreground',
  Culture: 'bg-accent text-accent-foreground',
  Explore: 'bg-amber-100 text-amber-800',
  Nature: 'bg-soft-green text-secondary',
  Adventure: 'bg-primary/10 text-primary',
  Trekking: 'bg-primary/10 text-primary',
  Wildlife: 'bg-amber-100 text-amber-800',
  Relax: 'bg-light-blue text-primary',
  Food: 'bg-accent text-accent-foreground',
};

function DayMarker({ label }: { label: string }) {
  return (
    <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background font-display text-xs font-bold text-primary shadow-sm">
      {label}
    </span>
  );
}

function TrailConnector() {
  return (
    <div className="relative w-full flex-1">
      <svg className="absolute inset-0 h-full w-full text-primary/35" viewBox="0 0 40 100" preserveAspectRatio="none" aria-hidden>
        <path d="M20 0 C 33 24, 7 52, 20 74 S 30 92, 20 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 7" />
      </svg>
    </div>
  );
}

export function TrailTimeline({ stops }: { stops: ItineraryStop[] }) {
  return (
    <div className="flex flex-col">
      {stops.map((stop, index) => {
        const isLast = index === stops.length - 1;
        return (
          <div key={`${stop.day}-${stop.to}-${index}`} className="flex gap-4">
            <div className="flex w-10 shrink-0 flex-col items-center">
              <DayMarker label={String(stop.day)} />
              {!isLast && <TrailConnector />}
            </div>
            <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
              <Card className="flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base font-bold">{stop.title}</h3>
                      <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', BADGE_STYLES[stop.badge] ?? 'bg-muted text-muted-foreground')}>
                        {stop.badge}
                      </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 text-primary" aria-hidden />
                      {stop.from} → {stop.to}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{stop.description}</p>
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  );
}