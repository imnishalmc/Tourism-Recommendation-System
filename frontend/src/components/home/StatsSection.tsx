

import { useEffect, useRef, useState } from 'react'

type Stat = {
  value: number
  suffix: string
  label: string
}

const stats: Stat[] = [
  { value: 1000, suffix: '+', label: 'Destinations' },
  { value: 500, suffix: '+', label: 'Travel Routes' },
  { value: 7, suffix: '', label: 'Provinces Covered' },
  { value: 12000, suffix: '+', label: 'Happy Travelers' },
]

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
      else setValue(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])
  return value
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const value = useCountUp(stat.value, active)
  return (
    <div className="text-center">
      <p className="text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl">
        {value.toLocaleString()}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-primary-foreground/80 md:text-base">
        {stat.label}
      </p>
    </div>
  )
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
      <div
        ref={ref}
        className="rounded-[2rem] bg-primary px-6 py-14 shadow-lg md:px-12"
      >
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((s) => (
            <StatItem key={s.label} stat={s} active={active} />
          ))}
        </div>
      </div>
    </section>
  )
}
