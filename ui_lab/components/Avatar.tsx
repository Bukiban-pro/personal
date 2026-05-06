import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Avatar Component** — user profile picture with fallback
 *
 * Supports:
 * - Image fallback (initials)
 * - Multiple sizes
 * - Status indicator (online/offline/busy)
 * - Avatar stacks (multiple users)
 * - Loading skeleton
 * - Rounded/circle/square shapes
 *
 * Use: User profiles, team members, comments, chat
 */

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "rounded" | "square";
  status?: "online" | "offline" | "busy" | "away";
  loading?: boolean;
  fallback?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = "md",
      shape = "circle",
      status,
      loading = false,
      fallback,
      className,
      ...props
    },
    ref,
  ) => {
    const [imageError, setImageError] = React.useState(false);

    const sizeMap = {
      xs: "h-6 w-6 text-xs",
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
    };

    const shapeMap = {
      circle: "rounded-full",
      rounded: "rounded-lg",
      square: "rounded-none",
    };

    const getInitials = () => {
      if (!name) return "?";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const statusColorMap = {
      online: "bg-green-500",
      offline: "bg-gray-400",
      busy: "bg-red-500",
      away: "bg-yellow-500",
    };

    return (
      <div className="relative inline-block">
        {loading ? (
          <div
            className={cn(
              "bg-muted animate-pulse",
              sizeMap[size],
              shapeMap[shape],
            )}
          />
        ) : src && !imageError ? (
          <img
            ref={ref}
            src={src}
            alt={alt || name || "Avatar"}
            onError={() => setImageError(true)}
            className={cn(
              "object-cover bg-muted",
              sizeMap[size],
              shapeMap[shape],
              className,
            )}
            {...props}
          />
        ) : (
          <div
            className={cn(
              "flex items-center justify-center font-semibold bg-primary text-primary-foreground",
              sizeMap[size],
              shapeMap[shape],
            )}
          >
            {fallback || getInitials()}
          </div>
        )}

        {status && (
          <div
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-2 border-background",
              statusColorMap[status],
              {
                "h-2 w-2": size === "xs" || size === "sm",
                "h-2.5 w-2.5": size === "md",
                "h-3 w-3": size === "lg" || size === "xl",
              },
            )}
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

// ─── Avatar Group (multiple avatars stacked) ──────────────────────────────

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: Array<{
    src?: string;
    name?: string;
    status?: "online" | "offline" | "busy";
  }>;
  size?: "xs" | "sm" | "md" | "lg";
  maxVisible?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = "md",
  maxVisible = 3,
  className,
  ...props
}) => {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const hiddenCount = avatars.length - visibleAvatars.length;

  return (
    <div
      className={cn("flex items-center -space-x-2", className)}
      {...props}
    >
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          size={size}
          status={avatar.status}
          className="border-2 border-background"
        />
      ))}
      {hiddenCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center font-semibold bg-muted text-foreground border-2 border-background",
            {
              "h-6 w-6 text-xs": size === "xs" || size === "sm",
              "h-10 w-10 text-sm": size === "md",
              "h-12 w-12 text-base": size === "lg",
            },
            "rounded-full",
          )}
        >
          +{hiddenCount}
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = "AvatarGroup";
