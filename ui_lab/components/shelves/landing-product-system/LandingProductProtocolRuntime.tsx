import { cn } from "@/lib/utils";
import * as React from "react";

export interface ProtocolRuntimeLane {
  title: string;
  status?: string;
  inputs?: string[];
  outputs?: string[];
  watchdog?: string;
}

export interface LandingProductProtocolRuntimeProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  lanes: ProtocolRuntimeLane[];
}

export const LandingProductProtocolRuntime = React.forwardRef<HTMLElement, LandingProductProtocolRuntimeProps>(
  ({ className, title = "Run protocol as a live system with inputs, outputs, and watchdog logic", description, lanes, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeLane = lanes.length > 0 ? lanes[Math.min(activeIndex, lanes.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <div className="space-y-3">
              {lanes.map((lane, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(lanes.length - 1, 0));

                return (
                  <button
                    key={lane.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{lane.title}</div>
                    {lane.status ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{lane.status}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeLane ? (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeLane.status || "Status"}</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeLane.title}</h3>
                  <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Inputs</div>
                      <div className="mt-3 grid gap-3">
                        {(activeLane.inputs || []).map((input) => (
                          <div key={input} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                            {input}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Outputs</div>
                      <div className="mt-3 grid gap-3">
                        {(activeLane.outputs || []).map((output) => (
                          <div key={output} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                            {output}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {activeLane.watchdog ? <div className="mt-6 rounded-2xl border border-border bg-primary/5 px-5 py-4 text-sm font-medium">{activeLane.watchdog}</div> : null}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add lanes to populate the protocol runtime.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductProtocolRuntime.displayName = "LandingProductProtocolRuntime";