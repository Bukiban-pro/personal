import { cn } from "@/lib/utils";
import * as React from "react";

export interface ExperienceBlueprintRow {
  moment: string;
  need?: string;
  response?: string;
  evidence?: string;
}

export interface LandingProductExperienceBlueprintProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rows: ExperienceBlueprintRow[];
}

export const LandingProductExperienceBlueprint = React.forwardRef<HTMLElement, LandingProductExperienceBlueprintProps>(
  ({ className, title = "Blueprint the customer experience across critical moments", description, rows, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.8fr_1fr_1fr_0.8fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Moment</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Need</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Response</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Evidence</div>
            </div>
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <article key={row.moment} className="grid gap-4 px-5 py-5 md:grid-cols-[0.8fr_1fr_1fr_0.8fr] md:px-6">
                  <div className="text-sm font-medium">{row.moment}</div>
                  <div className="text-sm text-muted-foreground">{row.need || "User need"}</div>
                  <div className="text-sm text-muted-foreground">{row.response || "Service response"}</div>
                  <div className="text-sm text-muted-foreground">{row.evidence || "Proof"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductExperienceBlueprint.displayName = "LandingProductExperienceBlueprint";