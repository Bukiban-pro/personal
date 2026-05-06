import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Badge System** — tags, labels, and badges with variants
 *
 * Supports:
 * - Multiple shapes: rounded/pill/square
 * - Color variants: default/primary/secondary/success/warning/error
 * - Sizes: xs/sm/md/lg
 * - Icon + text
 * - Removable/dismissible
 * - Animated entrance
 *
 * Use: Tags, labels, status indicators, filter chips
 */

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  shape?: "rounded" | "pill" | "square";
  icon?: React.ReactNode;
  onRemove?: () => void;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      shape = "rounded",
      icon,
      onRemove,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const variantMap = {
      default: "bg-muted text-foreground",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      success: "bg-green-500/10 text-green-700 dark:text-green-400",
      warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      error: "bg-red-500/10 text-red-700 dark:text-red-400",
      outline: "border border-border text-foreground",
    };

    const sizeMap = {
      xs: "px-1.5 py-0.5 text-xs gap-1",
      sm: "px-2 py-1 text-xs gap-1",
      md: "px-2.5 py-1 text-sm gap-1.5",
      lg: "px-3 py-1.5 text-base gap-2",
    };

    const shapeMap = {
      rounded: "rounded",
      pill: "rounded-full",
      square: "rounded-none",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium",
          variantMap[variant],
          sizeMap[size],
          shapeMap[shape],
          "animate-in fade-in slide-in-from-top-1",
          className,
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 hover:opacity-70 flex-shrink-0"
            aria-label="Remove"
          >
            ✕
          </button>
        )}
      </div>
    );
  },
);

Badge.displayName = "Badge";

// ─── Badge Group (multiple badges together) ──────────────────────────────

export interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  badges: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    variant?: BadgeProps["variant"];
  }>;
  onRemove?: (id: string) => void;
  maxVisible?: number;
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({
  badges,
  onRemove,
  maxVisible,
  className,
  ...props
}) => {
  const visibleBadges = maxVisible ? badges.slice(0, maxVisible) : badges;
  const hiddenCount = badges.length - (visibleBadges.length || 0);

  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {visibleBadges.map((badge) => (
        <Badge
          key={badge.id}
          variant={badge.variant}
          icon={badge.icon}
          onRemove={() => onRemove?.(badge.id)}
        >
          {badge.label}
        </Badge>
      ))}
      {hiddenCount > 0 && (
        <Badge variant="outline">+{hiddenCount} more</Badge>
      )}
    </div>
  );
};

BadgeGroup.displayName = "BadgeGroup";
