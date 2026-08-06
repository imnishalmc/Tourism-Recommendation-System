import { Star } from 'lucide-react'

type Testimonial = {
  quote: string
  name: string
  role: string
  initials: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      'The AI recommendations nailed exactly what I wanted — quiet trails, great photography spots and local villages. Best planning tool I have used.',
    name: 'Aashma Gurung',
    role: 'Solo traveler, Kathmandu',
    initials: 'AG',
  },
  {
    quote:
      'We planned a 9-day Mustang trip in minutes. The day-by-day itinerary saved us so much back-and-forth and everything flowed perfectly.',
    name: 'Daniel Meyer',
    role: 'Traveler from Germany',
    initials: 'DM',
  },
  {
    quote:
      'As a first-timer in Nepal, Sajilo Yatra made me feel confident. Verified info, honest difficulty levels and beautiful destinations.',
    name: 'Priya Sharma',
    role: 'Family trip, Pokhara',
    initials: 'PS',
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Loved by travelers
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Stories from the trail
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-sm"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-pretty leading-relaxed text-foreground/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-light-blue text-sm font-bold text-primary">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
