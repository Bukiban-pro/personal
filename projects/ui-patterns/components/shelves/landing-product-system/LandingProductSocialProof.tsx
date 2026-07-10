import { cn } from "@/lib/utils";
import * as React from "react";

export interface SocialProofQuote {
  quote: string;
  author: string;
  role?: string;
  company?: string;
}

export interface LandingProductSocialProofProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  quotes: SocialProofQuote[];
}

export const LandingProductSocialProof = React.forwardRef<HTMLElement, LandingProductSocialProofProps>(
  ({ className, title = "Loved by teams", description, quotes, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quotes.map((item) => (
              <figure key={`${item.author}-${item.quote}`} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <blockquote className="text-sm leading-7 text-foreground">“{item.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  <div className="font-medium text-foreground">{item.author}</div>
                  <div>
                    {[item.role, item.company].filter(Boolean).join(" · ")}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductSocialProof.displayName = "LandingProductSocialProof";
