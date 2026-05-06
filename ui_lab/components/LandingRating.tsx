import { cn } from "@/lib/utils";
import { StarIcon, StarHalfIcon } from "lucide-react";

/**
 * Star rating display — configurable count and visual size.
 *
 * Shows full/empty stars by default. Pass `rating` as a float to display half-stars.
 * Example: `rating={4.5}` shows 4 full stars + 1 half star + empty remainder.
 */
export const LandingRating = ({
  className,
  rating = 5,
  maxRating = 5,
  size = "medium",
}: {
  className?: string;
  rating?: number;
  maxRating?: number;
  size?: "small" | "medium" | "large";
}) => {
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      aria-description={`Rating: ${rating} out of ${maxRating}`}
    >
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < Math.floor(rating);
        const isHalf =
          rating % 1 !== 0 &&
          index === Math.floor(rating) &&
          index + 1 === Math.ceil(rating);

        return (
          <div
            key={index}
            className={cn(
              size === "small" ? "h-3 w-3" : "",
              size === "medium" ? "h-4 w-4" : "",
              size === "large" ? "h-5 w-5" : "",
            )}
          >
            {isHalf ? (
              <div className="relative">
                <StarIcon
                  className="absolute top-0 left-0 w-full h-full text-gray-300 fill-gray-300"
                  aria-hidden="true"
                />
                <StarHalfIcon
                  className="relative z-10 w-full h-full text-yellow-400 fill-yellow-400"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <StarIcon
                className={cn(
                  "w-full h-full",
                  isFilled
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-gray-300",
                )}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
