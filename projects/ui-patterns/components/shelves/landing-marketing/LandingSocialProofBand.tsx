import { cn } from "@/lib/utils";

/**
 * Horizontal band of social proof items — avatars, feature callouts, star ratings.
 *
 * Typically placed just below the primary hero CTA or above the fold.
 * Children are `LandingSocialProofBandItem` components (or any JSX).
 * Set `invert` to flip foreground/background colours.
 */
export const LandingSocialProofBand = ({
  className,
  invert,
  children,
  variant = "default",
}: {
  className?: string;
  invert?: boolean;
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary";
}) => (
  <div
    className={cn(
      "w-full py-2",
      !invert && variant === "primary" ? "bg-primary/10 dark:bg-primary/30" : "",
      !invert && variant === "secondary" ? "bg-secondary/10 dark:bg-secondary/30" : "",
      !invert && variant === "default" ? "bg-slate-200 dark:bg-slate-900" : "",
      invert && variant === "primary" ? "bg-primary/90 dark:bg-primary/10" : "",
      invert && variant === "secondary" ? "bg-secondary/90 dark:bg-secondary/10" : "",
      invert && variant === "default" ? "bg-slate-700 dark:bg-slate-300" : "",
      className,
    )}
  >
    <div
      className={cn(
        "w-full max-w-7xl mx-auto flex items-center md:justify-center gap-8 px-8 overflow-auto",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        invert
          ? "text-slate-200 dark:text-slate-600"
          : "text-slate-700 dark:text-slate-200",
      )}
    >
      {children}
    </div>
  </div>
);

// ─── LandingSocialProofBandItem ────────────────────────────────────────────

/**
 * A single item inside `LandingSocialProofBand` — icon + text callout.
 *
 * Pass `graphicElement` (icon/emoji/img) and a short descriptive string.
 */
export const LandingSocialProofBandItem = ({
  children,
  className,
  graphicElement,
}: {
  children: React.ReactNode;
  className?: string;
  /** Icon, emoji, or image displayed before the text. */
  graphicElement?: React.ReactNode;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 shrink-0 text-sm font-medium",
      className,
    )}
  >
    {graphicElement && <span aria-hidden="true">{graphicElement}</span>}
    <span>{children}</span>
  </div>
);
