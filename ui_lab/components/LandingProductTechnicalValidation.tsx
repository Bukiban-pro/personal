import { cn } from "@/lib/utils";
import * as React from "react";

export interface TechnicalValidationCheck {
  title: string;
  description?: string;
  status?: string;
}

export interface TechnicalValidationArtifact {
  title: string;
  detail?: string;
}

export interface LandingProductTechnicalValidationProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  checks: TechnicalValidationCheck[];
  artifacts?: TechnicalValidationArtifact[];
}

export const LandingProductTechnicalValidation = React.forwardRef<
  HTMLElement,
  LandingProductTechnicalValidationProps
>(({ className, title = "Answer technical validation before the committee meeting", description, checks, artifacts = [], ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? (
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
            ) : null}
          </div>

          <div className="grid gap-4">
            {checks.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                  {item.status ? (
                    <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {item.status}
                    </span>
                  ) : null}
                </div>
                {item.description ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Validation artifacts
          </div>
          <div className="mt-4 grid gap-3">
            {artifacts.map((artifact) => (
              <div key={artifact.title} className="rounded-2xl border border-border bg-muted/30 p-4">
                <div className="text-sm font-semibold tracking-tight">{artifact.title}</div>
                {artifact.detail ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{artifact.detail}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductTechnicalValidation.displayName = "LandingProductTechnicalValidation";