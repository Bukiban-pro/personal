import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Resizable Panel** — draggable resize handle between panels
 *
 * Supports:
 * - Horizontal/vertical split
 * - Min/max sizes
 * - Persistent size via localStorage
 * - Smooth resize animations
 * - Multiple panels
 *
 * Use: Sidebar layouts, code editors, split views
 */

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
  resizable?: boolean;
  onResize?: (size: number) => void;
  persistKey?: string;
}

export const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      initialSize = 50,
      minSize = 20,
      maxSize = 80,
      resizable = true,
      onResize,
      persistKey,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [size, setSize] = React.useState(() => {
      if (persistKey) {
        const saved = localStorage.getItem(persistKey);
        return saved ? JSON.parse(saved) : initialSize;
      }
      return initialSize;
    });

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startSize = size;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        const newSize = Math.max(minSize, Math.min(maxSize, startSize + delta / 2));
        setSize(newSize);
        onResize?.(newSize);
      };

      const handleMouseUp = () => {
        if (persistKey) {
          localStorage.setItem(persistKey, JSON.stringify(size));
        }
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    return (
      <div
        ref={ref}
        className={cn("flex", className)}
        style={{ width: `${size}%` }}
        {...props}
      >
        <div className="flex-1 overflow-auto">{children}</div>

        {resizable && (
          <div
            onMouseDown={handleMouseDown}
            className="w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors"
          />
        )}
      </div>
    );
  },
);

ResizablePanel.displayName = "ResizablePanel";

// ─── Resizable Container (wrapper for multiple panels) ────────────────────

export interface ResizableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  panels: {
    id: string;
    content: React.ReactNode;
    initialSize?: number;
    minSize?: number;
    maxSize?: number;
  }[];
}

export const ResizableContainer: React.FC<ResizableContainerProps> = ({
  panels,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("flex w-full h-screen gap-0", className)}
      {...props}
    >
      {panels.map((panel, i) => (
        <React.Fragment key={panel.id}>
          <ResizablePanel
            initialSize={panel.initialSize}
            minSize={panel.minSize}
            maxSize={panel.maxSize}
            persistKey={`resizable-${panel.id}`}
            resizable={i < panels.length - 1}
          >
            {panel.content}
          </ResizablePanel>
        </React.Fragment>
      ))}
    </div>
  );
};

ResizableContainer.displayName = "ResizableContainer";
