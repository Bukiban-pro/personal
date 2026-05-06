import { cn } from "@/lib/utils";
import * as React from "react";

export interface SupportCoverageChannel {
  name: string;
  availability: string;
  responseTime?: string;
  detail?: string;
}

export interface LandingProductSupportCoverageProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  channels: SupportCoverageChannel[];
}

export const LandingProductSupportCoverage = React.forwardRef<
  HTMLElement,
  LandingProductSupportCoverageProps
>(({ className, title = "Set support expectations before rollout begins", description, channels, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[1fr_0.8fr_0.8fr]">
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Channel</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Availability</div>
            <div className="px-5 py-4 font-semibold text-foreground md:px-6">Response</div>
          </div>

          <div className="divide-y divide-border">
            {channels.map((channel) => (
              <article key={channel.name} className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_0.8fr_0.8fr] md:px-6">
                <div>
                  <h3 className="text-base font-semibold tracking-tight">{channel.name}</h3>
                  {channel.detail ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{channel.detail}</p> : null}
                </div>
                <div className="text-sm text-muted-foreground">{channel.availability}</div>
                <div className="text-sm text-muted-foreground">{channel.responseTime || "Standard"}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductSupportCoverage.displayName = "LandingProductSupportCoverage";