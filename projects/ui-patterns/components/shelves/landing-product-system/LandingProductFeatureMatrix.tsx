import { cn } from "@/lib/utils";
import * as React from "react";

export interface MatrixColumn {
  label: string;
  description?: string;
}

export interface MatrixRow {
  label: string;
  cells: string[];
}

export interface LandingProductFeatureMatrixProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  columns: MatrixColumn[];
  rows: MatrixRow[];
}

export const LandingProductFeatureMatrix = React.forwardRef<HTMLElement, LandingProductFeatureMatrixProps>(
  ({ className, title, description, columns, rows, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="grid border-b border-border bg-muted/50" style={{ gridTemplateColumns: `minmax(12rem, 1fr) repeat(${columns.length}, minmax(0, 1fr))` }}>
              <div className="px-4 py-3 text-sm font-semibold text-muted-foreground">Feature</div>
              {columns.map((column) => (
                <div key={column.label} className="px-4 py-3 text-sm font-semibold">
                  <div>{column.label}</div>
                  {column.description ? <div className="mt-1 text-xs font-normal text-muted-foreground">{column.description}</div> : null}
                </div>
              ))}
            </div>

            <div className="divide-y divide-border">
              {rows.map((row) => (
                <div key={row.label} className="grid items-start" style={{ gridTemplateColumns: `minmax(12rem, 1fr) repeat(${columns.length}, minmax(0, 1fr))` }}>
                  <div className="px-4 py-4 text-sm font-medium">{row.label}</div>
                  {row.cells.map((cell, index) => (
                    <div key={`${row.label}-${index}`} className="px-4 py-4 text-sm leading-6 text-muted-foreground">
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductFeatureMatrix.displayName = "LandingProductFeatureMatrix";
