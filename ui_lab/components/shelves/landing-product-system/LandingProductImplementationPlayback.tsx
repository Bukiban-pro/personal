import { cn } from "@/lib/utils";
import * as React from "react";

export interface ImplementationPlaybackScene {
  title: string;
  timing?: string;
  description?: string;
  checkpoints?: string[];
}

export interface LandingProductImplementationPlaybackProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  scenes: ImplementationPlaybackScene[];
}

export const LandingProductImplementationPlayback = React.forwardRef<HTMLElement, LandingProductImplementationPlaybackProps>(
  ({ className, title = "Let teams preview implementation as a sequence, not a blob", description, scenes, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {scenes.map((scene, index) => (
              <article key={scene.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold tracking-tight">Scene {index + 1}</div>
                  {scene.timing ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{scene.timing}</div> : null}
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{scene.title}</h3>
                {scene.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{scene.description}</p> : null}
                {scene.checkpoints?.length ? (
                  <ul className="mt-4 grid gap-2">
                    {scene.checkpoints.map((checkpoint) => (
                      <li key={checkpoint} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        {checkpoint}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductImplementationPlayback.displayName = "LandingProductImplementationPlayback";