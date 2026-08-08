import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Route, Users, Wallet, Calendar } from 'lucide-react';
import { ItineraryControls } from './ItineraryControls';
import { TrailTimeline } from './TrailTimeline';
import { GeneratingState } from './GeneratingState';
import { generateItinerary, ItineraryGenerationError } from '@/lib/itinerary';
import type { ItineraryRequest, ItineraryResponse } from '@/types/itinerary';

type Status = 'idle' | 'generating' | 'ready' | 'error' | 'regenerating';

export function ItineraryGenerator() {
  const [params] = useSearchParams();
  const initialDestination = params.get('destination') ?? '';

  const [status, setStatus] = useState<Status>('idle');
  const [plan, setPlan] = useState<ItineraryResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<ItineraryRequest | null>(null);
  const [pendingDest, setPendingDest] = useState('');
  const [error, setError] = useState('');

  async function runGenerate(req: ItineraryRequest, mode: 'generating' | 'regenerating') {
    setStatus(mode);
    setPendingDest(req.destination);
    setError('');
    try {
      const data = await generateItinerary(req);
      setPlan(data);
      setLastRequest(req);
      setStatus('ready');
    } catch (err) {
      setError(
        err instanceof ItineraryGenerationError
          ? err.message
          : 'Could not generate an itinerary right now. Please try again.',
      );
      setStatus('error');
    }
  }

  function handleGenerate(req: ItineraryRequest) {
    setPlan(null);
    runGenerate(req, 'generating');
  }

  function handleRemoveStop() {
    if (!lastRequest || !plan) return;
    const newDays = Math.max(1, plan.days - 1);
    if (newDays === plan.days) return; // already at 1 day, nothing to shrink
    runGenerate({ ...lastRequest, days: newDays }, 'regenerating');
  }

  const isBusy = status === 'generating' || status === 'regenerating';

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ItineraryControls
            initialDestination={initialDestination}
            onGenerate={handleGenerate}
            busy={isBusy}
          />
        </aside>

        <div className="min-w-0">
          {status === 'idle' && (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
              <h2 className="text-xl font-bold">Your trail appears here</h2>
              <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
                Set your destination, dates and interests on the left, then generate a day-by-day route.
              </p>
            </div>
          )}

          {(status === 'generating' || status === 'regenerating') && (
            <GeneratingState destination={pendingDest} />
          )}

          {status === 'error' && (
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
              <h2 className="text-lg font-bold text-destructive">Couldn't generate this itinerary</h2>
              <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
            </div>
          )}

          {status === 'ready' && plan && (
            <div className="flex flex-col gap-6">
              <PlanHeader plan={plan} />
              <TrailTimeline stops={plan.itinerary} onRemoveStop={handleRemoveStop} canRemove={plan.days > 1} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PlanHeader({ plan }: { plan: ItineraryResponse }) {
  const stats = [
    { icon: Calendar, label: `${plan.days} days` },
    // { icon: Users, label: `${plan.travelers} traveler${plan.travelers > 1 ? 's' : ''}` },
    { icon: Route, label: `From ${plan.starting_location}` },
    { icon: Wallet, label: plan.plan_type },
  ];
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-primary to-secondary-foreground p-6 text-primary-foreground shadow-sm">
      <h1 className="text-balance text-2xl font-bold sm:text-3xl">
        {plan.days}-day journey to {plan.destination}
      </h1>
      <div className="flex flex-wrap gap-4">
        {stats.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/90">
            <s.icon className="size-4" aria-hidden /> {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}