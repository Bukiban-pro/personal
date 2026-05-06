import { cn } from "@/lib/utils";
import * as React from "react";

export interface OperationalChecklistItem {
  title: string;
  owner?: string;
  status?: "complete" | "active" | "upcoming";
  description?: string;
}

export interface LandingProductOperationalChecklistProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: OperationalChecklistItem[];
}

export const LandingProductOperationalChecklist = React.forwardRef<HTMLElement, LandingProductOperationalChecklistProps>(
  ({ className, title = "Turn operating detail into a usable checklist", description, items, ...props }, ref) => {
    const statusStyles = {
      complete: "border-emerald-500/30 bg-emerald-500/10",
      active: "border-primary/30 bg-primary/10",
      upcoming: "border-border bg-card",
    } as const;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {items.map((item, index) => {
              const status = item.status || (index === 0 ? "active" : "upcoming");

              return (
                <article key={item.title} className={cn("rounded-2xl border p-6 shadow-sm", statusStyles[status])}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                    <div className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <div>{status}</div>
                      {item.owner ? <div className="mt-1">{item.owner}</div> : null}
                    </div>
                  </div>
                  {item.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductOperationalChecklist.displayName = "LandingProductOperationalChecklist";