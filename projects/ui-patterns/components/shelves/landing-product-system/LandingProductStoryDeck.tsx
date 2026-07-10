import { cn } from "@/lib/utils";
import * as React from "react";

export interface StoryDeckCard {
  title: string;
  scene?: string;
  beat?: string;
  evidence?: string;
  cue?: string;
}

export interface LandingProductStoryDeckProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  cards: StoryDeckCard[];
}

export const LandingProductStoryDeck = React.forwardRef<HTMLElement, LandingProductStoryDeckProps>(
  ({ className, title = "Lay the narrative out as a deck of scenes, beats, and proof cues", description, cards, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{card.scene || "Scene"}</div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{card.title}</h3>
                {card.beat ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.beat}</p> : null}
                {card.evidence ? <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{card.evidence}</div> : null}
                {card.cue ? <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-sm font-medium">{card.cue}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductStoryDeck.displayName = "LandingProductStoryDeck";