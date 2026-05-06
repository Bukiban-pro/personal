import { cn } from "@/lib/utils";
import * as React from "react";

export interface SignalChamberLens {
  title: string;
  chamber?: string;
  findings?: string[];
  interpretation?: string;
  response?: string;
}

export interface LandingProductSignalChamberProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  lenses: SignalChamberLens[];
}

export const LandingProductSignalChamber = React.forwardRef<HTMLElement, LandingProductSignalChamberProps>(
  ({ className, title = "Bring signals into a chamber where they can be interpreted under pressure", description, lenses, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {lenses.map((lens) => (
              <article key={lens.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{lens.chamber || "Chamber"}</div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{lens.title}</h3>
                <div className="mt-4 grid gap-3">
                  {(lens.findings || []).map((finding) => (
                    <div key={finding} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      {finding}
                    </div>
                  ))}
                </div>
                {lens.interpretation ? <div className="mt-4 text-sm font-medium text-foreground">{lens.interpretation}</div> : null}
                {lens.response ? <div className="mt-2 text-sm text-muted-foreground">{lens.response}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductSignalChamber.displayName = "LandingProductSignalChamber";