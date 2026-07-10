import { cn } from "@/lib/utils";
import * as React from "react";

export interface StakeholderMapItem {
  name: string;
  role?: string;
  priority?: string;
  summary?: string;
  goals?: string[];
}

export interface LandingProductStakeholderMapProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  stakeholders: StakeholderMapItem[];
}

export const LandingProductStakeholderMap = React.forwardRef<
  HTMLElement,
  LandingProductStakeholderMapProps
>(({ className, title = "Map the buying committee before consensus slows down", description, stakeholders, ...props }, ref) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeStakeholder = stakeholders[activeIndex];

  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="space-y-3">
            {stakeholders.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-full rounded-2xl border p-5 text-left transition-colors",
                    isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold tracking-tight">{item.name}</div>
                      {item.role ? <div className="mt-1 text-sm text-muted-foreground">{item.role}</div> : null}
                    </div>
                    {item.priority ? (
                      <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        {item.priority}
                      </span>
                    ) : null}
                  </div>
                  {item.summary ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p> : null}
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
            {activeStakeholder ? (
              <>
                <div className="border-b border-border pb-5">
                  <div className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {activeStakeholder.priority || "Stakeholder"}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                    {activeStakeholder.name}
                  </h3>
                  {activeStakeholder.role ? (
                    <div className="mt-2 text-sm text-muted-foreground">{activeStakeholder.role}</div>
                  ) : null}
                  {activeStakeholder.summary ? (
                    <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                      {activeStakeholder.summary}
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-3">
                  {(activeStakeholder.goals || []).map((goal) => (
                    <div key={goal} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      {goal}
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductStakeholderMap.displayName = "LandingProductStakeholderMap";