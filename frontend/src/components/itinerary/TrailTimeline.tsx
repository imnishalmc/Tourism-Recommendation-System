import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { ItineraryStop } from "@/types/itinerary";

export function TrailTimeline({ stops }: { stops: ItineraryStop[] }) {
  return <div className="flex flex-col">{stops.map((stop, index) => <div key={`${stop.day}-${index}`} className="flex gap-4"><div className="flex w-10 shrink-0 flex-col items-center"><span className="flex size-9 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary">{stop.day}</span>{index < stops.length - 1 && <span className="min-h-8 flex-1 border-l-2 border-dashed border-primary/35" />}</div><Card className={`mb-6 flex-1 p-4 ${index === stops.length - 1 ? "mb-0" : ""}`}><div className="flex items-center gap-2"><h3 className="font-bold">{stop.title}</h3><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{stop.badge}</span></div><p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5 text-primary" />{stop.from} → {stop.to}</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stop.description}</p></Card></div>)}</div>;
}
