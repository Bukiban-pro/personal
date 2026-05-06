import { cn } from "@/lib/utils";
import * as React from "react";

export interface EnablementTrackItem {
  title: string;
  audience?: string;
  description?: string;
  modules: string[];
}

export interface LandingProductEnablementTracksProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  tracks: EnablementTrackItem[];
}

export const LandingProductEnablementTracks = React.forwardRef<
  HTMLElement,
  LandingProductEnablementTracksProps
>(({ className, title = "Package enablement by role instead of one generic deck", description, tracks, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {tracks.map((track) => (
            <article key={track.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              {track.audience ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{track.audience}</div> : null}
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{track.title}</h3>
              {track.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{track.description}</p> : null}
              <ul className="mt-4 grid gap-2">
                {track.modules.map((module) => (
                  <li key={module} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    {module}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductEnablementTracks.displayName = "LandingProductEnablementTracks";