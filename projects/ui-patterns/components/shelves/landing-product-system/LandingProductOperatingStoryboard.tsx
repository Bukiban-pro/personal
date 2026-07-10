import { cn } from "@/lib/utils";
import * as React from "react";

export interface OperatingStoryboardScene {
  title: string;
  role?: string;
  action?: string;
  payoff?: string;
}

export interface LandingProductOperatingStoryboardProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  scenes: OperatingStoryboardScene[];
}

export const LandingProductOperatingStoryboard = React.forwardRef<HTMLElement, LandingProductOperatingStoryboardProps>(
  ({ className, title = "Show the operating model as a storyboard of lived moments", description, scenes, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {scenes.map((scene, index) => (
              <article key={scene.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-sm font-semibold tracking-tight">Scene {index + 1}</div>
                {scene.role ? <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{scene.role}</div> : null}
                <h3 className="mt-4 text-base font-semibold tracking-tight">{scene.title}</h3>
                {scene.action ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{scene.action}</p> : null}
                {scene.payoff ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{scene.payoff}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductOperatingStoryboard.displayName = "LandingProductOperatingStoryboard";