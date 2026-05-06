import { cn } from "@/lib/utils";
import * as React from "react";

export interface BeforeAfterItem {
  label: string;
  before: string;
  after: string;
}

export interface LandingProductBeforeAfterProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: BeforeAfterItem[];
}

export const LandingProductBeforeAfter = React.forwardRef<HTMLElement, LandingProductBeforeAfterProps>(
  ({ className, title, description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item.label} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/50 px-5 py-3 text-sm font-semibold">{item.label}</div>
                <div className="grid gap-0 md:grid-cols-2">
                  <div className="border-b border-border px-5 py-5 md:border-b-0 md:border-r md:border-border">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Before</div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.before}</p>
                  </div>
                  <div className="px-5 py-5">
                    <div className="text-xs font-medium uppercase tracking-wide text-foreground">After</div>
                    <p className="mt-2 text-sm leading-6 text-foreground">{item.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductBeforeAfter.displayName = "LandingProductBeforeAfter";
