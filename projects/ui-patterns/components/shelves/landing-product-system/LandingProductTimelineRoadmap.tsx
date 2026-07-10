import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductTimelineRoadmap
 * Vertical timeline roadmap showing product milestones or onboarding journey.
 * Pattern: Ceremony/process timeline — enterprise "how we got here" and "what's next" section.
 * Inspired by: boardroom/council systems from HANDOFF_UI_MINING_2026-05-06.md.
 */

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status?: "past" | "current" | "upcoming";
  badge?: string;
}

export interface LandingProductTimelineRoadmapProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  events?: TimelineEvent[];
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  {
    date: "Q1 2023",
    title: "Company founded",
    description: "Started with a single insight: pipeline visibility should be a product, not a spreadsheet.",
    status: "past",
  },
  {
    date: "Q3 2023",
    title: "First enterprise customer",
    description: "Signed our first Fortune 500 customer. 200 seats. Deployed in 48 hours.",
    status: "past",
  },
  {
    date: "Q1 2024",
    title: "AI forecasting launched",
    description: "Released the first version of our AI commit scoring engine. 94% accuracy in beta.",
    status: "past",
    badge: "Milestone",
  },
  {
    date: "Q4 2024",
    title: "3,000 teams milestone",
    description: "Reached 3,000 active revenue teams across 42 countries.",
    status: "current",
    badge: "Now",
  },
  {
    date: "Q2 2025",
    title: "Conversation intelligence",
    description: "Full call recording, transcription, and signal extraction integrated natively.",
    status: "upcoming",
  },
  {
    date: "Q4 2025",
    title: "Revenue data platform",
    description: "Open your pipeline data to BI tools and data warehouses. Full SQL access.",
    status: "upcoming",
    badge: "Roadmap",
  },
];

const statusDot: Record<NonNullable<TimelineEvent["status"]>, string> = {
  past: "bg-muted-foreground",
  current: "bg-primary ring-4 ring-primary/20",
  upcoming: "border-2 border-border bg-background",
};

const statusLine: Record<NonNullable<TimelineEvent["status"]>, string> = {
  past: "bg-border",
  current: "bg-gradient-to-b from-primary to-border",
  upcoming: "bg-border/40",
};

export const LandingProductTimelineRoadmap = React.forwardRef<HTMLElement, LandingProductTimelineRoadmapProps>(
  (
    {
      className,
      title = "Built for the long run",
      description = "Our roadmap is driven by one question: what does a world-class revenue org actually need?",
      events = DEFAULT_EVENTS,
      ...props
    },
    ref,
  ) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6">
          {(title || description) && (
            <div className="flex flex-col gap-3">
              {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
              {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
            </div>
          )}

          <div className="relative">
            {events.map((event, i) => {
              const isLast = i === events.length - 1;
              const status = event.status ?? "past";
              return (
                <div key={i} className="flex gap-6">
                  {/* Left: dot + line */}
                  <div className="flex flex-col items-center">
                    <div className={cn("h-3.5 w-3.5 shrink-0 rounded-full", statusDot[status])} />
                    {!isLast && (
                      <div className={cn("mt-1 w-px flex-1", statusLine[status])} style={{ minHeight: "48px" }} />
                    )}
                  </div>

                  {/* Right: content */}
                  <div className={cn("flex flex-col gap-1 pb-10", isLast && "pb-0")}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {event.date}
                      </span>
                      {event.badge ? (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            status === "current"
                              ? "bg-primary/15 text-primary"
                              : status === "upcoming"
                                ? "bg-muted text-muted-foreground"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          {event.badge}
                        </span>
                      ) : null}
                    </div>
                    <h3
                      className={cn(
                        "text-base font-semibold",
                        status === "upcoming" ? "text-muted-foreground" : "text-foreground",
                      )}
                    >
                      {event.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductTimelineRoadmap.displayName = "LandingProductTimelineRoadmap";
