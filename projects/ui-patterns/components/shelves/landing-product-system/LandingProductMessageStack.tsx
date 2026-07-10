import { cn } from "@/lib/utils";
import * as React from "react";

export interface MessageStackLayer {
  title: string;
  role?: string;
  message?: string;
  proof?: string;
}

export interface LandingProductMessageStackProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  layers: MessageStackLayer[];
}

export const LandingProductMessageStack = React.forwardRef<HTMLElement, LandingProductMessageStackProps>(
  ({ className, title = "Stack messages by role so the story does not blur", description, layers, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {layers.map((layer) => (
              <article key={layer.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {layer.role ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{layer.role}</div> : null}
                <h3 className="mt-3 text-base font-semibold tracking-tight">{layer.title}</h3>
                {layer.message ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{layer.message}</p> : null}
                {layer.proof ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{layer.proof}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductMessageStack.displayName = "LandingProductMessageStack";