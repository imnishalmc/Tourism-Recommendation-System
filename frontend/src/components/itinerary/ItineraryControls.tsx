import { useState } from "react";
import { LocateFixed, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { BudgetLevel, ItineraryRequest, Pace } from "@/types/itinerary";

interface Props { initialDestination?: string; onGenerate: (request: ItineraryRequest) => void; busy?: boolean; }
const interestsAvailable = ["nature", "adventure", "culture", "wildlife", "trekking", "food", "photography"];

export function ItineraryControls({ initialDestination = "", onGenerate, busy }: Props) {
  const [destination, setDestination] = useState(initialDestination);
  const [startingLocation, setStartingLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState<BudgetLevel>("Medium");
  const [pace, setPace] = useState<Pace>("moderate");
  const [interests, setInterests] = useState(["nature", "culture"]);
  const useCurrentLocation = () => navigator.geolocation?.getCurrentPosition((position) => { setCoords({ lat: position.coords.latitude, lng: position.coords.longitude }); setStartingLocation(""); });
  const submit = () => { if (!destination.trim() || (!coords && !startingLocation.trim())) return; onGenerate({ destination: destination.trim(), days, budget, travelers: 1, pace, interests, starting_location: coords ? "" : startingLocation.trim(), ...(coords ? { latitude: coords.lat, longitude: coords.lng } : {}) }); };
  return <Card className="p-5 sm:p-6"><div className="flex items-center gap-2"><Sparkles className="size-5 text-primary" /><div><h2 className="font-semibold">Plan your trip</h2><p className="text-xs text-muted-foreground">Tune the details, then generate a trail.</p></div></div><div className="mt-6 grid gap-5">
    <label className="grid gap-2 text-sm font-medium">Destination<Input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="e.g. Pokhara" /></label>
    <label className="grid gap-2 text-sm font-medium">Starting from{coords ? <div className="flex items-center justify-between rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-sm"><span>Using current location</span><button onClick={() => { setCoords(null); setStartingLocation("Kathmandu"); }} className="text-xs">Clear</button></div> : <Input value={startingLocation} onChange={(event) => setStartingLocation(event.target.value)} placeholder="e.g. Kathmandu,pokhara.." />}<button type="button" onClick={useCurrentLocation} className="flex w-fit items-center gap-1 text-xs text-primary"><LocateFixed className="size-3" />Use my current location</button></label>
    <label className="grid gap-2 text-sm font-medium">Trip length (days)<Input type="number" min={1} max={30} value={days} onChange={(event) => setDays(Math.min(30, Math.max(1, Number(event.target.value) || 1)))} /></label>
    <label className="grid gap-2 text-sm font-medium">Budget<select value={budget} onChange={(event) => setBudget(event.target.value as BudgetLevel)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="Low">Budget</option><option value="Medium">Comfort</option><option value="High">Premium</option></select></label>
    <div className="grid gap-2"><span className="text-sm font-medium">Pace</span><div className="grid grid-cols-1 gap-2 sm:grid-cols-3">{(["relaxed", "moderate", "fast"] as Pace[]).map((item) => <button key={item} type="button" onClick={() => setPace(item)} className={`rounded-lg border p-2 text-sm capitalize ${pace === item ? "border-primary bg-primary/5" : "border-border"}`}>{item}</button>)}</div></div>
    <div className="grid gap-2"><span className="text-sm font-medium">Interests</span><div className="flex flex-wrap gap-2">{interestsAvailable.map((item) => <button key={item} type="button" onClick={() => setInterests((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} className={`rounded-full border px-3 py-1 text-xs capitalize ${interests.includes(item) ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>{item}</button>)}</div></div>
    <Button size="lg" className="w-full" onClick={submit} disabled={busy || !destination.trim() || (!coords && !startingLocation.trim())}>{busy ? "Generating..." : "Generate itinerary"}</Button>
  </div></Card>;
}
