import { cn } from "@/lib/utils";
import * as React from "react";

// ─── GlowBg helper ─────────────────────────────────────────────────────────
const GlowBg = ({ className, variant = "primary" }: { className?: string; variant?: "primary" | "secondary" }) => (
  <div aria-hidden="true" className={cn("absolute pointer-events-none blur-[100px]", variant === "primary" ? "bg-primary/20" : "bg-secondary/20", className)} />
);

/**
 * Numbered step layout for `LandingProductFeature` children.
 *
 * `display='list'` (default) — vertical stacked list with alternating odd/even wrappers.
 * `display='grid'` — 3-column responsive grid.
 *
 * Adds `steps` and either `list` or `sgrid` className on the container so nested
 * `LandingProductFeature` components can apply context-aware `[.steps_&]:...` variants.
 */
export const LandingProductSteps = ({
  children,
  className,
  innerClassName,
  title,
  titleComponent,
  description,
  descriptionComponent,
  withBackground = false,
  withBackgroundGlow = false,
  variant = "primary",
  backgroundGlowVariant = "primary",
  containerType = "wide",
  display = "list",
}: {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  withBackground?: boolean;
  withBackgroundGlow?: boolean;
  variant?: "primary" | "secondary";
  backgroundGlowVariant?: "primary" | "secondary";
  containerType?: "narrow" | "wide" | "ultrawide";
  display?: "list" | "grid";
}) => (
  <section
    className={cn(
      "relative w-full flex flex-col items-center gap-8 py-12 lg:py-16",
      withBackground && variant === "primary" ? "bg-primary/5 dark:bg-primary/10" : "",
      withBackground && variant === "secondary" ? "bg-secondary/5 dark:bg-secondary/10" : "",
      withBackgroundGlow ? "overflow-hidden" : "",
      className,
    )}
  >
    {withBackgroundGlow && (
      <GlowBg className="w-1/2 h-auto top-0 left-1/4 opacity-40" variant={backgroundGlowVariant} />
    )}

    {(title || description || titleComponent || descriptionComponent) && (
      <div className="relative flex flex-col items-center text-center gap-4 px-6">
        {titleComponent || (title && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight max-w-2xl">
            {title}
          </h2>
        ))}
        {descriptionComponent || (description && (
          <p className="md:text-xl max-w-2xl">{description}</p>
        ))}
      </div>
    )}

    <div
      className={cn(
        "relative w-full px-6",
        containerType === "narrow" ? "max-w-3xl mx-auto" : "",
        containerType === "wide" ? "max-w-6xl mx-auto" : "",
        containerType === "ultrawide" ? "max-w-7xl mx-auto" : "",
      )}
    >
      <div
        className={cn(
          "steps",
          display === "list" ? "list flex flex-col" : "sgrid grid gap-4 lg:grid-cols-3",
          innerClassName,
        )}
      >
        {React.Children.map(children, (child, i) => {
          const isOdd = i % 2 !== 0;
          return (
            <div
              className={cn(
                "contents",
                `step`,
                isOdd ? "odd" : "even",
              )}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
