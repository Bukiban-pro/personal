import { cn } from "@/lib/utils";
import * as React from "react";

export interface ShowcasePanel {
  title: string;
  description?: string;
  media: React.ReactNode;
}

export interface LandingProductInteractiveShowcaseProps
  extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  title?: string;
  description?: string;
  panels: ShowcasePanel[];
}

function LandingProductInteractiveShowcaseInner(
  { className, title, description, panels, ...props }: LandingProductInteractiveShowcaseProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return React.createElement(
    "section",
    { ref, className: cn("w-full py-12 lg:py-16", className), ...props },
    React.createElement(
      "div",
      { className: "mx-auto flex w-full max-w-6xl flex-col gap-8 px-6" },
      React.createElement(
        "div",
        { className: "flex flex-col gap-3" },
        title
          ? React.createElement(
              "h2",
              { className: "text-3xl font-semibold tracking-tight md:text-4xl" },
              title,
            )
          : null,
        description
          ? React.createElement(
              "p",
              { className: "max-w-2xl text-base text-muted-foreground md:text-lg" },
              description,
            )
          : null,
      ),
      React.createElement(
        "div",
        { className: "grid gap-6 lg:grid-cols-[0.35fr_0.65fr]" },
        React.createElement(
          "div",
          { className: "space-y-3" },
          panels.map((panel, index) =>
            React.createElement(
              "button",
              {
                key: panel.title,
                type: "button",
                onClick: () => setActiveIndex(index),
                className: cn(
                  "w-full rounded-2xl border p-5 text-left transition-all",
                  index === activeIndex
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:bg-muted/40",
                ),
              },
              React.createElement(
                "div",
                { className: "text-base font-semibold tracking-tight" },
                panel.title,
              ),
              panel.description
                ? React.createElement(
                    "p",
                    { className: "mt-2 text-sm leading-6 text-muted-foreground" },
                    panel.description,
                  )
                : null,
            ),
          ),
        ),
        React.createElement(
          "div",
          { className: "overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm" },
          React.createElement(
            "div",
            { className: "rounded-2xl border border-border bg-muted/30 p-6" },
            panels[activeIndex]?.media,
          ),
        ),
      ),
    ),
  );
}

export const LandingProductInteractiveShowcase = React.forwardRef(
  LandingProductInteractiveShowcaseInner,
);

LandingProductInteractiveShowcase.displayName = "LandingProductInteractiveShowcase";
