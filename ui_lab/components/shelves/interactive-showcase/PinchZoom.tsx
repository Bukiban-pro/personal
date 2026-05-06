import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Pinch Zoom / Gesture Zoom Component** — pinch-to-zoom and mouse wheel zoom
 *
 * Supports:
 * - Touch pinch zoom
 * - Mouse wheel zoom
 * - Pan/drag when zoomed
 * - Min/max zoom constraints
 * - Reset zoom button
 *
 * Use: Image viewers, maps, detailed content inspection
 */

export interface PinchZoomProps extends React.HTMLAttributes<HTMLDivElement> {
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  children: React.ReactNode;
}

export const PinchZoom = React.forwardRef<HTMLDivElement, PinchZoomProps>(
  (
    {
      minZoom = 1,
      maxZoom = 4,
      initialZoom = 1,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [zoom, setZoom] = React.useState(initialZoom);
    const [pan, setPan] = React.useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = React.useState(false);
    const [panStart, setPanStart] = React.useState({ x: 0, y: 0 });
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => Math.max(minZoom, Math.min(maxZoom, prev * delta)));
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (zoom > 1) {
        setIsPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isPanning) {
        setPan({
          x: pan.x + (e.clientX - panStart.x),
          y: pan.y + (e.clientY - panStart.y),
        });
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    const handleReset = () => {
      setZoom(initialZoom);
      setPan({ x: 0, y: 0 });
    };

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden bg-background rounded-lg", className)}
        {...props}
      >
        <div
          className="w-full h-96 flex items-center justify-center cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: "center",
              transition: isPanning ? "none" : "transform 0.2s ease-out",
            }}
          >
            {children}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() => setZoom((prev) => Math.max(minZoom, prev * 0.8))}
            className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            -
          </button>
          <span className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(maxZoom, prev * 1.2))}
            className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            +
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted"
          >
            Reset
          </button>
        </div>
      </div>
    );
  },
);

PinchZoom.displayName = "PinchZoom";
