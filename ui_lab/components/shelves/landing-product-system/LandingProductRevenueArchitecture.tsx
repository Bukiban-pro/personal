import { cn } from "@/lib/utils";
import * as React from "react";

export interface RevenueArchitectureLayer {
  title: string;
  motion?: string;
  conversion?: string;
  dependency?: string;
}

export interface LandingProductRevenueArchitectureProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  layers: RevenueArchitectureLayer[];
}

export const LandingProductRevenueArchitecture = React.forwardRef<HTMLElement, LandingProductRevenueArchitectureProps>(
  ({ className, title = "Show revenue as architecture instead of a single funnel story", description, layers, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {layers.map((layer) => (
              <article key={layer.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{layer.title}</h3>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-xl border border-border bg-primary/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Motion</div>
                    <div className="mt-2 text-sm font-medium">{layer.motion || "Motion"}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Conversion</div>
                    <div className="mt-2 text-sm font-medium">{layer.conversion || "Conversion"}</div>
                  </div>
                </div>
                {layer.dependency ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{layer.dependency}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductRevenueArchitecture.displayName = "LandingProductRevenueArchitecture";