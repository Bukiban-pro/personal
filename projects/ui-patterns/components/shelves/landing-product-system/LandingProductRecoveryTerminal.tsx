import { cn } from "@/lib/utils";
import * as React from "react";

export interface RecoveryTerminalSession {
  title: string;
  incident?: string;
  checks?: string[];
  repair?: string;
  release?: string;
}

export interface LandingProductRecoveryTerminalProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  sessions: RecoveryTerminalSession[];
}

export const LandingProductRecoveryTerminal = React.forwardRef<HTMLElement, LandingProductRecoveryTerminalProps>(
  ({ className, title = "Run recovery work as a terminal session with visible checks and release", description, sessions, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeSession = sessions.length > 0 ? sessions[Math.min(activeIndex, sessions.length - 1)] : null;

    return (
      <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <div className="space-y-3">
              {sessions.map((session, index) => {
                const isActive = index === Math.min(activeIndex, Math.max(sessions.length - 1, 0));

                return (
                  <button
                    key={session.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full rounded-2xl border p-5 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="text-base font-semibold tracking-tight">{session.title}</div>
                    {session.incident ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{session.incident}</p> : null}
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              {activeSession ? (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeSession.incident || "Incident"}</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{activeSession.title}</h3>
                  <div className="mt-6 grid gap-3">
                    {(activeSession.checks || []).map((check) => (
                      <div key={check} className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        {check}
                      </div>
                    ))}
                  </div>
                  {activeSession.repair ? <div className="mt-6 rounded-2xl border border-border bg-background px-5 py-4 text-sm text-muted-foreground">{activeSession.repair}</div> : null}
                  {activeSession.release ? <div className="mt-4 rounded-2xl border border-border bg-primary/5 px-5 py-4 text-sm font-medium">{activeSession.release}</div> : null}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Add sessions to populate the recovery terminal.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

LandingProductRecoveryTerminal.displayName = "LandingProductRecoveryTerminal";