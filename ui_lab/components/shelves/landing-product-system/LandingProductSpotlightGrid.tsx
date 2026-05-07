import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductSpotlightGrid
 * Feature grid where each card has a radial spotlight that follows the cursor.
 * Pattern from: Magic UI / Magic Card — spotlight effect via CSS custom properties.
 */

export interface SpotlightFeature {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export interface LandingProductSpotlightGridProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  features?: SpotlightFeature[];
  spotlightColor?: string;
}

const DEFAULT_FEATURES: SpotlightFeature[] = [
  {
    title: "Revenue Intelligence",
    description: "Unify every signal from CRM, email, and call data into one live pipeline view.",
  },
  {
    title: "Forecast Confidence",
    description: "AI-powered commit scoring reduces forecast error by 60% in the first quarter.",
  },
  {
    title: "Stakeholder Coverage",
    description: "Map the full buying committee and track engagement depth across every contact.",
  },
  {
    title: "Deal Risk Alerts",
    description: "Surface slipping deals 30 days earlier with behavioral anomaly detection.",
  },
  {
    title: "Multi-Team Alignment",
    description: "Sales, CS, and finance share one source of truth — no more spreadsheet wars.",
  },
  {
    title: "Enterprise Security",
    description: "SOC 2 Type II certified with SSO, SCIM, and field-level encryption.",
  },
];

function SpotlightCard({
  feature,
  spotlightColor,
}: {
  feature: SpotlightFeature;
  spotlightColor: string;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-black/20"
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-10 flex flex-col gap-3">
        {feature.icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground">
            {feature.icon}
          </div>
        ) : null}
        <h3 className="text-base font-semibold tracking-tight">{feature.title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
      </div>
    </div>
  );
}

export const LandingProductSpotlightGrid = React.forwardRef<HTMLElement, LandingProductSpotlightGridProps>(
  (
    {
      className,
      title = "Everything your revenue team needs",
      description = "Built for the entire go-to-market motion — from first touch to closed-won.",
      features = DEFAULT_FEATURES,
      spotlightColor = "rgba(99,102,241,0.15)",
      ...props
    },
    ref,
  ) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
          {(title || description) && (
            <div className="flex flex-col gap-3 text-center">
              {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
              {description ? (
                <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
              ) : null}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <SpotlightCard key={f.title} feature={f} spotlightColor={spotlightColor} />
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductSpotlightGrid.displayName = "LandingProductSpotlightGrid";
