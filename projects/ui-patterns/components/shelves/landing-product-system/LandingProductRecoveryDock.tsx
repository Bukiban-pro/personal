import { cn } from "@/lib/utils";
import * as React from "react";

export interface RecoveryDockStage {
  title: string;
  berth?: string;
  checks?: string[];
  repair?: string;
  departure?: string;
}

export interface LandingProductRecoveryDockProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stages: RecoveryDockStage[];
}

export const LandingProductRecoveryDock = React.forwardRef<HTMLElement, LandingProductRecoveryDockProps>(
  ({ className, title = "Dock incidents into a structured recovery bay before they drift", description, stages, ...props }, ref) => {
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
                  <span>Dock {index + 1}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stage.berth || "Berth"}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{stage.title}</h3>
                <div className="mt-4 grid gap-3">
                  {(stage.checks || []).map((check) => (
                    <div key={check} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      {check}
                    </div>
                  ))}
                </div>
                {stage.repair ? <div className="mt-4 text-sm font-medium text-foreground">{stage.repair}</div> : null}
                {stage.departure ? <div className="mt-2 text-sm text-muted-foreground">{stage.departure}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductRecoveryDock.displayName = "LandingProductRecoveryDock";