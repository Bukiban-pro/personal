import { cn } from "@/lib/utils";
import * as React from "react";

export interface NarrativeControlPanelPanel {
  title: string;
  prompt?: string;
  priorities?: string[];
  outputs?: string[];
}

export interface LandingProductNarrativeControlPanelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  panels: NarrativeControlPanelPanel[];
}

export const LandingProductNarrativeControlPanel = React.forwardRef<HTMLElement, LandingProductNarrativeControlPanelProps>(
  ({ className, title = "Let teams tune the narrative from a control panel, not a doc graveyard", description, panels, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activePanel = panels.length > 0 ? panels[Math.min(activeIndex, panels.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <div className="space-y-3">
              {panels.map((panel, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(panels.length - 1, 0));

                return (
                  <button
                    key={panel.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{panel.title}</div>
                    {panel.prompt ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{panel.prompt}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activePanel ? (
                <>
                  <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{activePanel.title}</h3>
                  {activePanel.prompt ? <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{activePanel.prompt}</p> : null}
                  <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Priorities</div>
                      <div className="mt-3 grid gap-3">
                        {(activePanel.priorities || []).map((priority) => (
                          <div key={priority} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                            {priority}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Outputs</div>
                      <div className="mt-3 grid gap-3">
                        {(activePanel.outputs || []).map((output) => (
                          <div key={output} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                            {output}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add panels to populate the control panel.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductNarrativeControlPanel.displayName = "LandingProductNarrativeControlPanel";