import { cn } from "@/lib/utils";
import * as React from "react";

export interface NarrativeWorkbenchMode {
  title: string;
  draft?: string;
  constraints?: string[];
  outputs?: string[];
  action?: React.ReactNode;
}

export interface LandingProductNarrativeWorkbenchProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  modes: NarrativeWorkbenchMode[];
}

export const LandingProductNarrativeWorkbench = React.forwardRef<HTMLElement, LandingProductNarrativeWorkbenchProps>(
  ({ className, title = "Give the team a workbench for narrative iteration, not a static brief", description, modes, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeMode = modes.length > 0 ? modes[Math.min(activeIndex, modes.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <div className="space-y-3">
              {modes.map((mode, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(modes.length - 1, 0));

                return (
                  <button
                    key={mode.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{mode.title}</div>
                    {mode.draft ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{mode.draft}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeMode ? (
                <>
                  <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{activeMode.title}</h3>
                  {activeMode.draft ? <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">{activeMode.draft}</p> : null}
                  <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Constraints</div>
                      <div className="mt-3 grid gap-3">
                        {(activeMode.constraints || []).map((constraint) => (
                          <div key={constraint} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                            {constraint}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Outputs</div>
                      <div className="mt-3 grid gap-3">
                        {(activeMode.outputs || []).map((output) => (
                          <div key={output} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                            {output}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {activeMode.action ? <div className="mt-6">{activeMode.action}</div> : null}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add modes to populate the workbench.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductNarrativeWorkbench.displayName = "LandingProductNarrativeWorkbench";