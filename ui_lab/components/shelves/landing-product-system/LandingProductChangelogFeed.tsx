import { cn } from "@/lib/utils";
import * as React from "react";

export interface ChangelogFeedEntry {
  version: string;
  title: string;
  date: string;
  description?: string;
  items?: string[];
  type?: "feature" | "improvement" | "fix";
}

export interface LandingProductChangelogFeedProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  entries: ChangelogFeedEntry[];
}

export const LandingProductChangelogFeed = React.forwardRef<
  HTMLElement,
  LandingProductChangelogFeedProps
>(({ className, title = "Keep shipping proof visible", description, entries, ...props }, ref) => {
  const filters = [
    "All",
    ...Array.from(new Set(entries.map((entry) => entry.type).filter(Boolean))) as string[],
  ];
  const [activeFilter, setActiveFilter] = React.useState<string>("All");

  const visibleEntries =
    activeFilter === "All"
      ? entries
      : entries.filter((entry) => entry.type === activeFilter);

  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? (
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  filter === activeFilter
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/40",
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="relative grid gap-4">
          <div className="absolute bottom-0 left-5 top-3 hidden w-px bg-border md:block" aria-hidden="true" />
          {visibleEntries.map((entry, index) => (
            <article
              key={`${entry.version}-${entry.title}`}
              className="relative grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:grid-cols-[auto_1fr] md:gap-5 md:p-6"
            >
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold uppercase tracking-[0.08em]">
                {index + 1}
              </div>
              <div>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold tracking-tight md:text-lg">{entry.title}</h3>
                      <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        {entry.version}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{entry.date}</div>
                  </div>
                  {entry.type ? (
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {entry.type}
                    </div>
                  ) : null}
                </div>

                {entry.description ? (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{entry.description}</p>
                ) : null}

                {entry.items?.length ? (
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {entry.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductChangelogFeed.displayName = "LandingProductChangelogFeed";