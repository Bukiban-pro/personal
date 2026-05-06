import { cn } from "@/lib/utils";
import * as React from "react";

export interface UseCaseItem {
  role: string;
  challenge: string;
  outcome: string;
}

export interface LandingProductUseCasesProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  cases: UseCaseItem[];
}

export const LandingProductUseCases = React.forwardRef<
  HTMLElement,
  LandingProductUseCasesProps
>(({ className, title = "Use Cases", description, cases, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((item) => (
            <article key={item.role} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{item.role}</div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.challenge}</p>
              <p className="mt-4 rounded-xl bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                {item.outcome}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductUseCases.displayName = "LandingProductUseCases";
