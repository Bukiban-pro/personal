import { cn } from "@/lib/utils";
import * as React from "react";

export interface ChangeManagementWorkstream {
  title: string;
  audience?: string;
  description?: string;
  tactics?: string[];
}

export interface LandingProductChangeManagementProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  workstreams: ChangeManagementWorkstream[];
}

export const LandingProductChangeManagement = React.forwardRef<
  HTMLElement,
  LandingProductChangeManagementProps
>(({ className, title = "Plan change management before adoption stalls", description, workstreams, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {workstreams.map((workstream) => (
            <article key={workstream.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              {workstream.audience ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{workstream.audience}</div> : null}
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{workstream.title}</h3>
              {workstream.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{workstream.description}</p> : null}
              {workstream.tactics?.length ? (
                <ul className="mt-4 grid gap-2">
                  {workstream.tactics.map((tactic) => (
                    <li key={tactic} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{tactic}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductChangeManagement.displayName = "LandingProductChangeManagement";