import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Lazy Load / Intersection Observer Wrapper** — efficient rendering of off-screen content
 *
 * Supports:
 * - Intersection observer API
 * - Custom threshold
 * - Loading placeholder
 * - Callback on intersection
 *
 * Use: Performance optimization, infinite scrolling, image galleries
 */

export interface LazyLoadProps extends React.HTMLAttributes<HTMLDivElement> {
  onIntersect?: () => void;
  threshold?: number | number[];
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  loading?: boolean;
}

export const LazyLoad = React.forwardRef<HTMLDivElement, LazyLoadProps>(
  (
    {
      onIntersect,
      threshold = 0.1,
      children,
      placeholder,
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [isIntersecting, setIsIntersecting] = React.useState(false);
    const localRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !isIntersecting) {
          setIsIntersecting(true);
          onIntersect?.();
        }
      }, { threshold });

      if (localRef.current) {
        observer.observe(localRef.current);
      }

      return () => observer.disconnect();
    }, [threshold, isIntersecting, onIntersect]);

    return (
      <div
        ref={localRef}
        className={className}
        {...props}
      >
        {isIntersecting ? children : placeholder}
      </div>
    );
  },
);

LazyLoad.displayName = "LazyLoad";
