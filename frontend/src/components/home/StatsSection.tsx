import { useEffect, useRef, useState } from "react";

import { getSiteStats } from "../../services/statsServices";

type Stat = {
  value: number;
  suffix: string;
  label: string;
};

function useCountUp(
  target: number,
  active: boolean,
  duration = 1600
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }

    let raf = 0;

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(
        (now - start) / duration,
        1
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      setValue(
        Math.floor(eased * target)
      );

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [target, active, duration]);

  return value;
}

function StatItem({
  stat,
  active,
}: {
  stat: Stat;
  active: boolean;
}) {
  const value = useCountUp(
    stat.value,
    active
  );

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
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);

  const [active, setActive] =
    useState(false);

  const [stats, setStats] =
    useState<Stat[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getSiteStats();

        setStats([
          {
            value: data.destinations,
            suffix: "+",
            label: "Destinations",
          },
        
          {
            value: data.provinces_covered,
            suffix: "",
            label: "Provinces Covered",
          },
          {
            value: data.registered_travelers,
            suffix: "+",
            label: "Registered Travelers",
          },
        ]);
      } catch (error) {
        console.error(
          "Failed to load site statistics:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.3,
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 md:px-10">
      <div
        ref={ref}
        className="rounded-[2rem] bg-primary px-6 py-14 shadow-lg md:px-12"
      >
        {loading ? (
          <div className="flex justify-center">
            <p className="text-primary-foreground">
              Loading statistics...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
            {stats.map((stat) => (
              <StatItem
                key={stat.label}
                stat={stat}
                active={active}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}