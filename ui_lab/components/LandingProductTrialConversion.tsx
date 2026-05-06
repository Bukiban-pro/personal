import { cn } from "@/lib/utils";
import * as React from "react";

export interface TrialConversionStep {
  title: string;
  metric?: string;
  description?: string;
}

export interface LandingProductTrialConversionProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  steps: TrialConversionStep[];
  note?: string;
}

export const LandingProductTrialConversion = React.forwardRef<
  HTMLElement,
  LandingProductTrialConversionProps
>(({ className, title = "Convert trial energy into purchase momentum", description, steps, note, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold">
                  {index + 1}
                </div>
                {step.metric ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{step.metric}</div> : null}
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">{step.title}</h3>
              {step.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p> : null}
            </article>
          ))}
        </div>

        {note ? <p className="text-sm leading-7 text-muted-foreground md:text-base">{note}</p> : null}
      </div>
    </section>
  );
});

LandingProductTrialConversion.displayName = "LandingProductTrialConversion";