import { cn } from "@/lib/utils";
import * as React from "react";

export interface CapabilityGridColumn {
  title: string;
  category?: string;
  capabilities?: string[];
}

export interface LandingProductCapabilityGridProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  columns: CapabilityGridColumn[];
}

export const LandingProductCapabilityGrid = React.forwardRef<HTMLElement, LandingProductCapabilityGridProps>(
  ({ className, title = "Group capabilities into a sharper strategic grid", description, columns, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {columns.map((column) => (
              <article key={column.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {column.category ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{column.category}</div> : null}
                <h3 className="mt-3 text-base font-semibold tracking-tight">{column.title}</h3>
                <div className="mt-4 grid gap-2">
                  {column.capabilities?.map((capability) => (
                    <div key={capability} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      {capability}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductCapabilityGrid.displayName = "LandingProductCapabilityGrid";