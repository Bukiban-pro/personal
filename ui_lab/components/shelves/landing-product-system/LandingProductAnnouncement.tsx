import { cn } from "@/lib/utils";
import * as React from "react";

export interface LandingProductAnnouncementProps extends React.HTMLAttributes<HTMLElement> {
  badge?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const LandingProductAnnouncement = React.forwardRef<HTMLElement, LandingProductAnnouncementProps>(
  ({ className, badge = "New", title, description, action, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full py-6", className)} {...props}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="inline-flex w-fit rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {badge}
            </div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
            {description ? <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </section>
    );
  },
);

LandingProductAnnouncement.displayName = "LandingProductAnnouncement";
