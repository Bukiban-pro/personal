import { cn } from "@/lib/utils";
import * as React from "react";

export interface DecisionCanvasBlock {
  title: string;
  description?: string;
  prompts?: string[];
}

export interface LandingProductDecisionCanvasProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  blocks: DecisionCanvasBlock[];
}

export const LandingProductDecisionCanvas = React.forwardRef<
  HTMLElement,
  LandingProductDecisionCanvasProps
>(({ className, title = "Give the buying team a shared decision canvas", description, blocks, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {blocks.map((block) => (
            <article key={block.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight">{block.title}</h3>
              {block.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{block.description}</p> : null}
              {block.prompts?.length ? (
                <ul className="mt-4 grid gap-2">
                  {block.prompts.map((prompt) => (
                    <li key={prompt} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      {prompt}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductDecisionCanvas.displayName = "LandingProductDecisionCanvas";