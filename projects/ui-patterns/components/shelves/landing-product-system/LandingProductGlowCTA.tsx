import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductGlowCTA
 * Full-bleed CTA section with an animated neon-glow radial gradient background.
 * Pattern: Neon Gradient Card / Border Beam from Magic UI research docs.
 */

export interface LandingProductGlowCTAProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  note?: string;
  /** CSS color for the glow blob */
  glowColor?: string;
}

export const LandingProductGlowCTA = React.forwardRef<HTMLElement, LandingProductGlowCTAProps>(
  (
    {
      className,
      title = "Start closing more revenue today",
      description = "Join 3,200+ teams already using the platform to hit quota consistently.",
      primaryAction,
      secondaryAction,
      note = "No credit card required. 14-day free trial.",
      glowColor = "rgba(99,102,241,0.35)",
      ...props
    },
    ref,
  ) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-20", className)} {...props}>
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-14 text-center shadow-xl shadow-black/20 lg:px-16 lg:py-20">
            {/* Glow blob */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: glowColor }}
            />

            {/* Animated border beam */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl">
              <div
                className="absolute inset-0 rounded-3xl border border-white/10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)",
                }}
              />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
                {description ? (
                  <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                    {description}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {primaryAction ? <div>{primaryAction}</div> : null}
                {secondaryAction ? <div>{secondaryAction}</div> : null}
              </div>

              {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductGlowCTA.displayName = "LandingProductGlowCTA";
