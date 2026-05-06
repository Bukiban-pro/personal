'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from "@/lib/utils";
import * as React from "react";

// ─── GlowBg helper ─────────────────────────────────────────────────────────
const GlowBg = ({ className, variant = "primary" }: { className?: string; variant?: "primary" | "secondary" }) => (
  <div aria-hidden="true" className={cn("absolute pointer-events-none blur-[100px]", variant === "primary" ? "bg-primary/20" : "bg-secondary/20", className)} />
);

// ─── LandingProductTourSection ─────────────────────────────────────────────

/**
 * Full-page wrapper for the product tour — renders section heading, glow, and
 * the `LandingProductTour` tabs side-by-side.
 */
export const LandingProductTourSection = ({
  className,
  children,
  title,
  titleComponent,
  description,
  descriptionComponent,
  withBackground = false,
  withBackgroundGlow = false,
  variant = "primary",
  backgroundGlowVariant = "primary",
}: {
  className?: string;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  withBackground?: boolean;
  withBackgroundGlow?: boolean;
  variant?: "primary" | "secondary";
  backgroundGlowVariant?: "primary" | "secondary";
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
      <GlowBg
        className="w-1/2 h-auto top-0 left-1/4 opacity-40"
        variant={backgroundGlowVariant}
      />
    )}

    <div className="w-full max-w-7xl mx-auto px-6 relative">
      {(titleComponent || title) && (
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          {titleComponent || (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight max-w-2xl">
              {title}
            </h2>
          )}
          {descriptionComponent || (description && <p className="md:text-xl max-w-2xl">{description}</p>)}
        </div>
      )}
      {children}
    </div>
  </section>
);

// ─── LandingProductTour (Root) ─────────────────────────────────────────────

/**
 * Radix Tabs root — lays out tab list + content in column on mobile, row on desktop.
 */
export const LandingProductTour = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn(
      "flex flex-col lg:flex-row gap-6 lg:gap-12 items-center w-full",
      className,
    )}
    {...props}
  />
));
LandingProductTour.displayName = "LandingProductTour";

// ─── LandingProductTourList ────────────────────────────────────────────────

/**
 * Tab trigger list — vertical column of step triggers.
 */
export const LandingProductTourList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex flex-col items-center shrink-0 rounded-md p-1 gap-1",
      className,
    )}
    {...props}
  />
));
LandingProductTourList.displayName = "LandingProductTourList";

// ─── LandingProductTourTrigger ─────────────────────────────────────────────

/**
 * A single tab trigger — shows icon / step number, title, and optional description.
 * Active state: `data-[state=active]:bg-neutral-500/10`.
 */
export const LandingProductTourTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "group/trigger inline-flex items-start justify-start whitespace-normal rounded-md p-6 text-left w-full lg:w-[420px]",
      "ring-offset-background transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-neutral-500/10 data-[state=active]:shadow-sm",
      className,
    )}
    {...props}
  />
));
LandingProductTourTrigger.displayName = "LandingProductTourTrigger";

// ─── LandingProductTourContent ─────────────────────────────────────────────

/**
 * The content panel displayed next to the trigger list when a tab is selected.
 * Typically contains a screenshot or video of the feature.
 */
export const LandingProductTourContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "w-full max-w-[500px] mt-2",
      "ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
LandingProductTourContent.displayName = "LandingProductTourContent";
