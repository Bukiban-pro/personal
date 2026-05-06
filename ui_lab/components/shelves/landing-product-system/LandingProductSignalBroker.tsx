import { cn } from "@/lib/utils";
import * as React from "react";

export interface SignalBrokerChannel {
  title: string;
  source?: string;
  rule?: string;
  output?: string;
  signals?: string[];
}

export interface LandingProductSignalBrokerProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  channels: SignalBrokerChannel[];
}

export const LandingProductSignalBroker = React.forwardRef<HTMLElement, LandingProductSignalBrokerProps>(
  ({ className, title = "Broker signals into action instead of letting them accumulate", description, channels, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeChannel = channels.length > 0 ? channels[Math.min(activeIndex, channels.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <div className="space-y-3">
              {channels.map((channel, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(channels.length - 1, 0));

                return (
                  <button
                    key={channel.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{channel.title}</div>
                    {channel.source ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{channel.source}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeChannel ? (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeChannel.source || "Source"}</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeChannel.title}</h3>
                  {activeChannel.rule ? <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">{activeChannel.rule}</p> : null}
                  <div className="mt-6 grid gap-3">
                    {(activeChannel.signals || []).map((signal) => (
                      <div key={signal} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        {signal}
                      </div>
                    ))}
                  </div>
                  {activeChannel.output ? <div className="mt-6 rounded-2xl border border-border bg-primary/5 px-5 py-4 text-sm font-medium">{activeChannel.output}</div> : null}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add channels to populate the broker.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductSignalBroker.displayName = "LandingProductSignalBroker";