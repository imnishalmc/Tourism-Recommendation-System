import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Star, ArrowRight, Calendar, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { getDestinations } from '@/services/destinationService'
import { ArrowLeft } from 'lucide-react'

import type { Destination } from '@/types/destination'
import {
  MAIN_CATEGORIES,
  DIFFICULTY_LEVELS,
  CROWD_LEVELS,
  BUDGET_LEVELS,
} from '@/constants/categories'
import { buildImageUrl, buildImageUrlCandidates } from '@/lib/destinationImages'

const difficultyStyles: Record<string, string> = {
  easy: 'bg-soft-green text-secondary',
  moderate: 'bg-light-blue text-primary',
  hard: 'bg-primary/10 text-primary',
  very_hard: 'bg-primary/20 text-primary',
}

const crowdStyles: Record<string, string> = {
  very_low: 'bg-secondary/10 text-secondary',
  low: 'bg-secondary/10 text-secondary',
  moderate: 'bg-muted text-muted-foreground',
  high: 'bg-primary/10 text-primary',
  very_high: 'bg-primary/20 text-primary',
}

function label(list: { value: string; label: string }[], value: string) {
  return list.find((x) => x.value === value)?.label ?? value
}

export function DestinationListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const search = searchParams.get('search') || ''
  const mainCategory = searchParams.get('main_category') || ''
  const difficulty = searchParams.get('difficulty_level') || ''
  const crowd = searchParams.get('crowd_level') || ''
  const budget = searchParams.get('budget_level') || ''

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await getDestinations({
          search: search || undefined,
          main_category: mainCategory || undefined,
          difficulty_level: difficulty || undefined,
          crowd_level: crowd || undefined,
          budget_level: budget || undefined,
        })
        if (!cancelled) setDestinations(data.results)
      } catch (err) {
        if (!cancelled) setError('Could not load destinations. Is the backend running?')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [search, mainCategory, difficulty, crowd, budget])

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  function clearAll() {
    setSearchParams({})
  }

  const hasActiveFilters = search || mainCategory || difficulty || crowd || budget

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-16 md:px-8">

      <div className="m-2">
        <div className="px-2 text-center">

          <Link to="/">
            <Button variant="outline" className="mt-6 rounded-full shimmer-color-gray-400">
              <ArrowLeft className="size-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Explore Destinations
        </h1>
        {search && (
          <p className="mt-2 text-muted-foreground">
            Showing results for <span className="font-semibold text-foreground">"{search}"</span>
          </p>
        )}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <select
          value={mainCategory}
          onChange={(e) => updateFilter('main_category', e.target.value)}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm"
        >
          <option value="">All categories</option>
          {MAIN_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => updateFilter('difficulty_level', e.target.value)}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm"
        >
          <option value="">Any difficulty</option>
          {DIFFICULTY_LEVELS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          value={crowd}
          onChange={(e) => updateFilter('crowd_level', e.target.value)}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm"
        >
          <option value="">Any crowd level</option>
          {CROWD_LEVELS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          value={budget}
          onChange={(e) => updateFilter('budget_level', e.target.value)}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm"
        >
          <option value="">Any budget</option>
          {BUDGET_LEVELS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/70"
          >
            <X className="size-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {loading && <p className="py-12 text-center text-muted-foreground">Loading destinations...</p>}
      {error && <p className="py-12 text-center text-destructive">{error}</p>}
      {!loading && !error && destinations.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No destinations match your filters. Try clearing some.
        </p>
      )}

      {!loading && !error && destinations.length > 0 && (
        <>
          <p className="mb-6 text-sm text-muted-foreground">{destinations.length} destinations found</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <article
                key={d.id}
                className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={buildImageUrl(
                      d.image_url,
                      d.name
                    )}
                    alt={d.name}
                    data-image-index="0"
                    onError={(e) => {
                      const sources = buildImageUrlCandidates(
                        d.image_url,
                        d.name
                      );
                      const currentIndex = Number(
                        e.currentTarget.dataset.imageIndex || 0
                      );
                      const nextIndex = currentIndex + 1;

                      if (nextIndex >= sources.length) {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                        return;
                      }

                      e.currentTarget.dataset.imageIndex = String(nextIndex);
                      e.currentTarget.src = sources[nextIndex];
                    }}
                    className="size-full object-cover transition group-hover:scale-105"
                  />
                  {d.ratings != null && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 text-sm font-semibold">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {d.ratings.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{d.name}</h3>
                  <p className="text-sm text-muted-foreground">{d.district}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={cn('rounded-full px-3 py-1 text-xs font-medium', difficultyStyles[d.difficulty_level])}>
                      {label(DIFFICULTY_LEVELS, d.difficulty_level)}
                    </span>
                    <span className={cn('rounded-full px-3 py-1 text-xs font-medium', crowdStyles[d.crowd_level])}>
                      {label(CROWD_LEVELS, d.crowd_level)} crowd
                    </span>
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{d.description}</p>
                  <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Link to={`/destination/${d.id}`}>
                      <Button variant="outline" className="w-full rounded-full font-semibold">View Details <ArrowRight className="size-4" /></Button>
                    </Link>
                    <Link to={`/itinerary?destination=${encodeURIComponent(d.name)}`}>
                      <Button className="w-full rounded-full font-semibold"><Calendar className="size-4" />Plan trip</Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default DestinationListPage
