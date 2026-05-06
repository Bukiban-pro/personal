import { cn } from "@/lib/utils";
import * as React from "react";

export interface NarrativeBriefingCard {
  title: string;
  audience?: string;
  message?: string;
  takeaway?: string;
}

export interface LandingProductNarrativeBriefingProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  cards: NarrativeBriefingCard[];
}

export const LandingProductNarrativeBriefing = React.forwardRef<HTMLElement, LandingProductNarrativeBriefingProps>(
  ({ className, title = "Package the narrative into briefing cards different teams can reuse", description, cards, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {cards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {card.audience ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{card.audience}</div> : null}
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{card.title}</h3>
                {card.message ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.message}</p> : null}
                {card.takeaway ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{card.takeaway}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductNarrativeBriefing.displayName = "LandingProductNarrativeBriefing";