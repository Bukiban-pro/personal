import { cn } from "@/lib/utils";
import * as React from "react";

export interface TrainingHubResource {
  title: string;
  format?: string;
  duration?: string;
  audience?: string;
  description?: string;
  bullets?: string[];
}

export interface LandingProductTrainingHubProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  resources: TrainingHubResource[];
}

export const LandingProductTrainingHub = React.forwardRef<
  HTMLElement,
  LandingProductTrainingHubProps
>(({ className, title = "Make training assets feel like a system, not an afterthought", description, resources, ...props }, ref) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeResource = resources.length > 0 ? resources[Math.min(activeIndex, resources.length - 1)] : null;

  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
          <div className="space-y-3">
            {resources.map((resource, index) => {
              const isActive = index === Math.min(activeIndex, Math.max(resources.length - 1, 0));

              return (
                <button
                  key={resource.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-full rounded-2xl border p-5 text-left transition-colors",
                    isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold tracking-tight">{resource.title}</div>
                    {resource.format ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{resource.format}</div> : null}
                  </div>
                  {resource.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{resource.description}</p> : null}
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
            {activeResource ? (
              <>
                <div className="border-b border-border pb-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {activeResource.format ? <span>{activeResource.format}</span> : null}
                    {activeResource.duration ? <span>{activeResource.duration}</span> : null}
                    {activeResource.audience ? <span>{activeResource.audience}</span> : null}
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeResource.title}</h3>
                  {activeResource.description ? <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{activeResource.description}</p> : null}
                </div>
                {activeResource.bullets?.length ? (
                  <div className="mt-6 grid gap-3">
                    {activeResource.bullets.map((bullet) => (
                      <div key={bullet} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        {bullet}
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Add resources to populate the training hub.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductTrainingHub.displayName = "LandingProductTrainingHub";