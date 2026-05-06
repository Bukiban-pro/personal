import { cn } from "@/lib/utils";
import * as React from "react";

export interface AuditTrailEntry {
  title: string;
  description?: string;
  retention?: string;
  visibility?: string;
}

export interface LandingProductAuditTrailProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  entries: AuditTrailEntry[];
}

export const LandingProductAuditTrail = React.forwardRef<
  HTMLElement,
  LandingProductAuditTrailProps
>(({ className, title = "Show exactly what is tracked and reviewable", description, entries, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {entries.map((entry) => (
            <article key={entry.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight">{entry.title}</h3>
              {entry.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{entry.description}</p> : null}
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                {entry.retention ? <div>Retention: {entry.retention}</div> : null}
                {entry.visibility ? <div>Visibility: {entry.visibility}</div> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductAuditTrail.displayName = "LandingProductAuditTrail";