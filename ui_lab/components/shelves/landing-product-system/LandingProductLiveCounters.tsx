import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductLiveCounters
 * Animated number counters that count up when the section enters the viewport.
 * Pattern: Number Ticker / Animated Counter from Magic UI.
 */

export interface CounterStat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  detail?: string;
}

export interface LandingProductLiveCountersProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stats?: CounterStat[];
  /** Duration of count-up animation in ms */
  duration?: number;
}

const DEFAULT_STATS: CounterStat[] = [
  { value: 98, suffix: "%", label: "Forecast accuracy", detail: "Avg across Q3 cohort" },
  { value: 40, suffix: "%", label: "Pipeline coverage gain", detail: "Within 90 days" },
  { value: 3200, suffix: "+", label: "Revenue teams", detail: "Active on the platform" },
  { value: 60, suffix: "%", label: "Faster deal review", detail: "Saved per manager per week" },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCurrent(target);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, duration, active]);

  return current;
}

function CounterCard({ stat, duration }: { stat: CounterStat; duration: number }) {
  const [active, setActive] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const count = useCountUp(stat.value, duration, active);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { rootMargin: "0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="text-4xl font-bold tracking-tight tabular-nums text-foreground md:text-5xl">
        {stat.prefix ?? ""}
        {count.toLocaleString()}
        {stat.suffix ?? ""}
      </div>
      <div className="text-sm font-medium text-foreground">{stat.label}</div>
      {stat.detail ? <div className="text-xs text-muted-foreground">{stat.detail}</div> : null}
    </div>
  );
}

export const LandingProductLiveCounters = React.forwardRef<HTMLElement, LandingProductLiveCountersProps>(
  (
    {
      className,
      title = "Numbers that matter",
      description = "Real results from teams already running on the platform.",
      stats = DEFAULT_STATS,
      duration = 1800,
      ...props
    },
    ref,
  ) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          {(title || description) && (
            <div className="flex flex-col gap-3">
              {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
              {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <CounterCard key={stat.label} stat={stat} duration={duration} />
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductLiveCounters.displayName = "LandingProductLiveCounters";
