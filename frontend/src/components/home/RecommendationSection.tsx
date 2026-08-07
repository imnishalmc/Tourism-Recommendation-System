import { Sparkles, Wallet, Clock, TrendingUp } from 'lucide-react'

type Rec = {
  match: number
  title: string
  tags: string[]
  budget: string
  trip: string
  difficulty: string
}

const recs: Rec[] = [
  {
    match: 87,
    title: 'Langtang Valley Trek',
    tags: ['Nature', 'Photography', 'Adventure'],
    budget: 'Medium',
    trip: '5 Days',
    difficulty: 'Moderate',
  },
  {
    match: 82,
    title: 'Upper Mustang Expedition',
    tags: ['Culture', 'Trekking', 'Villages'],
    budget: 'High',
    trip: '9 Days',
    difficulty: 'Challenging',
  },
  {
    match: 78,
    title: 'Pokhara & Phewa Lake',
    tags: ['Nature', 'Wellness', 'Relax'],
    budget: 'Low',
    trip: '3 Days',
    difficulty: 'Easy',
  },
]

export function RecommendationsSection() {
  return (
    <section
      id="recommendations"
      className="scroll-mt-16 bg-light-blue/60 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            AI Recommendations
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Matches picked just for you
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            A preview of how Sajilo Yatra ranks destinations against your unique
            travel profile.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {recs.map((r) => (
            <div
              key={r.title}
              className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-200 px-3 py-1 text-sm font-bold text-primary">
                  <TrendingUp className="size-4" />
                  {r.match}% Match
                </span>
              </div>

              <h3 className="mt-4 text-xl font-semibold tracking-tight">
                {r.title}
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-light-blue px-3 py-1 text-xs font-medium text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5">
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Wallet className="size-4" />
                    <span className="text-xs">Budget</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold">{r.budget}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-4" />
                    <span className="text-xs">Trip</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold">{r.trip}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <TrendingUp className="size-4" />
                    <span className="text-xs">Level</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold">{r.difficulty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
