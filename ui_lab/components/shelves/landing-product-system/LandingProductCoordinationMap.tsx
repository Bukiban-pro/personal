import { cn } from "@/lib/utils";
import * as React from "react";

export interface CoordinationMapLane {
  title: string;
  interface?: string;
  dependency?: string;
  handshake?: string;
}

export interface LandingProductCoordinationMapProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  lanes: CoordinationMapLane[];
}

export const LandingProductCoordinationMap = React.forwardRef<HTMLElement, LandingProductCoordinationMapProps>(
  ({ className, title = "Map coordination as explicit handshakes between lanes", description, lanes, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {lanes.map((lane) => (
              <article key={lane.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold tracking-tight">{lane.title}</h3>
                {lane.interface ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{lane.interface}</p> : null}
                {lane.dependency ? <div className="mt-4 text-sm font-medium text-foreground">{lane.dependency}</div> : null}
                {lane.handshake ? <div className="mt-2 text-sm text-muted-foreground">{lane.handshake}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductCoordinationMap.displayName = "LandingProductCoordinationMap";