import { cn } from "@/lib/utils";
import * as React from "react";

export interface OwnershipGridRow {
  title: string;
  executive?: string;
  operator?: string;
  decision?: string;
}

export interface LandingProductOwnershipGridProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rows: OwnershipGridRow[];
}

export const LandingProductOwnershipGrid = React.forwardRef<HTMLElement, LandingProductOwnershipGridProps>(
  ({ className, title = "Show who owns what before alignment becomes folklore", description, rows, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[1fr_0.8fr_0.8fr_1fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Domain</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Executive</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Operator</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Decision Right</div>
            </div>
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <article key={row.title} className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_0.8fr_0.8fr_1fr] md:px-6">
                  <div className="text-sm font-medium">{row.title}</div>
                  <div className="text-sm text-muted-foreground">{row.executive || "Executive sponsor"}</div>
                  <div className="text-sm text-muted-foreground">{row.operator || "Working owner"}</div>
                  <div className="text-sm text-muted-foreground">{row.decision || "Approve path"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductOwnershipGrid.displayName = "LandingProductOwnershipGrid";