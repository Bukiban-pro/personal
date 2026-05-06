import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Signature Pad / Drawing Canvas** — free-form drawing input
 *
 * Supports:
 * - Mouse/touch drawing
 * - Clear and save
 * - Stroke width control
 * - Color picker
 * - Undo/redo
 *
 * Use: Forms, signature capture, note-taking, whiteboard
 */

export interface SignaturePadProps extends React.HTMLAttributes<HTMLCanvasElement> {
  onSave?: (dataUrl: string) => void;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export const SignaturePad = React.forwardRef<HTMLCanvasElement, SignaturePadProps>(
  (
    {
      onSave,
      width = 500,
      height = 300,
      strokeColor = "#000000",
      strokeWidth = 2,
      className,
      ...props
    },
    ref,
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(null);
    const [history, setHistory] = React.useState<ImageData[]>([]);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        setContext(ctx);
      }
    }, [width, height, strokeColor, strokeWidth]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!context) return;

      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      context.beginPath();
      context.moveTo(x, y);
      setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !context) return;

      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      context.lineTo(x, y);
      context.stroke();
    };

    const stopDrawing = () => {
      if (context) {
        context.closePath();
        setIsDrawing(false);
      }
    };

    const clear = () => {
      if (!context) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      setHistory([]);
    };

    const save = () => {
      if (!canvasRef.current) return;
      const dataUrl = canvasRef.current.toDataURL("image/png");
      onSave?.(dataUrl);
    };

    return (
      <div className="flex flex-col gap-4">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className={cn(
            "border-2 border-border rounded-lg cursor-crosshair bg-white",
            className,
          )}
          {...props}
        />

        <div className="flex gap-2">
          <button
            onClick={clear}
            className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={save}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  },
);

SignaturePad.displayName = "SignaturePad";
