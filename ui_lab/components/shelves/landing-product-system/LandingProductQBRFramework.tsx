import { cn } from "@/lib/utils";
import * as React from "react";

export interface QBRFrameworkItem {
  title: string;
  owner?: string;
  objective?: string;
  deliverables: string[];
}

export interface LandingProductQBRFrameworkProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: QBRFrameworkItem[];
}

export const LandingProductQBRFramework = React.forwardRef<
  HTMLElement,
  LandingProductQBRFrameworkProps
>(({ className, title = "Frame quarterly reviews around outcomes, not anecdotes", description, items, ...props }, ref) => {
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
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                {item.owner ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.owner}</div> : null}
              </div>
              {item.objective ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.objective}</p> : null}
              <ul className="mt-4 grid gap-2">
                {item.deliverables.map((deliverable) => (
                  <li key={deliverable} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    {deliverable}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductQBRFramework.displayName = "LandingProductQBRFramework";