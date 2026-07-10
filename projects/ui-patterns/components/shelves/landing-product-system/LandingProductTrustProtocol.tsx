import { cn } from "@/lib/utils";
import * as React from "react";

export interface TrustProtocolRule {
  title: string;
  trigger?: string;
  response?: string;
  owner?: string;
  evidence?: string;
}

export interface LandingProductTrustProtocolProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rules: TrustProtocolRule[];
}

export const LandingProductTrustProtocol = React.forwardRef<HTMLElement, LandingProductTrustProtocolProps>(
  ({ className, title = "Describe trust as protocol: trigger, response, owner, proof", description, rules, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.9fr_0.9fr_0.9fr_0.8fr_1fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Rule</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Trigger</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Response</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Owner</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Evidence</div>
            </div>
            <div className="divide-y divide-border">
              {rules.map((rule) => (
                <article key={rule.title} className="grid gap-4 px-5 py-5 md:grid-cols-[0.9fr_0.9fr_0.9fr_0.8fr_1fr] md:px-6">
                  <div className="text-sm font-medium">{rule.title}</div>
                  <div className="text-sm text-muted-foreground">{rule.trigger || "Condition"}</div>
                  <div className="text-sm text-muted-foreground">{rule.response || "Response"}</div>
                  <div className="text-sm text-muted-foreground">{rule.owner || "Owner"}</div>
                  <div className="text-sm text-muted-foreground">{rule.evidence || "Proof"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductTrustProtocol.displayName = "LandingProductTrustProtocol";