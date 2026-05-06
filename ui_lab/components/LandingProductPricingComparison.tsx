import { cn } from "@/lib/utils";
import * as React from "react";

export interface PricingTier {
  name: string;
  price: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
}

export interface LandingProductPricingComparisonProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  tiers: PricingTier[];
}

export const LandingProductPricingComparison = React.forwardRef<HTMLElement, LandingProductPricingComparisonProps>(
  ({ className, title = "Pricing", description, tiers, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "flex flex-col rounded-2xl border p-6 shadow-sm",
                  tier.highlighted ? "border-primary bg-primary/5" : "border-border bg-card",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
                    {tier.description ? <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p> : null}
                  </div>
                  <div className="text-2xl font-semibold tracking-tight">{tier.price}</div>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="mt-0.5 text-primary">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductPricingComparison.displayName = "LandingProductPricingComparison";
