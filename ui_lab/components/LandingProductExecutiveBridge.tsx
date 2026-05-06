import { cn } from "@/lib/utils";
import * as React from "react";

export interface ExecutiveBridgeLane {
  title: string;
  brief?: string;
  indicators?: Array<{ label: string; value: string }>;
  directives?: string[];
  escalation?: string;
}

export interface LandingProductExecutiveBridgeProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  lanes: ExecutiveBridgeLane[];
}

export const LandingProductExecutiveBridge = React.forwardRef<HTMLElement, LandingProductExecutiveBridgeProps>(
  ({ className, title = "Give leadership a bridge instead of a bundle of disconnected updates", description, lanes, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeLane = lanes.length > 0 ? lanes[Math.min(activeIndex, lanes.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <div className="space-y-3">
              {lanes.map((lane, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(lanes.length - 1, 0));

                return (
                  <button
                    key={lane.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{lane.title}</div>
                    {lane.brief ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{lane.brief}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeLane ? (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeLane.brief || "Brief"}</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeLane.title}</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {(activeLane.indicators || []).map((indicator) => (
                      <div key={indicator.label} className="rounded-2xl border border-border bg-muted/30 p-4">
                        <div className="text-sm font-medium text-muted-foreground">{indicator.label}</div>
                        <div className="mt-2 text-2xl font-semibold tracking-tight">{indicator.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid gap-3">
                    {(activeLane.directives || []).map((directive) => (
                      <div key={directive} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                        {directive}
                      </div>
                    ))}
                  </div>
                  {activeLane.escalation ? <div className="mt-6 rounded-2xl border border-border bg-primary/5 px-5 py-4 text-sm font-medium">{activeLane.escalation}</div> : null}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add lanes to populate the executive bridge.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductExecutiveBridge.displayName = "LandingProductExecutiveBridge";