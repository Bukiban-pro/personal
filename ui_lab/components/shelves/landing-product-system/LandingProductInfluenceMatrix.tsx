import { cn } from "@/lib/utils";
import * as React from "react";

export interface InfluenceMatrixCell {
  title: string;
  arena?: string;
  leverage?: string;
  proof?: string;
  nextMove?: string;
}

export interface LandingProductInfluenceMatrixProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  cells: InfluenceMatrixCell[];
}

export const LandingProductInfluenceMatrix = React.forwardRef<HTMLElement, LandingProductInfluenceMatrixProps>(
  ({ className, title = "Make influence visible as a matrix of arenas, leverage, and next moves", description, cells, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/40 text-sm md:grid-cols-[0.9fr_0.85fr_0.95fr_0.95fr_1fr]">
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Cell</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Arena</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Leverage</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Proof</div>
              <div className="px-5 py-4 font-semibold text-foreground md:px-6">Next Move</div>
            </div>
            <div className="divide-y divide-border">
              {cells.map((cell) => (
                <article key={cell.title} className="grid gap-4 px-5 py-5 md:grid-cols-[0.9fr_0.85fr_0.95fr_0.95fr_1fr] md:px-6">
                  <div className="text-sm font-medium">{cell.title}</div>
                  <div className="text-sm text-muted-foreground">{cell.arena || "Arena"}</div>
                  <div className="text-sm text-muted-foreground">{cell.leverage || "Leverage"}</div>
                  <div className="text-sm text-muted-foreground">{cell.proof || "Proof"}</div>
                  <div className="text-sm text-muted-foreground">{cell.nextMove || "Next Move"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductInfluenceMatrix.displayName = "LandingProductInfluenceMatrix";