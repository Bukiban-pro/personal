import { cn } from "@/lib/utils";
import * as React from "react";

export interface ReadinessScoreItem {
  title: string;
  score: string;
  threshold?: string;
  note?: string;
}

export interface LandingProductReadinessScoreProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: ReadinessScoreItem[];
}

export const LandingProductReadinessScore = React.forwardRef<HTMLElement, LandingProductReadinessScoreProps>(
  ({ className, title = "Show readiness as a multidimensional score, not a claim", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.threshold || "Target"}</div>
                <div className="mt-3 text-4xl font-semibold tracking-tight">{item.score}</div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{item.title}</h3>
                {item.note ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.note}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductReadinessScore.displayName = "LandingProductReadinessScore";