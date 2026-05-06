import { cn } from "@/lib/utils";
import * as React from "react";

export interface AdoptionSignalsItem {
  title: string;
  audience?: string;
  signal?: string;
  action?: string;
}

export interface LandingProductAdoptionSignalsProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: AdoptionSignalsItem[];
}

export const LandingProductAdoptionSignals = React.forwardRef<HTMLElement, LandingProductAdoptionSignalsProps>(
  ({ className, title = "Make adoption visible through signals that change behavior", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{item.audience || "Audience"}</span>
                  <span>{item.signal || "Signal"}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{item.title}</h3>
                {item.action ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.action}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductAdoptionSignals.displayName = "LandingProductAdoptionSignals";