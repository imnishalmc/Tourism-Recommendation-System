// components/home/hero-section.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Sparkles, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Chip label -> backend main_category value (see constants/categories.ts)
const chips: { label: string; category: string }[] = [
  { label: 'Nature', category: 'natural' },
  { label: 'Adventure', category: 'trekking_adventure' },
  { label: 'Culture', category: 'cultural_religious' },
  { label: 'Trekking', category: 'trekking_adventure' },
  { label: 'Wildlife', category: 'wildlife_conservation' },

  { label: 'Villages', category: 'village_rural' },
  { label: 'Wellness', category: 'wellness_relaxation' },
]

export function HeroSection() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/destination?search=${encodeURIComponent(trimmed)}` : '/explore')
  }

  function handleChipClick(category: string) {
    navigate(`/destination?main_category=${category}`)
  }

  return (
    <section id="home" className="relative isolate overflow-hidden">
      <img
        src="/images/hero-himalayas.jpg"
        alt="Snow-capped Annapurna Himalayan range in Nepal at golden hour"
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-slate-950/55 to-black/70" />

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-24 text-center sm:px-5 sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm sm:px-5 sm:py-2 sm:text-lg">
          <Sparkles className="size-4" />
          AI-powered travel planning for Nepal
        </span>

        <h1 className="mt-8 text-balance text-4xl font-bold leading-tight text-white sm:text-5xl md:text-7xl">
          Discover Nepal Smarter.
        </h1>

        <p className="mt-6 max-w-3xl text-pretty text-base font-medium leading-relaxed text-white sm:text-xl md:text-2xl">
          Find destinations tailored to your interests and generate intelligent
          travel itineraries powered by AI.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-11 w-full rounded-full px-6 text-base font-bold sm:w-auto sm:px-9 sm:text-xl"
            onClick={() => navigate('/destination')}
          >
            Explore Destinations
          </Button>
        </div>

        {/* Search */}
        <div className="mt-12 w-full max-w-3xl">
          <form
            onSubmit={handleSearch}
            className="flex flex-col items-stretch gap-2 rounded-3xl bg-background p-3 shadow-2xl shadow-black/20 ring-1 ring-black/5 sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-3 pl-3">
              <Search className="size-5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, districts or activities..."
                className="w-full bg-transparent py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-xl"
              />
            </div>
            <Button type="submit" className="h-10 w-full rounded-full px-7 text-base font-bold sm:w-auto">
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleChipClick(chip.category)}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/20 sm:px-5 sm:py-2 sm:text-lg"
              >
                <MapPin className="size-3.5" />
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
