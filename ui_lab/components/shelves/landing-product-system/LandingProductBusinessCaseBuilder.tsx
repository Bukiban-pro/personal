import { cn } from "@/lib/utils";
import * as React from "react";

export interface BusinessCaseLever {
  label: string;
  value: string;
  detail?: string;
}

export interface LandingProductBusinessCaseBuilderProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  levers: BusinessCaseLever[];
  assumptions?: string[];
}

export const LandingProductBusinessCaseBuilder = React.forwardRef<
  HTMLElement,
  LandingProductBusinessCaseBuilderProps
>(({ className, title = "Turn interest into a defendable business case", description, levers, assumptions = [], ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? (
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {levers.map((lever) => (
              <article key={lever.label} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">{lever.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight">{lever.value}</div>
                {lever.detail ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{lever.detail}</p> : null}
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Model assumptions</div>
          <div className="mt-4 grid gap-3">
            {assumptions.map((assumption) => (
              <div key={assumption} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                {assumption}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

LandingProductBusinessCaseBuilder.displayName = "LandingProductBusinessCaseBuilder";