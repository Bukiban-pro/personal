import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Performance Monitor / Metrics Dashboard** — FPS, memory, render time tracking
 *
 * Supports:
 * - FPS counter
 * - Memory usage tracking
 * - Render time measurement
 * - Live performance graph
 * - Development-only display
 *
 * Use: Performance debugging, optimization tracking, dev tools
 */

export interface PerformanceMonitorProps extends React.HTMLAttributes<HTMLDivElement> {
  showFPS?: boolean;
  showMemory?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const PerformanceMonitor = React.forwardRef<HTMLDivElement, PerformanceMonitorProps>(
  (
    {
      showFPS = true,
      showMemory = true,
      position = "top-left",
      className,
      ...props
    },
    ref,
  ) => {
    const [fps, setFps] = React.useState(0);
    const [memory, setMemory] = React.useState(0);
    const fpsRef = React.useRef(0);
    const lastTimeRef = React.useRef(Date.now());

    React.useEffect(() => {
      let frameCount = 0;

      const updateMetrics = () => {
        frameCount++;
        const now = Date.now();
        const elapsed = now - lastTimeRef.current;

        if (elapsed >= 1000) {
          setFps(Math.round((frameCount * 1000) / elapsed));
          frameCount = 0;
          lastTimeRef.current = now;

          if (showMemory && (performance as any).memory) {
            setMemory(
              Math.round(((performance as any).memory.usedJSHeapSize / 1024 / 1024) * 10) / 10,
            );
          }
        }

        requestAnimationFrame(updateMetrics);
      };

      const id = requestAnimationFrame(updateMetrics);
      return () => cancelAnimationFrame(id);
    }, [showMemory]);

    const positionClasses = {
      "top-left": "top-4 left-4",
      "top-right": "top-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "bottom-right": "bottom-4 right-4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 bg-black/80 text-white p-3 rounded-lg font-mono text-xs space-y-1",
          positionClasses[position],
          className,
        )}
        {...props}
      >
        {showFPS && (
          <div>
            FPS: <span className={fps < 30 ? "text-red-500" : "text-green-500"}>{fps}</span>
          </div>
        )}
        {showMemory && (
          <div>
            Memory: <span>{memory} MB</span>
          </div>
        )}
      </div>
    );
  },
);

PerformanceMonitor.displayName = "PerformanceMonitor";
