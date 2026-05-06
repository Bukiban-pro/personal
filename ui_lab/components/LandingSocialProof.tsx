import { cn } from "@/lib/utils";

export interface SocialProofItem {
  imageSrc: string;
  name: string;
}

// ─── Avatar ────────────────────────────────────────────────────────────────

export const LandingAvatar = ({
  imageSrc,
  name,
  size = "medium",
  className,
}: {
  imageSrc: string;
  name: string;
  size?: "small" | "medium" | "large";
  className?: string;
}) => (
  <img
    src={imageSrc}
    alt={name}
    title={name}
    className={cn(
      "rounded-full border-2 border-background object-cover",
      size === "small" ? "h-7 w-7" : "",
      size === "medium" ? "h-9 w-9" : "",
      size === "large" ? "h-12 w-12" : "",
      className,
    )}
    width={48}
    height={48}
  />
);

// ─── Rating ────────────────────────────────────────────────────────────────

export const LandingRating = ({ size = "medium" }: { size?: "small" | "medium" | "large" }) => (
  <div className="flex gap-0.5" aria-label="5 out of 5 stars">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={cn(
          "fill-yellow-400",
          size === "small" ? "w-3 h-3" : "",
          size === "medium" ? "w-4 h-4" : "",
          size === "large" ? "w-5 h-5" : "",
        )}
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// ─── Social Proof number formatter ─────────────────────────────────────────

export const getFormattedNumberOfUsers = (n: number) => {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  return `${n}`;
};

// ─── LandingSocialProof ────────────────────────────────────────────────────

/**
 * Compact social proof widget — overlapping avatar stack + user count + star rating.
 *
 * Place near a CTA to build trust. Pass `avatarItems` (imageSrc + name pairs).
 * `numberOfUsers` is formatted automatically (1k, 1.2M …).
 * Set `showRating` to display 5 gold stars above the count line.
 */
export const LandingSocialProof = ({
  children,
  className,
  avatarItems,
  numberOfUsers = 169,
  suffixText = "happy users",
  showRating,
  disableAnimation,
  size = "medium",
}: {
  children?: React.ReactNode;
  className?: string;
  avatarItems: SocialProofItem[];
  numberOfUsers: number;
  suffixText?: string;
  showRating?: boolean;
  disableAnimation?: boolean;
  size?: "small" | "medium" | "large";
}) => {
  const numberText = getFormattedNumberOfUsers(numberOfUsers);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <div className="group/proof flex gap-1">
        {avatarItems.map((item, i) => (
          <LandingAvatar
            key={i}
            size={size === "small" ? "medium" : size}
            imageSrc={item.imageSrc}
            name={item.name}
            className={cn(
              "relative",
              !disableAnimation
                ? "md:group-hover/proof:-ml-0.5 transition-all duration-300"
                : "",
              i === 1 || i === 2 ? "-ml-4" : "",
              i === 3 ? "-ml-5" : "",
              i > 3 ? "-ml-6" : "",
            )}
          />
        ))}

        {/* overflow count bubble */}
        <div
          className={cn(
            !disableAnimation
              ? "md:group-hover/proof:-ml-0.5 transition-all duration-300"
              : "",
            size === "small" || size === "medium" ? "h-9 w-9 text-xs" : "",
            size === "large" ? "h-12 w-12 text-xs" : "",
            "relative flex items-center justify-center rounded-full border-2 border-solid border-primary/20 -ml-5 bg-primary/10 text-foreground",
          )}
        >
          {numberText}+
        </div>
      </div>

      <div className="flex flex-col justify-center gap-1">
        {showRating && <LandingRating size={size} />}

        {!children ? (
          <p
            className={cn(
              "max-w-sm",
              size === "small" || size === "medium" ? "text-xs" : "",
              size === "large" ? "text-base" : "",
            )}
          >
            from {numberText}+ {suffixText}
          </p>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
