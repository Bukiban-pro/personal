import { cn } from "@/lib/utils";
import * as React from "react";

export interface RoadmapItem {
  title: string;
  description?: string;
  status?: "done" | "current" | "planned";
}

export interface LandingProductRoadmapProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: RoadmapItem[];
}

export const LandingProductRoadmap = React.forwardRef<HTMLElement, LandingProductRoadmapProps>(
  ({ className, title = "Roadmap", description, items, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {items.map((item, index) => {
              const statusStyles = {
                done: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                current: "border-primary/30 bg-primary/10 text-primary",
                planned: "border-border bg-card text-muted-foreground",
              } as const;

              const status = item.status || (index === 0 ? "current" : "planned");

              return (
                <div key={item.title} className={cn("rounded-2xl border p-6 shadow-sm", statusStyles[status])}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                    <span className="text-xs font-medium uppercase tracking-[0.2em]">{status}</span>
                  </div>
                  {item.description ? <p className="mt-3 text-sm leading-6 opacity-90">{item.description}</p> : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductRoadmap.displayName = "LandingProductRoadmap";
