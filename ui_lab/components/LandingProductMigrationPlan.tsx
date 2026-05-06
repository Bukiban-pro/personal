import { cn } from "@/lib/utils";
import * as React from "react";

export interface MigrationPlanPhase {
  title: string;
  duration?: string;
  description?: string;
  tasks: string[];
}

export interface LandingProductMigrationPlanProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  badge?: string;
  phases: MigrationPlanPhase[];
}

export const LandingProductMigrationPlan = React.forwardRef<
  HTMLElement,
  LandingProductMigrationPlanProps
>(({ className, title = "Migration without the all-hands fire drill", description, badge = "Migration Plan", phases, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <div className="inline-flex w-fit rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {badge}
          </div>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="relative grid gap-4">
          <div className="absolute bottom-0 left-5 top-3 hidden w-px bg-border md:block" aria-hidden="true" />
          {phases.map((phase, index) => (
            <article
              key={phase.title}
              className="relative grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:grid-cols-[auto_1fr] md:gap-5 md:p-6"
            >
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold">
                {index + 1}
              </div>
              <div>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-base font-semibold tracking-tight md:text-lg">{phase.title}</h3>
                  {phase.duration ? (
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {phase.duration}
                    </span>
                  ) : null}
                </div>
                {phase.description ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{phase.description}</p>
                ) : null}

                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {phase.tasks.map((task) => (
                    <li
                      key={task}
                      className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
                    >
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductMigrationPlan.displayName = "LandingProductMigrationPlan";