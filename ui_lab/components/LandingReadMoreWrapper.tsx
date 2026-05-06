import { cn } from "@/lib/utils";

/**
 * Read-more / show-more wrapper — expands/collapses long content.
 *
 * Pass content as children. `children` is always shown.
 * `expandedContent` is hidden until expanded. Typically includes text + button in footer.
 * Simple toggle state — no animation library dependency.
 */
export const LandingReadMoreWrapper = ({
  children,
  expandedContent,
  className,
  expandButtonText = "Read more",
  collapseButtonText = "Show less",
}: {
  children: React.ReactNode;
  expandedContent: React.ReactNode;
  className?: string;
  expandButtonText?: string;
  collapseButtonText?: string;
}) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {children}
      {expanded && expandedContent}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-primary hover:underline text-sm font-medium"
      >
        {expanded ? collapseButtonText : expandButtonText}
      </button>
    </div>
  );
};

import * as React from "react";
