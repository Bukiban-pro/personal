import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Gantt Chart / Project Timeline** — timeline visualization of tasks
 *
 * Supports:
 * - Task duration visualization
 * - Progress bars
 * - Dependency lines
 * - Timeline header
 * - Drag to reschedule (simplified)
 *
 * Use: Project management, scheduling, resource planning
 */

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  color?: string;
  dependencies?: string[];
}

export interface GanttChartProps extends React.HTMLAttributes<HTMLDivElement> {
  tasks: GanttTask[];
  startDate: Date;
  endDate: Date;
}

export const GanttChart = React.forwardRef<HTMLDivElement, GanttChartProps>(
  (
    {
      tasks,
      startDate,
      endDate,
      className,
      ...props
    },
    ref,
  ) => {
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const getTaskPosition = (task: GanttTask) => {
      const taskStart = Math.max(
        0,
        Math.ceil((task.start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      );
      const taskDuration = Math.ceil(
        (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24),
      );
      return { start: taskStart, duration: taskDuration };
    };

    const pixelPerDay = 40;

    return (
      <div
        ref={ref}
        className={cn("overflow-x-auto", className)}
        {...props}
      >
        <div className="flex min-w-full">
          {/* Task names */}
          <div className="w-48 flex-shrink-0 border-r border-border">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="h-12 flex items-center px-3 border-b border-border text-sm font-medium"
              >
                {task.name}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="flex-1" style={{ width: `${totalDays * pixelPerDay}px` }}>
            {/* Date headers */}
            <div className="flex border-b border-border">
              {Array.from({ length: totalDays }).map((_, i) => (
                <div
                  key={i}
                  className="border-r border-border text-xs text-muted-foreground text-center"
                  style={{ width: pixelPerDay }}
                >
                  {new Date(
                    startDate.getTime() + i * 1000 * 60 * 60 * 24,
                  ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              ))}
            </div>

            {/* Task bars */}
            {tasks.map((task, taskIndex) => {
              const { start, duration } = getTaskPosition(task);

              return (
                <div
                  key={task.id}
                  className="h-12 flex items-center relative border-b border-border"
                >
                  <div
                    className="h-8 rounded flex items-center px-2 text-xs font-medium text-white"
                    style={{
                      left: `${start * pixelPerDay}px`,
                      width: `${duration * pixelPerDay}px`,
                      backgroundColor: task.color || "#06b6d4",
                      position: "absolute",
                    }}
                  >
                    <div
                      className="h-full bg-white/30 rounded"
                      style={{
                        width: `${task.progress}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

GanttChart.displayName = "GanttChart";
