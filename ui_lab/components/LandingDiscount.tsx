import { cn } from "@/lib/utils";
import { Gift } from "lucide-react";

/**
 * Discount badge — typically placed under CTA buttons to highlight an offer.
 *
 * Shows a gift icon, bold discount value, and optional description text.
 * `animated`: Pulsing icon animation (default: true).
 */
export const LandingDiscount = ({
  className,
  discountValueText = "$200 off",
  discountDescriptionText = "",
  animated = true,
}: {
  className?: string;
  discountValueText: string;
  discountDescriptionText?: string;
  animated?: boolean;
}) => {
  return (
    <p className={cn("flex flex-wrap gap-1 items-center text-sm", className)}>
      <span className="text-green-500 flex gap-1 items-center flex-shrink-0">
        <Gift
          className={cn(
            "w-5 h-5 relative -top-0.5",
            animated ? "animate-pulse" : "",
          )}
        />{" "}
        <span className="font-bold">{discountValueText}</span>
      </span>{" "}
      {discountDescriptionText}
    </p>
  );
};
