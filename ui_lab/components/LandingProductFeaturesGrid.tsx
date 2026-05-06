import { cn } from "@/lib/utils";
import * as React from "react";

// ─── GlowBg helper ─────────────────────────────────────────────────────────
const GlowBg = ({ className, variant = "primary" }: { className?: string; variant?: "primary" | "secondary" }) => (
  <div aria-hidden="true" className={cn("absolute pointer-events-none blur-[100px]", variant === "primary" ? "bg-primary/20" : "bg-secondary/20", className)} />
);

/**
 * Responsive auto-grid of `LandingProductFeature` children.
 *
 * Auto-detects 2 or 3 columns based on child count (mod 3 == 0 → 3 cols).
 * Pass `numberOfColumns` to override.
 *
 * Adds className `fgrid` on the inner grid so nested `LandingProductFeature`
 * components can apply context-aware `[.fgrid_&]:...` variants.
 */
export const LandingProductFeaturesGrid = ({
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
  numberOfColumns,
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
  numberOfColumns?: 1 | 2 | 3;
}) => {
  const count = React.Children.count(children);
  const autoColumns = count % 3 === 0 ? 3 : 2;
  const cols = numberOfColumns ?? autoColumns;

  return (
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
            "fgrid grid gap-4",
            cols === 1 && "grid-cols-1",
            cols === 2 && "grid-cols-1 md:grid-cols-2",
            cols === 3 && "grid-cols-1 md:grid-cols-3",
            innerClassName,
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
};
