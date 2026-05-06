import { cn } from "@/lib/utils";
import * as React from "react";

export interface PriorityMatrixItem {
  title: string;
  impact: string;
  effort: string;
  note?: string;
}

export interface LandingProductPriorityMatrixProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: PriorityMatrixItem[];
}

export const LandingProductPriorityMatrix = React.forwardRef<HTMLElement, LandingProductPriorityMatrixProps>(
  ({ className, title = "Make priorities visible before every request looks urgent", description, items, ...props }, ref) => {
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
                <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-primary/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Impact</div>
                    <div className="mt-2 text-sm font-medium">{item.impact}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Effort</div>
                    <div className="mt-2 text-sm font-medium">{item.effort}</div>
                  </div>
                </div>
                {item.note ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.note}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductPriorityMatrix.displayName = "LandingProductPriorityMatrix";