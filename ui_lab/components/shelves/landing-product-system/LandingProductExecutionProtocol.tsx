import { cn } from "@/lib/utils";
import * as React from "react";

export interface ExecutionProtocolRule {
  title: string;
  trigger?: string;
  handler?: string;
  escalation?: string;
  proof?: string;
}

export interface LandingProductExecutionProtocolProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  rules: ExecutionProtocolRule[];
}

export const LandingProductExecutionProtocol = React.forwardRef<HTMLElement, LandingProductExecutionProtocolProps>(
  ({ className, title = "Describe execution as protocol, not good intentions", description, rules, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.9fr_0.8fr_0.8fr_0.8fr_1fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Rule</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Trigger</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Handler</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Escalation</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Proof</div>
            </div>
            <div className="divide-y divide-border">
              {rules.map((rule) => (
                <article key={rule.title} className="grid gap-4 px-5 py-5 md:grid-cols-[0.9fr_0.8fr_0.8fr_0.8fr_1fr] md:px-6">
                  <div className="text-sm font-medium">{rule.title}</div>
                  <div className="text-sm text-muted-foreground">{rule.trigger || "Trigger"}</div>
                  <div className="text-sm text-muted-foreground">{rule.handler || "Handler"}</div>
                  <div className="text-sm text-muted-foreground">{rule.escalation || "Escalation"}</div>
                  <div className="text-sm text-muted-foreground">{rule.proof || "Proof"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductExecutionProtocol.displayName = "LandingProductExecutionProtocol";