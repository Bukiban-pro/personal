import { cn } from "@/lib/utils";
import * as React from "react";

export interface ExecutionBoardColumn {
  title: string;
  items?: string[];
}

export interface LandingProductExecutionBoardProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  columns: ExecutionBoardColumn[];
}

export const LandingProductExecutionBoard = React.forwardRef<HTMLElement, LandingProductExecutionBoardProps>(
  ({ className, title = "Show execution as a living board of moves and blockers", description, columns, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {columns.map((column) => (
              <article key={column.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold tracking-tight">{column.title}</h3>
                <div className="mt-4 grid gap-2">
                  {column.items?.map((item) => (
                    <div key={item} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductExecutionBoard.displayName = "LandingProductExecutionBoard";