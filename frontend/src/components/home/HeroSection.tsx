
import { Search, Sparkles, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const chips = [
  'Nature',
  'Adventure',
  'Culture',
  'Trekking',
  'Wildlife',
  'Religious',
  'Villages',
  'Wellness',
]

export function HeroSection() {
  return (
    <section id="home" className="relative isolate overflow-hidden">
      <img
        src="/images/hero-himalayas.jpg"
        alt="Snow-capped Annapurna Himalayan range in Nepal at golden hour"
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-slate-950/55 to-black/70" />

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 py-28 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-lg font-semibold text-white backdrop-blur-sm">
          <Sparkles className="size-4" />
          AI-powered travel planning for Nepal
        </span>

        <h1 className="mt-8 text-balance text-5xl font-bold leading-tight text-white md:text-7xl">
          Discover Nepal Smarter.
        </h1>

        <p className="mt-6 max-w-3xl text-pretty text-xl font-medium leading-relaxed text-white md:text-2xl">
          Find destinations tailored to your interests and generate intelligent
          travel itineraries powered by AI.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button size="lg" className="h-11 rounded-full px-9 text-xl font-bold">
            Explore Destinations
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 rounded-full border-white/40 bg-white/10 px-9 text-xl font-bold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
          >
            <Sparkles className="size-4" />
            Try AI Recommendations
          </Button>
        </div>

        {/* Search */}
        <div className="mt-12 w-full max-w-3xl">
          <div className="flex items-center gap-2 rounded-3xl bg-background p-3 shadow-2xl shadow-black/20 ring-1 ring-black/5">
            <div className="flex flex-1 items-center gap-3 pl-3">
              <Search className="size-5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search destinations, districts or activities..."
                className="w-full bg-transparent py-2.5 text-xl text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button className="h-10 rounded-full px-7 text-base font-bold">Search</Button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-lg font-bold text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/20"
              >
                <MapPin className="size-3.5" />
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
