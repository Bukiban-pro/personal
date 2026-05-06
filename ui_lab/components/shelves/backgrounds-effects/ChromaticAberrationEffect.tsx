import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Chromatic Aberration Effect** — RGB channel separation visual effect
 *
 * Supports:
 * - Channel offset control
 * - Hover/motion triggered
 * - Blur + distortion combination
 * - Customizable intensity
 *
 * Use: Glitch effects, modern design, visual impacts
 */

export interface ChromaticAberrationProps extends React.HTMLAttributes<HTMLDivElement> {
  offset?: number;
  trigger?: "hover" | "continuous";
  children: React.ReactNode;
}

export const ChromaticAberration = React.forwardRef<HTMLDivElement, ChromaticAberrationProps>(
  (
    {
      offset = 4,
      trigger = "hover",
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [isActive, setIsActive] = React.useState(trigger === "continuous");

    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          trigger === "hover" && "group",
          className,
        )}
        onMouseEnter={() => trigger === "hover" && setIsActive(true)}
        onMouseLeave={() => trigger === "hover" && setIsActive(false)}
        {...props}
      >
        <div
          className="relative overflow-hidden"
          style={{
            opacity: isActive ? 1 : 1,
            filter: isActive ? "none" : "none",
          }}
        >
          {/* Red channel */}
          <div
            className="absolute inset-0"
            style={{
              color: "red",
              opacity: 0.3,
              mixBlendMode: "screen",
              transform: isActive ? `translate(${offset}px, 0)` : "translate(0, 0)",
              transition: "transform 0.1s ease-out",
            }}
          >
            {children}
          </div>

          {/* Green channel */}
          <div
            className="absolute inset-0"
            style={{
              color: "green",
              opacity: 0.3,
              mixBlendMode: "screen",
              transform: isActive ? `translate(${-offset / 2}px, ${offset / 2}px)` : "translate(0, 0)",
              transition: "transform 0.1s ease-out",
            }}
          >
            {children}
          </div>

          {/* Blue channel */}
          <div
            className="absolute inset-0"
            style={{
              color: "blue",
              opacity: 0.3,
              mixBlendMode: "screen",
              transform: isActive ? `translate(${-offset}px, 0)` : "translate(0, 0)",
              transition: "transform 0.1s ease-out",
            }}
          >
            {children}
          </div>

          {/* Normal render */}
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    );
  },
);

ChromaticAberration.displayName = "ChromaticAberration";
