import { cn } from "@/lib/utils";
import * as React from "react";

export interface RevenueAlignmentItem {
  team: string;
  responsibility?: string;
  output?: string;
  description?: string;
}

export interface LandingProductRevenueAlignmentProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: RevenueAlignmentItem[];
}

export const LandingProductRevenueAlignment = React.forwardRef<HTMLElement, LandingProductRevenueAlignmentProps>(
  ({ className, title = "Align revenue teams before handoffs break", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.team} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{item.team}</h3>
                {item.responsibility ? <div className="mt-2 text-sm font-medium text-foreground">{item.responsibility}</div> : null}
                {item.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
                {item.output ? <div className="mt-4 text-sm text-muted-foreground">Output: {item.output}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductRevenueAlignment.displayName = "LandingProductRevenueAlignment";