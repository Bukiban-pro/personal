import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductScrollStory
 * Sticky scroll narrative — left column stays pinned while right column
 * advances through story steps as user scrolls.
 * Pattern: Scroll-pinned storytelling (Apple, Linear, Stripe style).
 */

export interface StoryStep {
  label?: string;
  heading: string;
  body: string;
  visual?: React.ReactNode;
}

export interface LandingProductScrollStoryProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  steps?: StoryStep[];
}

const DEFAULT_STEPS: StoryStep[] = [
  {
    label: "Step 01",
    heading: "Connect your CRM in minutes",
    body: "Bi-directional sync with Salesforce, HubSpot, and Pipedrive. No data migration. No disruption. Your reps keep working exactly as before.",
  },
  {
    label: "Step 02",
    heading: "AI learns your close patterns",
    body: "Our model trains on your historical win/loss data and starts scoring pipeline confidence within the first week — no manual configuration.",
  },
  {
    label: "Step 03",
    heading: "Run your first forecast review",
    body: "Replace the spreadsheet review with a live board where every deal, every risk flag, and every forecast delta is visible in one place.",
  },
  {
    label: "Step 04",
    heading: "Hit quota consistently",
    body: "Teams using the platform report 40% improvement in pipeline coverage and 98% forecast accuracy within 90 days.",
  },
];

export const LandingProductScrollStory = React.forwardRef<HTMLElement, LandingProductScrollStoryProps>(
  (
    {
      className,
      title = "How it works",
      description = "From connect to confident in under a week.",
      steps = DEFAULT_STEPS,
      ...props
    },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const stepRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    React.useEffect(() => {
      const observers = steps.map((_, i) => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveIndex(i);
          },
          { rootMargin: "-40% 0px -40% 0px" },
        );
        if (stepRefs.current[i]) observer.observe(stepRefs.current[i]!);
        return observer;
      });
      return () => observers.forEach((o) => o.disconnect());
    }, [steps.length]);

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto w-full max-w-6xl px-6">
          {(title || description) && (
            <div className="mb-12 flex flex-col gap-3">
              {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
              {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
            </div>
          )}

          <div className="flex flex-col gap-0 lg:flex-row lg:gap-16">
            {/* Sticky left panel */}
            <div className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-24 flex flex-col gap-2">
                {steps.map((step, i) => (
                  <button
                    key={i}
                    type="button"
                    className={cn(
                      "rounded-xl px-4 py-3 text-left text-sm transition-all duration-200",
                      activeIndex === i
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  >
                    {step.label && (
                      <span className="mb-0.5 block text-xs font-medium uppercase tracking-widest opacity-60">
                        {step.label}
                      </span>
                    )}
                    {step.heading}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrolling right column */}
            <div className="flex flex-1 flex-col gap-0">
              {steps.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  className="flex min-h-[360px] flex-col justify-center gap-4 border-b border-border py-12 last:border-b-0"
                >
                  {step.label ? (
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {step.label}
                    </span>
                  ) : null}
                  <h3 className="text-2xl font-semibold tracking-tight">{step.heading}</h3>
                  <p className="max-w-lg text-base leading-7 text-muted-foreground">{step.body}</p>
                  {step.visual ? <div className="mt-4">{step.visual}</div> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductScrollStory.displayName = "LandingProductScrollStory";
