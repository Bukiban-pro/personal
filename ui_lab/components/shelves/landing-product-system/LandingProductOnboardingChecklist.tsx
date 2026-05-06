import { cn } from "@/lib/utils";
import * as React from "react";

export interface OnboardingChecklistItem {
  title: string;
  owner?: string;
  description?: string;
  status?: "complete" | "active" | "upcoming";
}

export interface LandingProductOnboardingChecklistProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items: OnboardingChecklistItem[];
  action?: React.ReactNode;
}

export const LandingProductOnboardingChecklist = React.forwardRef<
  HTMLElement,
  LandingProductOnboardingChecklistProps
>(({ className, title = "Onboarding checklist buyers can forward internally", description, items, action, ...props }, ref) => {
  const statusStyles = {
    complete: "border-emerald-500/30 bg-emerald-500/10",
    active: "border-primary/30 bg-primary/10",
    upcoming: "border-border bg-card",
  } as const;

  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((item, index) => {
            const status = item.status || (index === 0 ? "active" : "upcoming");

            return (
              <article key={item.title} className={cn("rounded-2xl border p-6 shadow-sm", statusStyles[status])}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-current/20 bg-background text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{status}</div>
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{item.title}</h3>
                {item.owner ? <div className="mt-2 text-sm text-muted-foreground">{item.owner}</div> : null}
                {item.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
});

LandingProductOnboardingChecklist.displayName = "LandingProductOnboardingChecklist";