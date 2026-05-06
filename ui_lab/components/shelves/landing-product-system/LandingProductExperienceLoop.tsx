import { cn } from "@/lib/utils";
import * as React from "react";

export interface ExperienceLoopBeat {
  title: string;
  expectation?: string;
  interaction?: string;
  memory?: string;
}

export interface LandingProductExperienceLoopProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  beats: ExperienceLoopBeat[];
}

export const LandingProductExperienceLoop = React.forwardRef<HTMLElement, LandingProductExperienceLoopProps>(
  ({ className, title = "Show experience as a loop that builds memory and momentum", description, beats, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {beats.map((beat, index) => (
              <article key={beat.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-sm font-semibold tracking-tight">Beat {index + 1}</div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{beat.title}</h3>
                {beat.expectation ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{beat.expectation}</p> : null}
                {beat.interaction ? <div className="mt-4 text-sm font-medium text-foreground">{beat.interaction}</div> : null}
                {beat.memory ? <div className="mt-2 text-sm text-muted-foreground">{beat.memory}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductExperienceLoop.displayName = "LandingProductExperienceLoop";