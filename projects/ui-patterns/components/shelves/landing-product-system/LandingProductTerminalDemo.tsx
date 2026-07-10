import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductTerminalDemo
 * Code-editor UI shell pattern — shows product integration steps in a styled terminal.
 * Pattern: Code-Editor UI Shell from research docs.
 */

export interface TerminalLine {
  type: "comment" | "command" | "output" | "success" | "blank";
  text?: string;
}

export interface LandingProductTerminalDemoProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  windowTitle?: string;
  lines?: TerminalLine[];
  aside?: {
    heading: string;
    points: string[];
  };
}

const DEFAULT_LINES: TerminalLine[] = [
  { type: "comment", text: "# Install the SDK" },
  { type: "command", text: "npm install @yourco/sdk" },
  { type: "output", text: "added 1 package in 0.9s" },
  { type: "blank" },
  { type: "comment", text: "# Initialize and authenticate" },
  { type: "command", text: "import { Client } from '@yourco/sdk'" },
  { type: "command", text: "const client = new Client({ apiKey: process.env.API_KEY })" },
  { type: "blank" },
  { type: "comment", text: "# Pull live pipeline data" },
  { type: "command", text: "const deals = await client.pipeline.list({ stage: 'commit' })" },
  { type: "success", text: "✓ 23 deals returned in 142ms" },
];

const DEFAULT_ASIDE = {
  heading: "Live in under 10 minutes",
  points: [
    "Official SDKs for TypeScript, Python, and Ruby",
    "RESTful API with full OpenAPI spec",
    "Webhooks for every pipeline event",
    "Sandbox environment included on all plans",
  ],
};

const lineColor: Record<TerminalLine["type"], string> = {
  comment: "text-muted-foreground",
  command: "text-foreground",
  output: "text-muted-foreground/70",
  success: "text-emerald-400",
  blank: "",
};

const linePrefix: Record<TerminalLine["type"], string> = {
  comment: "",
  command: "$ ",
  output: "  ",
  success: "  ",
  blank: "",
};

export const LandingProductTerminalDemo = React.forwardRef<HTMLElement, LandingProductTerminalDemoProps>(
  (
    {
      className,
      title = "Simple to integrate. Powerful to run.",
      description = "Connect your stack in minutes. Our API is built for engineers who don't want to read a 200-page manual.",
      windowTitle = "Terminal",
      lines = DEFAULT_LINES,
      aside = DEFAULT_ASIDE,
      ...props
    },
    ref,
  ) => {
    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
          {(title || description) && (
            <div className="flex flex-col gap-3">
              {title ? <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2> : null}
              {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
            </div>
          )}

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Terminal window */}
            <div className="flex-1 overflow-hidden rounded-2xl border border-border bg-zinc-950 shadow-xl shadow-black/30">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-white/40">{windowTitle}</span>
              </div>
              {/* Lines */}
              <div className="space-y-1 p-5 font-mono text-sm">
                {lines.map((line, i) =>
                  line.type === "blank" ? (
                    <div key={i} className="h-3" />
                  ) : (
                    <div key={i} className={cn("leading-6", lineColor[line.type])}>
                      <span className="select-none text-white/30">{linePrefix[line.type]}</span>
                      {line.text}
                    </div>
                  ),
                )}
                {/* Blinking cursor */}
                <div className="flex items-center gap-1 text-white/30">
                  <span>$</span>
                  <span className="inline-block h-4 w-2 animate-pulse bg-white/50" />
                </div>
              </div>
            </div>

            {/* Aside */}
            {aside ? (
              <div className="flex w-full flex-col gap-6 lg:w-72 lg:shrink-0">
                <h3 className="text-xl font-semibold tracking-tight">{aside.heading}</h3>
                <ul className="flex flex-col gap-3">
                  {aside.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  },
);

LandingProductTerminalDemo.displayName = "LandingProductTerminalDemo";
