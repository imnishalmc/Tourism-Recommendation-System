import { useState } from 'react';
import { Sparkles, LocateFixed } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
// import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import type { BudgetLevel, ItineraryRequest, Pace } from '@/types/itinerary';

interface Props {
  initialDestination?: string;
  onGenerate: (req: ItineraryRequest) => void;
  busy?: boolean;
}

const PACES: { value: Pace; label: string; hint: string }[] = [
  { value: 'relaxed', label: 'Relaxed', hint: 'Fewer stops, more rest' },
  { value: 'moderate', label: 'Moderate', hint: 'A balanced rhythm' },
  { value: 'fast', label: 'Fast', hint: 'Cover the most ground' },
];

const INTEREST_OPTIONS = ['nature', 'adventure', 'culture', 'wildlife', 'trekking', 'food', 'photography'];

export function ItineraryControls({ initialDestination = '', onGenerate, busy }: Props) {
  const [destination, setDestination] = useState(initialDestination);
  const [startingLocation, setStartingLocation] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState<BudgetLevel>('Medium');
  const [pace, setPace] = useState<Pace>('moderate');
  const [interests, setInterests] = useState<string[]>(['nature', 'culture']);

  function toggleInterest(tag: string) {
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStartingLocation(''); // clear text so backend's GPS branch actually triggers
        setLocating(false);
      },
      () => {
        setLocationError('Could not get your location. Check browser permissions.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  function clearLocationOverride() {
    setCoords(null);
    setStartingLocation('Kathmandu');
  }

  function submit() {
    if (!destination.trim()) return;
    if (!coords && !startingLocation.trim()) return; // need one or the other
    onGenerate({
      destination: destination.trim(),
      days,
      budget,
      travelers,
      pace,
      interests,
      starting_location: coords ? '' : startingLocation.trim(),
      ...(coords ? { latitude: coords.lat, longitude: coords.lng } : {}),
    });
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="size-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold leading-tight">Plan your trip</h2>
          <p className="text-xs text-muted-foreground">Tune the details, then generate a trail.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="dest" className="text-sm font-medium">Destination</label>
          <Input id="dest" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Hile" />
        </div>

        <div className="grid gap-2">
          <label htmlFor="start" className="text-sm font-medium">Starting from</label>
          {coords ? (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-sm">
              <span className="flex items-center gap-1.5 text-primary">
                <LocateFixed className="size-3.5" /> Using current location
              </span>
              <button type="button" onClick={clearLocationOverride} className="text-xs text-muted-foreground hover:text-foreground">
                Clear
              </button>
            </div>
          ) : (
            <Input id="start" value={startingLocation} onChange={(e) => setStartingLocation(e.target.value)} placeholder="e.g:Kathmandu,Pokhara.." />
          )}
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="flex w-fit items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-50"
          >
            <LocateFixed className="size-3.5" />
            {locating ? 'Locating…' : 'Use my current location'}
          </button>
          {locationError && <p className="text-xs text-destructive">{locationError}</p>}
        </div>

       <div className="grid gap-2">
  <label htmlFor="days" className="text-sm font-medium">Trip length (days)</label>
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => setDays((d) => Math.max(1, d - 1))}
      disabled={days <= 1}
      className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-lg font-semibold hover:bg-muted disabled:opacity-40"
      aria-label="Decrease days"
    >
      −
    </button>
    <Input
      id="days"
      type="number"
      min={1}
      max={30}
      value={days}
      onChange={(e) => {
        const v = Number(e.target.value);
        if (!Number.isNaN(v)) setDays(Math.min(30, Math.max(1, v)));
      }}
      className="text-center"
    />
    <button
      type="button"
      onClick={() => setDays((d) => Math.min(30, d + 1))}
      disabled={days >= 30}
      className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-lg font-semibold hover:bg-muted disabled:opacity-40"
      aria-label="Increase days"
    >
      +
    </button>
  </div>
</div>

        <div className="grid grid-cols-2 gap-4">
          {/* <div className="grid gap-2">
            <label htmlFor="travelers" className="text-sm font-medium">Travelers</label>
            <Input
              id="travelers" type="number" min={1} max={20} value={travelers}
              onChange={(e) => setTravelers(Math.max(1, Number(e.target.value) || 1))}
            />
          </div> */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Budget</label>
            <Select value={budget} onValueChange={(v) => setBudget(v as BudgetLevel)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Budget</SelectItem>
                <SelectItem value="Medium">Comfort</SelectItem>
                <SelectItem value="High">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Pace</label>
          <div className="grid grid-cols-3 gap-2">
            {PACES.map((p) => {
              const active = pace === p.value;
              return (
                <button
                  key={p.value} type="button" onClick={() => setPace(p.value)}
                  className={`rounded-lg border p-2.5 text-left transition-colors ${active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                >
                  <span className="block text-sm font-medium">{p.label}</span>
                  <span className="block text-[11px] leading-tight text-muted-foreground">{p.hint}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((tag) => {
              const active = interests.includes(tag);
              return (
                <button
                  key={tag} type="button" onClick={() => toggleInterest(tag)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${active ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          size="lg" className="mt-1 w-full gap-2" onClick={submit}
          disabled={busy || !destination.trim() || (!coords && !startingLocation.trim())}
        >
          <Sparkles className="size-4" />
          {busy ? 'Generating…' : 'Generate itinerary'}
        </Button>
      </div>
    </Card>
  );
}