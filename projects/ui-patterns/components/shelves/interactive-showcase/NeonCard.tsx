import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Glowing Neon Card** — card with glowing neon border effect
 *
 * Supports:
 * - Animated neon glow
 * - Multiple color themes
 * - Inner shadow effect
 * - Hover intensity increase
 *
 * Use: Premium card layouts, cyberpunk aesthetics, featured content
 */

export interface NeonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "error";
}

export const NeonCard = React.forwardRef<HTMLDivElement, NeonCardProps>(
  (
    {
      glowColor = "#00ff88",
      children,
      variant = "primary",
      className,
      ...props
    },
    ref,
  ) => {
    const colorMap = {
      primary: "#00ccff",
      success: "#00ff88",
      warning: "#ffaa00",
      error: "#ff0055",
    };

    const selectedColor = colorMap[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "relative p-6 rounded-lg border bg-background/50 backdrop-blur-sm",
          "overflow-hidden group",
          className,
        )}
        style={{
          borderColor: selectedColor,
          boxShadow: `0 0 10px ${selectedColor}80, inset 0 0 10px ${selectedColor}20`,
        }}
        {...props}
      >
        {/* Animated glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${selectedColor}20 0%, transparent 70%)`,
            animation: "pulse 2s ease-in-out infinite",
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  },
);

NeonCard.displayName = "NeonCard";
