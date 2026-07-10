import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * LandingProductDashboardPreview
 * Simplified inline dashboard preview — shows a mini pipeline board/metrics UI
 * right in the landing page without requiring a video or screenshot.
 * Pattern: Live product preview inline section (Linear, Notion, Vercel approach).
 */

export interface DashboardDeal {
  name: string;
  company: string;
  stage: "Prospecting" | "Discovery" | "Proposal" | "Negotiation" | "Closed Won";
  value: string;
  health: "strong" | "neutral" | "risk";
  daysInStage: number;
}

export interface LandingProductDashboardPreviewProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  deals?: DashboardDeal[];
  summaryStats?: { label: string; value: string; delta?: string; up?: boolean }[];
}

const DEFAULT_DEALS: DashboardDeal[] = [
  { name: "Platform Expansion", company: "Acme Corp", stage: "Negotiation", value: "$320,000", health: "strong", daysInStage: 8 },
  { name: "Enterprise Rollout", company: "Initech", stage: "Proposal", value: "$185,000", health: "neutral", daysInStage: 22 },
  { name: "Q3 Security Bundle", company: "Umbrella Ltd", stage: "Proposal", value: "$98,000", health: "risk", daysInStage: 41 },
  { name: "Analytics Add-on", company: "Globex", stage: "Discovery", value: "$54,000", health: "strong", daysInStage: 5 },
  { name: "CS Renewal", company: "Vandelay Co", stage: "Closed Won", value: "$72,000", health: "strong", daysInStage: 0 },
];

const DEFAULT_STATS = [
  { label: "Total pipeline", value: "$2.1M", delta: "+12%", up: true },
  { label: "Forecast commit", value: "$840K", delta: "+6%", up: true },
  { label: "Win rate", value: "38%", delta: "+4pp", up: true },
  { label: "Avg deal cycle", value: "47d", delta: "-8d", up: true },
];

const healthDot: Record<DashboardDeal["health"], string> = {
  strong: "bg-emerald-500",
  neutral: "bg-amber-400",
  risk: "bg-rose-500",
};

const stageColor: Record<DashboardDeal["stage"], string> = {
  Prospecting: "bg-zinc-500/20 text-zinc-400",
  Discovery: "bg-blue-500/20 text-blue-400",
  Proposal: "bg-violet-500/20 text-violet-400",
  Negotiation: "bg-amber-500/20 text-amber-400",
  "Closed Won": "bg-emerald-500/20 text-emerald-400",
};

export const LandingProductDashboardPreview = React.forwardRef<HTMLElement, LandingProductDashboardPreviewProps>(
  (
    {
      className,
      title = "A pipeline that actually reflects reality",
      description = "Every deal updated automatically. No manual syncing. Always accurate.",
      deals = DEFAULT_DEALS,
      summaryStats = DEFAULT_STATS,
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

          {/* Dashboard chrome */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10">
            {/* Window bar */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-4 text-xs font-medium text-muted-foreground">Pipeline — Q3 Forecast</span>
            </div>

            {/* Summary stats row */}
            <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
              {summaryStats.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5 bg-card px-5 py-4">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="text-xl font-bold tabular-nums tracking-tight">{s.value}</span>
                  {s.delta ? (
                    <span className={cn("text-xs font-medium", s.up ? "text-emerald-500" : "text-rose-500")}>
                      {s.up ? "↑" : "↓"} {s.delta}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Deal table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left">
                    <th className="px-5 py-2.5 text-xs font-medium text-muted-foreground">Deal</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-muted-foreground">Stage</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-muted-foreground">Value</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-muted-foreground">Health</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-muted-foreground">Days in stage</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr key={deal.name} className="border-b border-border/60 last:border-b-0 hover:bg-muted/20">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-foreground">{deal.name}</div>
                        <div className="text-xs text-muted-foreground">{deal.company}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", stageColor[deal.stage])}>
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-medium tabular-nums">{deal.value}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={cn("h-2 w-2 rounded-full", healthDot[deal.health])} />
                          <span className="capitalize text-muted-foreground">{deal.health}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 tabular-nums text-muted-foreground">
                        {deal.daysInStage > 0 ? `${deal.daysInStage}d` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductDashboardPreview.displayName = "LandingProductDashboardPreview";
