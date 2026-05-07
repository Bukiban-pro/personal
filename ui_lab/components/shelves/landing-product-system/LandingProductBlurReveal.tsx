import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductBlurReveal
 * Progressive blur-to-clear reveal of content rows as user scrolls.
 * Pattern: Blur Fade / Progressive Blur from research docs.
 */

export interface RevealItem {
  icon?: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
}

export interface LandingProductBlurRevealProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items?: RevealItem[];
}

const DEFAULT_ITEMS: RevealItem[] = [
  {
    title: "Revenue intelligence, unified",
    description:
      "All signals from email, calls, CRM, and calendar fused into one timeline per deal.",
    tag: "Foundation",
  },
  {
    title: "AI forecast scoring",
    description:
      "Predictive commit and best-case scores updated continuously — not just on Friday.",
    tag: "Intelligence",
  },
  {
    title: "Stakeholder coverage",
    description:
      "Map every contact in the deal, track engagement depth, and flag gaps automatically.",
    tag: "Relationships",
  },
  {
    title: "Risk surface & alerts",
    description:
      "Anomaly detection triggers 30 days before a deal goes dark — giving teams time to act.",
    tag: "Risk",
  },
  {
    title: "Manager coaching layer",
    description:
      "Call intelligence surfaces talk ratio, objection patterns, and coaching moments per rep.",
    tag: "Coaching",
  },
  {
    title: "Enterprise security",
    description:
      "SOC 2 Type II, SSO, SCIM, field-level encryption, and a full audit log out of the box.",
    tag: "Security",
  },
];

function RevealRow({ item, index }: { item: RevealItem; index: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "0px 0px -60px 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-start gap-5 border-b border-border py-6 last:border-b-0",
        "transition-all duration-700",
        visible ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm translate-y-3",
      )}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {item.icon ? (
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card">
          {item.icon}
        </div>
      ) : (
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-xs font-bold tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
          {item.tag ? (
            <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {item.tag}
            </span>
          ) : null}
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
      </div>
    </div>
  );
}

export const LandingProductBlurReveal = React.forwardRef<HTMLElement, LandingProductBlurRevealProps>(
  (
    {
      className,
      title = "The full platform, piece by piece",
      description = "Every capability you need to run a world-class revenue org.",
      items = DEFAULT_ITEMS,
      ...props
    },
    ref,
  ) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6">
          {(title || description) && (
            <div className="flex flex-col gap-3">
              {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
              {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
            </div>
          )}

          <div>
            {items.map((item, i) => (
              <RevealRow key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductBlurReveal.displayName = "LandingProductBlurReveal";
