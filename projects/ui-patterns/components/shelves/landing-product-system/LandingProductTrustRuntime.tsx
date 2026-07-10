import { cn } from "@/lib/utils";
import * as React from "react";

export interface TrustRuntimeView {
  title: string;
  status?: string;
  metrics?: Array<{ label: string; value: string }>;
  reactions?: string[];
}

export interface LandingProductTrustRuntimeProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  views: TrustRuntimeView[];
}

export const LandingProductTrustRuntime = React.forwardRef<HTMLElement, LandingProductTrustRuntimeProps>(
  ({ className, title = "Show trust posture changing at runtime instead of after the fact", description, views, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeView = views.length > 0 ? views[Math.min(activeIndex, views.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <div className="space-y-3">
              {views.map((view, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(views.length - 1, 0));

                return (
                  <button
                    key={view.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{view.title}</div>
                    {view.status ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{view.status}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeView ? (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeView.status || "Status"}</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeView.title}</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {(activeView.metrics || []).map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-border bg-muted/30 p-4">
                        <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
                        <div className="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid gap-3">
                    {(activeView.reactions || []).map((reaction) => (
                      <div key={reaction} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                        {reaction}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add views to populate the trust runtime.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductTrustRuntime.displayName = "LandingProductTrustRuntime";