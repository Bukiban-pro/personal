import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Border Beam Animation** — animated gradient beam around border
 *
 * Supports:
 * - Rotating border gradient
 * - Customizable colors
 * - Speed control
 * - Corner highlighting
 *
 * Use: Premium cards, featured elements, visual emphasis
 */

export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  speed?: number;
  children: React.ReactNode;
}

export const BorderBeam = React.forwardRef<HTMLDivElement, BorderBeamProps>(
  (
    {
      color = "#06b6d4",
      speed = 5,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        <div
          className="absolute inset-0 rounded-lg p-[2px] overflow-hidden"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${color} 90deg, transparent 180deg)`,
            animation: `spin-slow ${speed}s linear infinite`,
          }}
        >
          <div className="absolute inset-[2px] bg-background rounded-lg" />
        </div>

        <div className="relative z-10">{children}</div>

        <style>{`
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  },
);

BorderBeam.displayName = "BorderBeam";
