import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductBentoFeatures
 * Bento grid layout for features — varied card sizes for visual hierarchy.
 * Pattern: modern SaaS bento (Linear, Vercel, Stripe use this layout).
 */

export interface BentoCard {
  title: string;
  description: string;
  /** "large" spans 2 columns, "tall" spans 2 rows, "hero" spans both */
  size?: "small" | "large" | "tall" | "hero";
  visual?: React.ReactNode;
  badge?: string;
}

export interface LandingProductBentoFeaturesProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  cards?: BentoCard[];
}

const DEFAULT_CARDS: BentoCard[] = [
  {
    title: "Pipeline visibility",
    description:
      "Every deal, every stage, every signal — in one configurable board your entire team trusts.",
    size: "hero",
    badge: "Core",
  },
  {
    title: "AI Forecasting",
    description: "Predictive commit scoring that learns from your close patterns.",
    size: "small",
  },
  {
    title: "Conversation Intelligence",
    description: "Auto-summarize calls and surface buying signals directly in the deal record.",
    size: "small",
  },
  {
    title: "Stakeholder Maps",
    description:
      "Visualize the full buying committee and track who hasn't been engaged this week.",
    size: "large",
    badge: "New",
  },
  {
    title: "Multi-CRM Sync",
    description: "Bi-directional sync with Salesforce, HubSpot, and Pipedrive in real time.",
    size: "small",
  },
  {
    title: "Enterprise Controls",
    description: "SSO, SCIM, field-level encryption, and audit logs. Security first.",
    size: "small",
  },
];

const sizeClasses: Record<NonNullable<BentoCard["size"]>, string> = {
  small: "col-span-1 row-span-1",
  large: "col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
  hero: "col-span-2 row-span-2",
};

export const LandingProductBentoFeatures = React.forwardRef<HTMLElement, LandingProductBentoFeaturesProps>(
  (
    {
      className,
      title = "One platform. Every motion.",
      description = "Replace five point-tools with a single system your entire revenue org lives in.",
      cards = DEFAULT_CARDS,
      ...props
    },
    ref,
  ) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
          {(title || description) && (
            <div className="flex flex-col gap-3">
              {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
              {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
            </div>
          )}

          <div className="grid auto-rows-[minmax(160px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.title}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-border/80 hover:shadow-md",
                  sizeClasses[card.size ?? "small"],
                )}
              >
                {/* Badge */}
                {card.badge ? (
                  <span className="mb-3 inline-flex w-fit rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {card.badge}
                  </span>
                ) : null}

                {/* Visual area */}
                {card.visual ? (
                  <div className="mb-4 flex-1">{card.visual}</div>
                ) : null}

                {/* Text */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductBentoFeatures.displayName = "LandingProductBentoFeatures";
