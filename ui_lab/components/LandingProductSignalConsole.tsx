import { cn } from "@/lib/utils";
import * as React from "react";

export interface SignalConsolePane {
  title: string;
  feed?: string;
  metrics?: Array<{ label: string; value: string }>;
  reactions?: string[];
}

export interface LandingProductSignalConsoleProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  panes: SignalConsolePane[];
}

export const LandingProductSignalConsole = React.forwardRef<HTMLElement, LandingProductSignalConsoleProps>(
  ({ className, title = "Make signals visible as a live console, not a trailing report", description, panes, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activePane = panes.length > 0 ? panes[Math.min(activeIndex, panes.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <div className="space-y-3">
              {panes.map((pane, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(panes.length - 1, 0));

                return (
                  <button
                    key={pane.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{pane.title}</div>
                    {pane.feed ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{pane.feed}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activePane ? (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activePane.feed || "Feed"}</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activePane.title}</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {(activePane.metrics || []).map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-border bg-muted/30 p-4">
                        <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
                        <div className="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid gap-3">
                    {(activePane.reactions || []).map((reaction) => (
                      <div key={reaction} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                        {reaction}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add panes to populate the signal console.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductSignalConsole.displayName = "LandingProductSignalConsole";