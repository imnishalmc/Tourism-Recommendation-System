import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import { PROVINCES } from '@/constants/categories'
import { getDestinations } from '@/services/destinationService'

export function ProvinceExplorer() {
  const [index, setIndex] = useState(0)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    Promise.all(
      PROVINCES.map(async (p) => {
        try {
          const res = await getDestinations({ province: p.value })
          return [p.value, res.count] as const
        } catch {
          return [p.value, 0] as const
        }
      })
    ).then((entries) => {
      if (!cancelled) setCounts(Object.fromEntries(entries))
    })

    return () => {
      cancelled = true
    }
  }, [])

  const province = PROVINCES[index]
  const count = counts[province.value]

  function goPrev() {
    setIndex((i) => (i - 1 + PROVINCES.length) % PROVINCES.length)
  }

  function goNext() {
    setIndex((i) => (i + 1) % PROVINCES.length)
  }

  function viewDestinations() {
    navigate(`/destination?province=${encodeURIComponent(province.value)}`)
  }

  return (
    <section className="bg-muted/60 py-20">
      <div className="mx-auto max-w-4xl px-4">
        <p className="text-sm font-semibold text-muted-foreground">Explore Nepal</p>
        <h2 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
          Explore by province
        </h2>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous province"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-background"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex flex-1 flex-col items-center gap-6 rounded-2xl border border-border bg-background p-6 shadow-sm sm:flex-row">
              <div className="group relative z-10 size-40 shrink-0 sm:size-48">
              <img
                src={province.image}
                alt={`Map of ${province.label} province`}
                className="size-full rounded-xl object-cover shadow-sm transition-transform duration-300 ease-out group-hover:scale-[3] group-hover:shadow-2xl"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-medium text-muted-foreground">
                Province {index + 1} of {PROVINCES.length}
              </p>
              <h3 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
                {province.label}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {count !== undefined ? count : '—'} destinations across{' '}
                {province.description}
              </p>

              <button
                type="button"
                onClick={viewDestinations}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                View destinations
                <ArrowUpRight className="size-3.5" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next province"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-background"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {PROVINCES.map((p, i) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to ${p.label}`}
              className={`size-1.5 rounded-full transition-colors ${
                i === index ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}