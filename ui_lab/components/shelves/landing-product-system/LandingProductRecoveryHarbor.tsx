import { cn } from "@/lib/utils";
import * as React from "react";

export interface RecoveryHarborStage {
  title: string;
  berth?: string;
  stabilization?: string;
  handoff?: string;
  release?: string;
}

export interface LandingProductRecoveryHarborProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stages: RecoveryHarborStage[];
}

export const LandingProductRecoveryHarbor = React.forwardRef<HTMLElement, LandingProductRecoveryHarborProps>(
  ({ className, title = "Bring recovery into a harbor where stabilization and release are explicit", description, stages, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {stages.map((stage, index) => (
              <article key={stage.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 text-sm font-semibold tracking-tight">
                  <span>Harbor {index + 1}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stage.berth || "Berth"}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{stage.title}</h3>
                {stage.stabilization ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{stage.stabilization}</p> : null}
                {stage.handoff ? <div className="mt-4 text-sm font-medium text-foreground">{stage.handoff}</div> : null}
                {stage.release ? <div className="mt-2 text-sm text-muted-foreground">{stage.release}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductRecoveryHarbor.displayName = "LandingProductRecoveryHarbor";