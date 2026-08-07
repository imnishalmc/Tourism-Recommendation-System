import { CalendarDays, MapPin, Wallet } from "lucide-react";

const plannerFields = [
  {
    label: "Trip Length",
    value: "5 days",
    icon: CalendarDays,
  },
  {
    label: "Starting Point",
    value: "Kathmandu",
    icon: MapPin,
  },
  {
    label: "Budget",
    value: "Medium",
    icon: Wallet,
  },
];

export function ItineraryGenerator() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="grid gap-6 md:grid-cols-3">
        {plannerFields.map((field) => {
          const Icon = field.icon;

          return (
            <div
              key={field.label}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 text-primary">
                <Icon className="size-5" />
                <h2 className="text-sm font-semibold uppercase tracking-wide">
                  {field.label}
                </h2>
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight">
                {field.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight">
          Suggested itinerary
        </h2>
        <ol className="mt-5 space-y-4">
          {["Kathmandu arrival", "Drive to Pokhara", "Explore Phewa Lake"].map(
            (item, index) => (
              <li key={item} className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-light-blue text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <span className="pt-1 text-sm font-medium">{item}</span>
              </li>
            ),
          )}
        </ol>
      </div>
    </section>
  );
}
