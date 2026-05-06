import { cn } from "@/lib/utils";
import * as React from "react";

export interface RevenueMotionItem {
  title: string;
  buyer?: string;
  trigger?: string;
  outcome?: string;
}

export interface LandingProductRevenueMotionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: RevenueMotionItem[];
}

export const LandingProductRevenueMotion = React.forwardRef<HTMLElement, LandingProductRevenueMotionProps>(
  ({ className, title = "Show how revenue motion changes across contexts", description, items, ...props }, ref) => {
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
                <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{item.buyer || "Buyer"}</span>
                  <span>{item.trigger || "Trigger"}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{item.title}</h3>
                {item.outcome ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.outcome}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductRevenueMotion.displayName = "LandingProductRevenueMotion";