import { cn } from "@/lib/utils";
import * as React from "react";

export interface StoryProtocolRule {
  title: string;
  trigger?: string;
  move?: string;
  evidence?: string;
  safeguard?: string;
}

export interface LandingProductStoryProtocolProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rules: StoryProtocolRule[];
}

export const LandingProductStoryProtocol = React.forwardRef<HTMLElement, LandingProductStoryProtocolProps>(
  ({ className, title = "Encode story decisions as protocol instead of instinct", description, rules, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.9fr_0.8fr_0.9fr_0.9fr_0.9fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Rule</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Trigger</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Move</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Evidence</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Safeguard</div>
            </div>
            <div className="divide-y divide-border">
              {rules.map((rule) => (
                <article key={rule.title} className="grid gap-4 px-5 py-5 md:grid-cols-[0.9fr_0.8fr_0.9fr_0.9fr_0.9fr] md:px-6">
                  <div className="text-sm font-medium">{rule.title}</div>
                  <div className="text-sm text-muted-foreground">{rule.trigger || "Trigger"}</div>
                  <div className="text-sm text-muted-foreground">{rule.move || "Move"}</div>
                  <div className="text-sm text-muted-foreground">{rule.evidence || "Evidence"}</div>
                  <div className="text-sm text-muted-foreground">{rule.safeguard || "Safeguard"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductStoryProtocol.displayName = "LandingProductStoryProtocol";