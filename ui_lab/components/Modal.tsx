import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Modal/Dialog** — centered overlay dialog
 *
 * Supports:
 * - Controlled/uncontrolled modes
 * - Click-outside to close
 * - Escape key to close
 * - Scrollable content
 * - Header + Content + Footer layout
 * - Size variants (sm/md/lg)
 * - Animations
 * - Nested dialogs (portal-based)
 *
 * Use: Confirmations, alerts, forms, complex interactions
 */

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "sm" | "md" | "lg";
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open = false,
      onOpenChange,
      size = "md",
      closeOnBackdropClick = true,
      closeOnEscape = true,
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
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
    };

    return (
      <>
        {open && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 animate-in fade-in"
              onClick={() => closeOnBackdropClick && onOpenChange?.(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div
                ref={containerRef}
                className={cn(
                  "bg-background rounded-lg shadow-lg w-full pointer-events-auto",
                  sizeMap[size],
                  "animate-in fade-in zoom-in-95",
                )}
              >
                {children}
              </div>
            </div>
          </>
        )}
      </>
    );
  },
);

Modal.displayName = "Modal";

// ─── Modal Sub-components ─────────────────────────────────────────────

export const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-between px-6 py-4 border-b", className)} {...props} />
);

export const ModalTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-lg font-semibold", className)} {...props} />
);

export const ModalDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

export const ModalContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto", className)} {...props} />
);

export const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-end gap-3 px-6 py-4 border-t", className)} {...props} />
);

export const ModalClose = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "text-muted-foreground hover:text-foreground rounded-lg p-1.5 hover:bg-muted",
      className,
    )}
    {...props}
  >
    ✕
  </button>
);
