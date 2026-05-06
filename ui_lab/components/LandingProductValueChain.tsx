import { cn } from "@/lib/utils";
import * as React from "react";

export interface ValueChainLink {
  title: string;
  input?: string;
  transformation?: string;
  outcome?: string;
}

export interface LandingProductValueChainProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  links: ValueChainLink[];
}

export const LandingProductValueChain = React.forwardRef<HTMLElement, LandingProductValueChainProps>(
  ({ className, title = "Show how value moves through the chain, not just where it ends", description, links, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {links.map((link, index) => (
              <article key={link.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-sm font-semibold tracking-tight">Link {index + 1}</div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{link.title}</h3>
                {link.input ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{link.input}</p> : null}
                {link.transformation ? <div className="mt-4 text-sm font-medium text-foreground">{link.transformation}</div> : null}
                {link.outcome ? <div className="mt-2 text-sm text-muted-foreground">{link.outcome}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductValueChain.displayName = "LandingProductValueChain";