import { cn } from "@/lib/utils";
import * as React from "react";

export interface DataResidencyRegion {
  region: string;
  storage?: string;
  processing?: string;
  note?: string;
}

export interface LandingProductDataResidencyProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  regions: DataResidencyRegion[];
}

export const LandingProductDataResidency = React.forwardRef<
  HTMLElement,
  LandingProductDataResidencyProps
>(({ className, title = "Make data residency easy to verify", description, regions, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[1fr_0.9fr_0.9fr]">
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Region</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Storage</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Processing</div>
          </div>
          <div className="divide-y divide-border">
            {regions.map((item) => (
              <article key={item.region} className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_0.9fr_0.9fr] md:px-6">
                <div>
                  <h3 className="text-base font-semibold tracking-tight">{item.region}</h3>
                  {item.note ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p> : null}
                </div>
                <div className="text-sm text-muted-foreground">{item.storage || "Regional"}</div>
                <div className="text-sm text-muted-foreground">{item.processing || "Regional"}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductDataResidency.displayName = "LandingProductDataResidency";