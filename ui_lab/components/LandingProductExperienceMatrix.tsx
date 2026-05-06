import { cn } from "@/lib/utils";
import * as React from "react";

export interface ExperienceMatrixRow {
  moment: string;
  user?: string;
  team?: string;
  proof?: string;
}

export interface LandingProductExperienceMatrixProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rows: ExperienceMatrixRow[];
}

export const LandingProductExperienceMatrix = React.forwardRef<HTMLElement, LandingProductExperienceMatrixProps>(
  ({ className, title = "Matrix the experience across user need, team action, and proof", description, rows, ...props }, ref) => {
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
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">User Need</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Team Action</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Proof</div>
            </div>
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <article key={row.moment} className="grid gap-4 px-5 py-5 md:grid-cols-[0.8fr_1fr_1fr_0.8fr] md:px-6">
                  <div className="text-sm font-medium">{row.moment}</div>
                  <div className="text-sm text-muted-foreground">{row.user || "Need"}</div>
                  <div className="text-sm text-muted-foreground">{row.team || "Response"}</div>
                  <div className="text-sm text-muted-foreground">{row.proof || "Proof"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductExperienceMatrix.displayName = "LandingProductExperienceMatrix";