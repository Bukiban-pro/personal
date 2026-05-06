import { cn } from "@/lib/utils";
import * as React from "react";

export interface DecisionTheaterScene {
  title: string;
  audience?: string;
  question?: string;
  proof?: string[];
  ask?: string;
}

export interface LandingProductDecisionTheaterProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  scenes: DecisionTheaterScene[];
}

export const LandingProductDecisionTheater = React.forwardRef<HTMLElement, LandingProductDecisionTheaterProps>(
  ({ className, title = "Stage decisions as scenes with proof and ask", description, scenes, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeScene = scenes.length > 0 ? scenes[Math.min(activeIndex, scenes.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <div className="space-y-3">
              {scenes.map((scene, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(scenes.length - 1, 0));

                return (
                  <button
                    key={scene.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{scene.title}</div>
                    {scene.audience ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{scene.audience}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeScene ? (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeScene.audience || "Audience"}</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeScene.title}</h3>
                  {activeScene.question ? <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">{activeScene.question}</p> : null}
                  <div className="mt-6 grid gap-3">
                    {(activeScene.proof || []).map((item) => (
                      <div key={item} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                  {activeScene.ask ? <div className="mt-6 rounded-2xl border border-border bg-primary/5 px-5 py-4 text-sm font-medium">{activeScene.ask}</div> : null}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add scenes to populate the decision theater.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDecisionTheater.displayName = "LandingProductDecisionTheater";