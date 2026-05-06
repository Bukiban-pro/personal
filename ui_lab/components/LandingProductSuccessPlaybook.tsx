import { cn } from "@/lib/utils";
import * as React from "react";

export interface SuccessPlaybookItem {
  title: string;
  description?: string;
  owner?: string;
  cadence?: string;
  checklist: string[];
}

export interface LandingProductSuccessPlaybookProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  plays: SuccessPlaybookItem[];
}

export const LandingProductSuccessPlaybook = React.forwardRef<
  HTMLElement,
  LandingProductSuccessPlaybookProps
>(({ className, title = "Map the success playbook before the contract starts", description, action, plays, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? (
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {plays.map((play) => (
            <article key={play.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold tracking-tight">{play.title}</h3>
                <div className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <div>{play.owner || "Owner"}</div>
                  {play.cadence ? <div className="mt-1">{play.cadence}</div> : null}
                </div>
              </div>
              {play.description ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{play.description}</p>
              ) : null}
              <ul className="mt-4 grid gap-2">
                {play.checklist.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductSuccessPlaybook.displayName = "LandingProductSuccessPlaybook";