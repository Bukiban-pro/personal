import { cn } from "@/lib/utils";

// ─── GlowBg helper ─────────────────────────────────────────────────────────
const GlowBg = ({ className, variant = "primary" }: { className?: string; variant?: "primary" | "secondary" }) => (
  <div aria-hidden="true" className={cn("absolute pointer-events-none blur-[100px]", variant === "primary" ? "bg-primary/20" : "bg-secondary/20", className)} />
);

/**
 * Sale / pricing CTA section — bold headline, description, and two action buttons.
 *
 * Primary CTA uses `bg-primary` fill; secondary CTA is outlined.
 * Pass a `footerComponent` (e.g. money-back guarantee badge) below the buttons.
 */
export const LandingSaleCtaSection = ({
  className,
  title,
  titleComponent,
  description,
  descriptionComponent,
  ctaHref = "#",
  ctaLabel = "Get started",
  secondaryCtaHref,
  secondaryCtaLabel,
  footerComponent,
  withBackground = false,
  withBackgroundGlow = false,
  variant = "primary",
  backgroundGlowVariant = "primary",
}: {
  className?: string;
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  footerComponent?: React.ReactNode;
  withBackground?: boolean;
  withBackgroundGlow?: boolean;
  variant?: "primary" | "secondary";
  backgroundGlowVariant?: "primary" | "secondary";
}) => (
  <section
    className={cn(
      "relative w-full flex flex-col items-center justify-center gap-6 py-12 lg:py-16 px-6 text-center",
      withBackground && variant === "primary" ? "bg-primary/5 dark:bg-primary/10" : "",
      withBackground && variant === "secondary" ? "bg-secondary/5 dark:bg-secondary/10" : "",
      withBackgroundGlow ? "overflow-hidden" : "",
      className,
    )}
  >
    {withBackgroundGlow && (
      <GlowBg className="w-2/3 h-auto top-0 left-1/6 opacity-40" variant={backgroundGlowVariant} />
    )}

    <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-6">
      {titleComponent || (title && (
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
          {title}
        </h2>
      ))}

      {descriptionComponent || (description && (
        <p className="md:text-xl">{description}</p>
      ))}

      <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
        <a
          href={ctaHref}
          className={cn(
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "h-11 px-8 text-base",
          )}
        >
          {ctaLabel}
        </a>

        {secondaryCtaLabel && secondaryCtaHref && (
          <a
            href={secondaryCtaHref}
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              "h-11 px-8 text-base",
            )}
          >
            {secondaryCtaLabel}
          </a>
        )}
      </div>

      {footerComponent && (
        <div className="mt-2">{footerComponent}</div>
      )}
    </div>
  </section>
);
