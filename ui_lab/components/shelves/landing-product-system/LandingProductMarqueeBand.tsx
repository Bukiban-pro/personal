import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductMarqueeBand
 * Infinite CSS marquee for logos / stat chips / quote snippets.
 * Pattern: Marquee from Magic UI — CSS animation, no dependencies.
 */

export interface MarqueeItem {
  /** Render a logo image, stat badge, or plain label */
  content: React.ReactNode;
}

export interface LandingProductMarqueeBandProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items?: MarqueeItem[];
  /** Seconds for one full pass. Default 30. */
  duration?: number;
  /** Reverse direction */
  reverse?: boolean;
  /** Show a second row scrolling in reverse */
  doubleRow?: boolean;
}

const DEFAULT_ITEMS: MarqueeItem[] = [
  { content: <span className="font-semibold">Acme Corp</span> },
  { content: <span className="font-semibold">Vercel</span> },
  { content: <span className="font-semibold">Linear</span> },
  { content: <span className="font-semibold">Notion</span> },
  { content: <span className="font-semibold">Stripe</span> },
  { content: <span className="font-semibold">Figma</span> },
  { content: <span className="font-semibold">Loom</span> },
  { content: <span className="font-semibold">Airtable</span> },
  { content: <span className="font-semibold">Zapier</span> },
  { content: <span className="font-semibold">Intercom</span> },
];

function MarqueeTrack({
  items,
  duration,
  reverse,
}: {
  items: MarqueeItem[];
  duration: number;
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="relative flex overflow-hidden">
      {/* Gradient fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />

      <div
        className="flex gap-4 py-2"
        style={{
          animation: `marquee-scroll ${duration}s linear infinite${reverse ? " reverse" : ""}`,
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm text-foreground shadow-sm"
          >
            {item.content}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export const LandingProductMarqueeBand = React.forwardRef<HTMLElement, LandingProductMarqueeBandProps>(
  (
    {
      className,
      title = "Trusted by leading teams",
      description,
      items = DEFAULT_ITEMS,
      duration = 30,
      reverse = false,
      doubleRow = false,
      ...props
    },
    ref,
  ) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          {(title || description) && (
            <div className="flex flex-col gap-2 text-center">
              {title ? <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">{title}</p> : null}
              {description ? <p className="mx-auto max-w-xl text-base text-muted-foreground">{description}</p> : null}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 overflow-hidden">
          <MarqueeTrack items={items} duration={duration} reverse={reverse} />
          {doubleRow && <MarqueeTrack items={items} duration={duration} reverse={!reverse} />}
        </div>
      </section>
    );
  },
);

LandingProductMarqueeBand.displayName = "LandingProductMarqueeBand";
