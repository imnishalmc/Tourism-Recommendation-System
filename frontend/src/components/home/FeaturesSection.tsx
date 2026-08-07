import { Sparkles, Route, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    description:
      'Personalized destination suggestions using your travel interests, budget and pace.',
    tone: 'blue' as const,
  },
  {
    icon: Route,
    title: 'Smart Itinerary',
    description:
      'Generate optimized day-by-day itineraries that make the most of every trip.',
    tone: 'blue' as const,
  },
  {
    icon: ShieldCheck,
    title: 'Verified Destination Data',
    description:
      'Explore over 1000 destinations across Nepal with trusted, up-to-date information.',
    tone: 'blue' as const,
  },
]

export function FeaturesSection() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Why Sajilo Yatra
        </p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Travel planning, reimagined for Nepal
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Everything you need to explore, plan and experience Nepal with
          confidence.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
          >
            <div
              className={
                f.tone === 'blue'
                  ? 'flex size-14 items-center justify-center rounded-2xl bg-light-blue text-primary'
                  : 'flex size-14 items-center justify-center rounded-2xl bg-soft-green text-secondary'
              }
            >
              <f.icon className="size-7" strokeWidth={2} />
            </div>
            <h3 className="mt-6 text-xl font-semibold tracking-tight">
              {f.title}
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
