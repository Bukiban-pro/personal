import { cn } from "@/lib/utils";
import * as React from "react";

export interface SignalTelescopeLens {
  title: string;
  spectrum?: string;
  findings?: string[];
  horizon?: string;
  correction?: string;
}

export interface LandingProductSignalTelescopeProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  lenses: SignalTelescopeLens[];
}

export const LandingProductSignalTelescope = React.forwardRef<HTMLElement, LandingProductSignalTelescopeProps>(
  ({ className, title = "Use a telescope when the right signal is still distant, weak, or distorted", description, lenses, ...props }, ref) => {
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
                <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{lens.spectrum || "Spectrum"}</span>
                  <span>{lens.horizon || "Horizon"}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{lens.title}</h3>
                <div className="mt-4 grid gap-3">
                  {(lens.findings || []).map((finding) => (
                    <div key={finding} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      {finding}
                    </div>
                  ))}
                </div>
                {lens.correction ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{lens.correction}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductSignalTelescope.displayName = "LandingProductSignalTelescope";