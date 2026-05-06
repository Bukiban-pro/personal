import { cn } from "@/lib/utils";
import * as React from "react";

export interface TrustArchiveRecord {
  title: string;
  date?: string;
  evidence?: string;
  status?: string;
  steward?: string;
}

export interface LandingProductTrustArchiveProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  records: TrustArchiveRecord[];
}

export const LandingProductTrustArchive = React.forwardRef<HTMLElement, LandingProductTrustArchiveProps>(
  ({ className, title = "Archive trust proof so credibility compounds instead of evaporating", description, records, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.95fr_0.8fr_1fr_0.8fr_0.85fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Record</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Date</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Evidence</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Status</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Steward</div>
            </div>
            <div className="divide-y divide-border">
              {records.map((record) => (
                <article key={record.title} className="grid gap-4 px-5 py-5 md:grid-cols-[0.95fr_0.8fr_1fr_0.8fr_0.85fr] md:px-6">
                  <div className="text-sm font-medium">{record.title}</div>
                  <div className="text-sm text-muted-foreground">{record.date || "Date"}</div>
                  <div className="text-sm text-muted-foreground">{record.evidence || "Evidence"}</div>
                  <div className="text-sm text-muted-foreground">{record.status || "Status"}</div>
                  <div className="text-sm text-muted-foreground">{record.steward || "Steward"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductTrustArchive.displayName = "LandingProductTrustArchive";