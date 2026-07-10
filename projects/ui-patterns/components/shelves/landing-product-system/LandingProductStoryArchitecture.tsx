import { cn } from "@/lib/utils";
import * as React from "react";

export interface StoryArchitecturePillar {
  title: string;
  promise?: string;
  proof?: string;
  action?: string;
}

export interface LandingProductStoryArchitectureProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  pillars: StoryArchitecturePillar[];
}

export const LandingProductStoryArchitecture = React.forwardRef<HTMLElement, LandingProductStoryArchitectureProps>(
  ({ className, title = "Structure the story before the page starts improvising", description, pillars, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">{pillar.title}</h3>
                {pillar.promise ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{pillar.promise}</p> : null}
                {pillar.proof ? <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{pillar.proof}</div> : null}
                {pillar.action ? <div className="mt-4 text-sm font-medium text-foreground">{pillar.action}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductStoryArchitecture.displayName = "LandingProductStoryArchitecture";