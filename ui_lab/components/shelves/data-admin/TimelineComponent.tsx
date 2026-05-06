import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Timeline / History Component** — vertical/horizontal event timeline
 *
 * Supports:
 * - Vertical or horizontal layout
 * - Event cards with metadata
 * - Connector lines
 * - Status badges
 * - Filtering by date/category
 *
 * Use: Project milestones, activity history, product roadmaps
 */

export interface TimelineComponentEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  icon?: React.ReactNode;
  status?: "completed" | "in-progress" | "pending";
}

export interface TimelineComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  events: TimelineComponentEvent[];
  orientation?: "vertical" | "horizontal";
}

export const TimelineComponent = React.forwardRef<HTMLDivElement, TimelineComponentProps>(
  (
    {
      events,
      orientation = "vertical",
      className,
      ...props
    },
    ref,
  ) => {
    const statusColors = {
      completed: "bg-green-500",
      "in-progress": "bg-blue-500",
      pending: "bg-gray-400",
    };

    return (
      <div
        ref={ref}
        className={cn(
          orientation === "vertical" ? "flex flex-col" : "flex flex-row overflow-x-auto",
          className,
        )}
        {...props}
      >
        {events.map((event, index) => (
          <div
            key={event.id}
            className={cn(
              "flex",
              orientation === "vertical"
                ? "flex-row gap-4 mb-8 relative"
                : "flex-col gap-2 min-w-max px-4 relative",
            )}
          >
            {/* Timeline node */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-4 border-background flex items-center justify-center text-white text-xs",
                  statusColors[event.status || "pending"],
                )}
              >
                {event.icon || "●"}
              </div>

              {/* Connector line */}
              {index < events.length - 1 && (
                <div
                  className={cn(
                    "bg-border",
                    orientation === "vertical"
                      ? "w-1 h-16 mt-2"
                      : "h-1 w-16 ml-2",
                  )}
                />
              )}
            </div>

            {/* Event content */}
            <div className="flex-1 pt-1">
              <h4 className="font-semibold text-foreground">{event.title}</h4>
              <p className="text-xs text-muted-foreground">{event.date}</p>
              {event.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  },
);

TimelineComponent.displayName = "TimelineComponent";
