import { cn } from "@/lib/utils";
import * as React from "react";

export interface LandingProductCTAStackProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  note?: string;
}

export const LandingProductCTAStack = React.forwardRef<HTMLElement, LandingProductCTAStackProps>(
  ({ className, title, description, primaryAction, secondaryAction, note, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 rounded-3xl border border-border bg-card px-6 py-10 text-center shadow-sm lg:px-10 lg:py-14">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {primaryAction ? <div>{primaryAction}</div> : null}
            {secondaryAction ? <div>{secondaryAction}</div> : null}
          </div>

          {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
        </div>
      </section>
    );
  },
);

LandingProductCTAStack.displayName = "LandingProductCTAStack";
