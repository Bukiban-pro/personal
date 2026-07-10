import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductInteractiveFAQ
 * Expandable FAQ accordion with animated chevron.
 * Pattern: clean enterprise FAQ — standard Stripe/Linear bottom-of-page section.
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LandingProductInteractiveFAQProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  items?: FAQItem[];
  /** Allow multiple items open simultaneously */
  multi?: boolean;
}

const DEFAULT_ITEMS: FAQItem[] = [
  {
    question: "How long does it take to get set up?",
    answer:
      "Most teams are live within a single business day. Our onboarding team handles the CRM connection, field mapping, and initial data backfill. You don't need engineering resources.",
  },
  {
    question: "Which CRMs do you integrate with?",
    answer:
      "We support Salesforce, HubSpot, and Pipedrive out of the box with bi-directional real-time sync. Microsoft Dynamics and custom CRMs are available on Enterprise plans.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We are SOC 2 Type II certified. All data is encrypted in transit and at rest. Field-level encryption is available on Enterprise. We never sell or share customer data.",
  },
  {
    question: "Can I try it before committing?",
    answer:
      "Absolutely. Every plan includes a 14-day free trial with full functionality. No credit card required to start. You can import live CRM data on day one.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "You can export all your data at any time in CSV or JSON format. We retain your data for 90 days post-cancellation, after which it is permanently deleted.",
  },
  {
    question: "Do you offer volume or multi-year pricing?",
    answer:
      "Yes. Contact our sales team for volume discounts on seats and multi-year contract pricing. We also offer non-profit and startup pricing for qualifying organizations.",
  },
];

function FAQRow({
  item,
  open,
  onToggle,
}: {
  item: FAQItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
      >
        <span className={cn("text-base font-medium transition-colors", open ? "text-foreground" : "text-foreground/90")}>
          {item.question}
        </span>
        <svg
          viewBox="0 0 16 16"
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <p className="text-sm leading-7 text-muted-foreground">{item.answer}</p>
      </div>
    </div>
  );
}

export const LandingProductInteractiveFAQ = React.forwardRef<HTMLElement, LandingProductInteractiveFAQProps>(
  (
    {
      className,
      title = "Frequently asked questions",
      description,
      items = DEFAULT_ITEMS,
      multi = false,
      ...props
    },
    ref,
  ) => {
    const [openSet, setOpenSet] = React.useState<Set<number>>(new Set([0]));

    const toggle = (i: number) => {
      setOpenSet((prev) => {
        const next = new Set(prev);
        if (next.has(i)) {
          next.delete(i);
        } else {
          if (!multi) next.clear();
          next.add(i);
        }
        return next;
      });
    };

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6">
          {(title || description) && (
            <div className="flex flex-col gap-3">
              {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
              {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card px-6 shadow-sm">
            {items.map((item, i) => (
              <FAQRow key={i} item={item} open={openSet.has(i)} onToggle={() => toggle(i)} />
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductInteractiveFAQ.displayName = "LandingProductInteractiveFAQ";
