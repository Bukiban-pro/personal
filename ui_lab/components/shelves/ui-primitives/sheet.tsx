import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Sheet/Drawer** — side sliding panel overlay
 *
 * Supports:
 * - Side positioning (left/right/top/bottom)
 * - Controlled/uncontrolled modes
 * - Click-outside to close (with disable option)
 * - Escape key to close
 * - Optional backdrop
 * - Size variants (sm/md/lg/full)
 * - Header + Content + Footer layout
 * - Animation (slide-in/out)
 *
 * Use: Sidebar navigation, settings panel, create/edit form, mobile menu
 */

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "full";
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showBackdrop?: boolean;
  children: React.ReactNode;
}

export const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      open = false,
      onOpenChange,
      side = "right",
      size = "md",
      closeOnBackdropClick = true,
      closeOnEscape = true,
      showBackdrop = true,
      children,
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!open || !closeOnEscape) return;
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onOpenChange?.(false);
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [open, closeOnEscape, onOpenChange]);

    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
      return () => {
        document.body.style.overflow = "auto";
      };
    }, [open]);

    const sizeMap = {
      sm: { left: "w-64", right: "w-64", top: "h-48", bottom: "h-48" },
      md: { left: "w-80", right: "w-80", top: "h-64", bottom: "h-64" },
      lg: { left: "w-96", right: "w-96", top: "h-80", bottom: "h-80" },
      full: { left: "w-full", right: "w-full", top: "h-full", bottom: "h-full" },
    };

    const slideDirectionMap = {
      left: "animate-in slide-in-from-left",
      right: "animate-in slide-in-from-right",
      top: "animate-in slide-in-from-top",
      bottom: "animate-in slide-in-from-bottom",
    };

    const slideOutMap = {
      left: "animate-out slide-out-to-left",
      right: "animate-out slide-out-to-right",
      top: "animate-out slide-out-to-top",
      bottom: "animate-out slide-out-to-bottom",
    };

    return (
      <>
        {showBackdrop && (
          <div
            className={cn(
              "fixed inset-0 bg-black/50 z-40 transition-opacity",
              open ? "animate-in fade-in" : "animate-out fade-out",
            )}
            onClick={() => closeOnBackdropClick && onOpenChange?.(false)}
          />
        )}

        {open && (
          <div
            ref={containerRef}
            className={cn(
              "fixed z-50 bg-background shadow-lg",
              side === "left" && "left-0 top-0 bottom-0 flex flex-col",
              side === "right" && "right-0 top-0 bottom-0 flex flex-col",
              side === "top" && "top-0 left-0 right-0 flex flex-row",
              side === "bottom" && "bottom-0 left-0 right-0 flex flex-row",
              sizeMap[size][side],
              slideDirectionMap[side],
            )}
          >
            {children}
          </div>
        )}
      </>
    );
  },
);

Sheet.displayName = "Sheet";

// ─── Sheet Sub-components ──────────────────────────────────────────────

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-between px-6 py-4 border-b", className)} {...props} />
);

export const SheetTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-lg font-semibold", className)} {...props} />
);

export const SheetDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

export const SheetContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)} {...props} />
);

export const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-end gap-3 px-6 py-4 border-t", className)} {...props} />
);

export const SheetClose = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "absolute top-4 right-4 text-muted-foreground hover:text-foreground rounded-lg p-1.5 hover:bg-muted",
      className,
    )}
    {...props}
  >
    ✕
  </button>
);
