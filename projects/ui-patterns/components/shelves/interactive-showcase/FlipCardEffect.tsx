import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Flip Card** — 3D flip animation on hover/click
 *
 * Supports:
 * - Hover-triggered flip
 * - Front/back content
 * - Smooth 3D perspective
 * - Click to toggle
 *
 * Use: Portfolio, product showcase, interactive cards
 */

export interface FlipCardEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  front: React.ReactNode;
  back: React.ReactNode;
  trigger?: "hover" | "click";
}

export const FlipCardEffect = React.forwardRef<HTMLDivElement, FlipCardEffectProps>(
  (
    {
      front,
      back,
      trigger = "hover",
      className,
      ...props
    },
    ref,
  ) => {
    const [isFlipped, setIsFlipped] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn("h-64 w-full cursor-pointer perspective", className)}
        onMouseEnter={() => trigger === "hover" && setIsFlipped(true)}
        onMouseLeave={() => trigger === "hover" && setIsFlipped(false)}
        onClick={() => trigger === "click" && setIsFlipped(!isFlipped)}
        {...props}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 flex items-center justify-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            {front}
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg p-6 flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {back}
          </div>
        </div>
      </div>
    );
  },
);

FlipCardEffect.displayName = "FlipCardEffect";
