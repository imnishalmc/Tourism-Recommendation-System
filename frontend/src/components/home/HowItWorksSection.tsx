import { SlidersHorizontal, Wand2, CalendarCheck } from 'lucide-react'

const steps = [
  {
    icon: SlidersHorizontal,
    step: 'Step 1',
    title: 'Tell us your preferences',
    description:
      'Share your interests, budget, travel dates and the pace you enjoy.',
  },
  {
    icon: Wand2,
    step: 'Step 2',
    title: 'Our AI recommends destinations',
    description:
      'Get matched with places across Nepal that fit exactly what you love.',
  },
  {
    icon: CalendarCheck,
    step: 'Step 3',
    title: 'Generate your itinerary',
    description:
      'Receive a personalized, optimized day-by-day plan ready to go.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          How It Works
        </p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
          From idea to itinerary in three steps
        </h2>
      </div>

      <div className="relative mt-16">
        <div
          className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          aria-hidden="true"
        />
        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="relative flex flex-col items-center  shimmer-color-gray-400 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                <s.icon className="size-7" strokeWidth={2} />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-secondary">
                {s.step}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 max-w-xs leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
