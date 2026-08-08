import { MapPin, ArrowDown } from 'lucide-react'

type Day = {
  day: string
  from: string
  to: string
  note: string
}

const days: Day[] = [
  {
    day: 'Day 1',
    from: 'Kathmandu',
    to: 'Pokhara',
    note: 'Scenic drive with mountain views and lakeside evening.',
  },
  {
    day: 'Day 2',
    from: 'Pokhara',
    to: 'Nayapul',
    note: 'Transfer to trailhead and begin the trek through villages.',
  },
  {
    day: 'Day 3',
    from: 'Ghorepani',
    to: 'ABC Trek',
    note: 'Sunrise at Poon Hill, then onward toward base camp.',
  },
]

export function ItinerarySection() {
  return (
    <section id="itinerary" className="scroll-mt-16 mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Itinerary Preview
        </p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Your day-by-day journey, mapped out
        </h2>
      </div>

      <div className="relative mx-auto mt-14 max-w-2xl">
        <div
          className="absolute bottom-4 left-6 top-4 w-px bg-border md:left-1/2"
          aria-hidden="true"
        />

        <ol className="space-y-6">
          {days.map((d, i) => (
            <li key={d.day} className="relative pl-16 md:pl-0">
              <span
                className="absolute left-6 top-6 z-10 size-3.5 -translate-x-1/2 rounded-full border-2 border-background bg-primary md:left-1/2"
                aria-hidden="true"
              />
              <div
                className={
                  i % 2 === 0
                    ? 'md:mr-[calc(50%+1.5rem)]'
                    : 'md:ml-[calc(50%+1.5rem)]'
                }
              >
                <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                  <span className="inline-flex rounded-full bg-light-blue px-3 py-1 text-xs font-semibold text-primary">
                    {d.day}
                  </span>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <MapPin className="size-4 text-primary" />
                      {d.from}
                    </div>
                    <ArrowDown className="ml-0.5 size-4 text-muted-foreground" />
                    <div className="flex items-center gap-2 font-semibold">
                      <MapPin className="size-4 text-secondary" />
                      {d.to}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {d.note}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
