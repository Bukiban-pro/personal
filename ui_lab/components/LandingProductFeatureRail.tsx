import { cn } from "@/lib/utils";
import * as React from "react";

export interface FeatureRailItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface LandingProductFeatureRailProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: FeatureRailItem[];
}

export const LandingProductFeatureRail = React.forwardRef<HTMLElement, LandingProductFeatureRailProps>(
  ({ className, title, description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                {item.icon ? <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">{item.icon}</div> : null}
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                  {item.description ? <p className="text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductFeatureRail.displayName = "LandingProductFeatureRail";
