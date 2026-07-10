import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductPricingToggle
 * Monthly / annual billing toggle with animated pill indicator.
 * Clean SaaS pricing section — standard pattern from Stripe, Linear, etc.
 */

export interface PricingTier {
  name: string;
  priceMonthly: number | string;
  priceAnnual: number | string;
  description: string;
  features: string[];
  cta?: string;
  badge?: string;
  highlighted?: boolean;
}

export interface LandingProductPricingToggleProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  tiers?: PricingTier[];
  annualDiscount?: string;
}

const DEFAULT_TIERS: PricingTier[] = [
  {
    name: "Starter",
    priceMonthly: 49,
    priceAnnual: 39,
    description: "For small sales teams getting started with pipeline visibility.",
    features: [
      "Up to 5 seats",
      "CRM bi-directional sync",
      "Pipeline board",
      "Email & Slack support",
    ],
    cta: "Start free trial",
  },
  {
    name: "Growth",
    priceMonthly: 149,
    priceAnnual: 119,
    description: "For scaling teams that need AI forecasting and coaching.",
    features: [
      "Up to 30 seats",
      "AI forecast scoring",
      "Call intelligence",
      "Stakeholder maps",
      "Priority support",
    ],
    cta: "Start free trial",
    badge: "Most popular",
    highlighted: true,
  },
  {
    name: "Enterprise",
    priceMonthly: "Custom",
    priceAnnual: "Custom",
    description: "Unlimited seats, advanced security, and dedicated success management.",
    features: [
      "Unlimited seats",
      "SSO + SCIM provisioning",
      "Field-level encryption",
      "Custom SLA",
      "Dedicated CSM",
    ],
    cta: "Talk to sales",
  },
];

export const LandingProductPricingToggle = React.forwardRef<HTMLElement, LandingProductPricingToggleProps>(
  (
    {
      className,
      title = "Simple, transparent pricing",
      description = "Upgrade or downgrade at any time. No hidden fees.",
      tiers = DEFAULT_TIERS,
      annualDiscount = "Save 20%",
      ...props
    },
    ref,
  ) => {
    const [annual, setAnnual] = React.useState(true);

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
            {description ? (
              <p className="max-w-xl text-base text-muted-foreground md:text-lg">{description}</p>
            ) : null}

            {/* Toggle */}
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={cn(
                  "text-sm font-medium transition-colors",
                  !annual ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setAnnual((v) => !v)}
                className="relative h-6 w-11 rounded-full border border-border bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                role="switch"
                aria-checked={annual}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-primary shadow-sm transition-transform duration-200",
                    annual ? "translate-x-5" : "translate-x-0.5",
                  )}
                />
              </button>

              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  annual ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Annual
                {annualDiscount ? (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-500">
                    {annualDiscount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          {/* Tiers */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => {
              const price = annual ? tier.priceAnnual : tier.priceMonthly;
              return (
                <div
                  key={tier.name}
                  className={cn(
                    "relative flex flex-col gap-6 rounded-2xl border p-7 shadow-sm",
                    tier.highlighted
                      ? "border-primary/50 bg-card shadow-primary/10"
                      : "border-border bg-card",
                  )}
                >
                  {tier.badge ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                      {tier.badge}
                    </span>
                  ) : null}

                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      {tier.name}
                    </div>
                    <div className="flex items-end gap-1">
                      {typeof price === "number" ? (
                        <>
                          <span className="text-4xl font-bold tracking-tight">${price}</span>
                          <span className="mb-1 text-sm text-muted-foreground">/mo</span>
                        </>
                      ) : (
                        <span className="text-4xl font-bold tracking-tight">{price}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>

                  <ul className="flex flex-col gap-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <svg
                          viewBox="0 0 16 16"
                          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 8l3.5 3.5L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {tier.cta ? (
                    <button
                      type="button"
                      className={cn(
                        "mt-auto w-full rounded-xl py-2.5 text-sm font-medium transition-colors",
                        tier.highlighted
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-border bg-background text-foreground hover:bg-muted",
                      )}
                    >
                      {tier.cta}
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductPricingToggle.displayName = "LandingProductPricingToggle";
