import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Sticky Header** — fixed header with background blur on scroll
 *
 * Supports:
 * - Blur backdrop on scroll
 * - Shadow elevation on scroll
 * - Sticky positioning
 * - Custom height/padding
 * - Dynamic background color
 *
 * Use: Page headers, navigation, sticky sections
 */

export interface StickyHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onScroll?: (isScrolled: boolean) => void;
  blur?: boolean;
  shadow?: boolean;
  height?: string;
}

export const StickyHeader = React.forwardRef<HTMLDivElement, StickyHeaderProps>(
  (
    {
      onScroll,
      blur = true,
      shadow = true,
      height = "h-16",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
      const handleScroll = () => {
        const scrolled = window.scrollY > 0;
        setIsScrolled(scrolled);
        onScroll?.(scrolled);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [onScroll]);

    return (
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-40",
          height,
          "flex items-center px-6",
          "bg-background",
          isScrolled && blur && "backdrop-blur-md bg-background/80",
          isScrolled && shadow && "shadow-sm border-b border-border/50",
          "transition-all duration-200",
          className,
        )}
        {...props}
      >
        {children}
      </header>
    );
  },
);

StickyHeader.displayName = "StickyHeader";
