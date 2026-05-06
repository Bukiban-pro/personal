import { cn } from "@/lib/utils";
import * as React from "react";

export interface SignalStudioPanel {
  title: string;
  feed?: string;
  insight?: string;
  response?: string;
}

export interface LandingProductSignalStudioProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  panels: SignalStudioPanel[];
}

export const LandingProductSignalStudio = React.forwardRef<HTMLElement, LandingProductSignalStudioProps>(
  ({ className, title = "Make signals feel curated, interpreted, and acted on", description, panels, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {panels.map((panel) => (
              <article key={panel.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {panel.feed ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{panel.feed}</div> : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{panel.title}</h3>
                {panel.insight ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{panel.insight}</p> : null}
                {panel.response ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{panel.response}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductSignalStudio.displayName = "LandingProductSignalStudio";