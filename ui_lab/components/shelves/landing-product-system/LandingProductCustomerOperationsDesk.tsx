import { cn } from "@/lib/utils";
import * as React from "react";

export interface CustomerOperationsQueue {
  title: string;
  volume?: string;
  owner?: string;
  description?: string;
  action?: React.ReactNode;
}

export interface LandingProductCustomerOperationsDeskProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  queues: CustomerOperationsQueue[];
}

export const LandingProductCustomerOperationsDesk = React.forwardRef<
  HTMLElement,
  LandingProductCustomerOperationsDeskProps
>(({ className, title = "Show the customer operations desk as a real system", description, queues, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {queues.map((queue) => (
            <article key={queue.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">{queue.title}</h3>
                <div className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {queue.volume ? <div>{queue.volume}</div> : null}
                  {queue.owner ? <div className="mt-1">{queue.owner}</div> : null}
                </div>
              </div>
              {queue.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{queue.description}</p> : null}
              {queue.action ? <div className="mt-4">{queue.action}</div> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductCustomerOperationsDesk.displayName = "LandingProductCustomerOperationsDesk";