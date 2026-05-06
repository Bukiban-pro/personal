import { cn } from "@/lib/utils";
import * as React from "react";

export interface FrictionMapItem {
  title: string;
  stage?: string;
  severity?: string;
  evidence?: string;
  response?: string;
}

export interface LandingProductFrictionMapProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: FrictionMapItem[];
}

export const LandingProductFrictionMap = React.forwardRef<HTMLElement, LandingProductFrictionMapProps>(
  ({ className, title = "Map friction before it gets explained away as noise", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{item.stage || "Journey stage"}</span>
                  <span>{item.severity || "Severity"}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{item.title}</h3>
                {item.evidence ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.evidence}</p> : null}
                {item.response ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{item.response}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductFrictionMap.displayName = "LandingProductFrictionMap";