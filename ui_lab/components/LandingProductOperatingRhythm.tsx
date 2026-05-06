import { cn } from "@/lib/utils";
import * as React from "react";

export interface OperatingRhythmBeat {
  title: string;
  cadence?: string;
  owner?: string;
  detail?: string;
}

export interface LandingProductOperatingRhythmProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  beats: OperatingRhythmBeat[];
}

export const LandingProductOperatingRhythm = React.forwardRef<
  HTMLElement,
  LandingProductOperatingRhythmProps
>(({ className, title = "Show the operating rhythm, not just the destination", description, beats, ...props }, ref) => {
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
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold tracking-tight">Beat {index + 1}</div>
                <div className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {beat.cadence ? <div>{beat.cadence}</div> : null}
                  {beat.owner ? <div className="mt-1">{beat.owner}</div> : null}
                </div>
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">{beat.title}</h3>
              {beat.detail ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{beat.detail}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductOperatingRhythm.displayName = "LandingProductOperatingRhythm";