import { cn } from "@/lib/utils";
import * as React from "react";

export interface NarrativeSequenceChapter {
  title: string;
  tension?: string;
  resolution?: string;
  proof?: string[];
}

export interface LandingProductNarrativeSequenceProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  chapters: NarrativeSequenceChapter[];
}

export const LandingProductNarrativeSequence = React.forwardRef<HTMLElement, LandingProductNarrativeSequenceProps>(
  ({ className, title = "Sequence the narrative so the page earns each next claim", description, chapters, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeChapter = chapters.length > 0 ? chapters[Math.min(activeIndex, chapters.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="flex flex-wrap gap-3">
            {chapters.map((chapter, index) => {
              const isActive = index === Math.min(activeIndex, Math.max(chapters.length - 1, 0));

              return (
                <button
                  key={chapter.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    isActive ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted/40",
                  )}
                >
                  {chapter.title}
                </button>
              );
            })}
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
            {activeChapter ? (
              <>
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{activeChapter.title}</h3>
                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-muted/30 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tension</div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{activeChapter.tension || "Define the problem pressure for this chapter."}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-primary/5 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Resolution</div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{activeChapter.resolution || "Define the design answer this chapter should deliver."}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  {(activeChapter.proof || []).map((item) => (
                    <div key={item} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Add chapters to build the narrative sequence.</div>
            )}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductNarrativeSequence.displayName = "LandingProductNarrativeSequence";