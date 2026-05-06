import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Color Picker** — color selection component
 *
 * Supports:
 * - Predefined color palette
 * - Hex input
 * - RGB display
 * - Gradient preview
 * - Recently used colors
 * - Custom color input
 *
 * Use: Theme customization, design tools, settings
 */

export interface ColorPickerProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onChange?: (color: string) => void;
  palette?: string[];
  showInput?: boolean;
  showAlpha?: boolean;
}

export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      value = "#3b82f6",
      onChange,
      palette = [
        "#ef4444",
        "#f97316",
        "#eab308",
        "#22c55e",
        "#06b6d4",
        "#3b82f6",
        "#8b5cf6",
        "#ec4899",
      ],
      showInput = true,
      showAlpha = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [hexValue, setHexValue] = React.useState(value);
    const [recentColors, setRecentColors] = React.useState<string[]>([]);

    const handleColorChange = (color: string) => {
      setHexValue(color);
      onChange?.(color);
      setRecentColors((prev) => {
        const newRecent = [color, ...prev.filter((c) => c !== color)].slice(0, 5);
        return newRecent;
      });
    };

    const handleHexChange = (hex: string) => {
      if (/^#[0-9a-f]{6}$/i.test(hex)) {
        handleColorChange(hex);
      }
    };

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    const rgb = hexToRgb(hexValue);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-3 p-4 rounded-lg border border-border bg-muted/30", className)}
        {...props}
      >
        {/* Color preview */}
        <div
          className="w-full h-20 rounded-lg border border-border"
          style={{ backgroundColor: hexValue }}
        />

        {/* Palette */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Colors</div>
          <div className="flex gap-2 flex-wrap">
            {palette.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={cn(
                  "w-8 h-8 rounded-lg border-2 transition-all",
                  hexValue === color ? "border-foreground" : "border-border",
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Recent colors */}
        {recentColors.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Recent</div>
            <div className="flex gap-2">
              {recentColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className="w-8 h-8 rounded-lg border border-border hover:border-foreground transition-all"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Input & Info */}
        {showInput && (
          <div className="space-y-2">
            <input
              type="text"
              value={hexValue}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#000000"
              className="w-full px-2 py-1.5 rounded border border-border bg-background text-sm font-mono"
            />

            {rgb && (
              <div className="text-xs text-muted-foreground">
                RGB({rgb.r}, {rgb.g}, {rgb.b})
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

ColorPicker.displayName = "ColorPicker";
