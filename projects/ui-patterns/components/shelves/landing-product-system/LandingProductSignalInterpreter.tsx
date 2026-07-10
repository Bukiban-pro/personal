import { cn } from "@/lib/utils";
import * as React from "react";

export interface SignalInterpreterPerspective {
  title: string;
  source?: string;
  reading?: string;
  route?: string;
  safeguard?: string;
}

export interface LandingProductSignalInterpreterProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  perspectives: SignalInterpreterPerspective[];
}

export const LandingProductSignalInterpreter = React.forwardRef<HTMLElement, LandingProductSignalInterpreterProps>(
  ({ className, title = "Interpret signals before they harden into the wrong workflow", description, perspectives, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {perspectives.map((perspective) => (
              <article key={perspective.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{perspective.source || "Source"}</div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{perspective.title}</h3>
                {perspective.reading ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{perspective.reading}</p> : null}
                {perspective.route ? <div className="mt-4 text-sm font-medium text-foreground">{perspective.route}</div> : null}
                {perspective.safeguard ? <div className="mt-2 text-sm text-muted-foreground">{perspective.safeguard}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductSignalInterpreter.displayName = "LandingProductSignalInterpreter";