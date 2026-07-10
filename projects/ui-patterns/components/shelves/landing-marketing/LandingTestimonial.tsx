import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";

export interface TestimonialItem {
  className?: string;
  url?: string;
  text: string;
  imageSrc: string;
  name: string;
  handle: string;
  featured?: boolean;
  verified?: boolean;
  /** Only applies inside a LandingTestimonialList, not grid. */
  size?: "full" | "half" | "third";
}

/**
 * Single testimonial card — image, name, handle, verified badge, quote.
 *
 * Used standalone or composed inside `LandingTestimonialGrid` /
 * `LandingTestimonialList`. Featured testimonials render with larger bolder
 * text and a distinct bordered footer.
 */
export const LandingTestimonial = ({
  className,
  url,
  text,
  imageSrc,
  name,
  handle,
  featured,
  verified = true,
}: TestimonialItem) => {
  const missingUrl = !url || url === "#";

  return (
    <a
      href={url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "w-full inline-block bg-background rounded-2xl shadow-md ring-1 ring-foreground/5",
        featured ? "shadow-xl" : "p-6",
        missingUrl
          ? "cursor-default pointer-events-none"
          : "cursor-pointer hover:bg-muted transition-colors",
        className,
      )}
    >
      <figure>
        <blockquote
          className={cn(
            "text-foreground",
            featured
              ? "p-6 text-lg font-semibold leading-7 tracking-tight sm:text-xl sm:leading-8"
              : "",
          )}
        >
          <p className="whitespace-pre-line">{`"${text}"`}</p>
        </blockquote>

        <figcaption
          className={cn(
            "flex items-center gap-x-4",
            featured
              ? "flex-wrap gap-y-4 border-t border-foreground/10 px-6 py-4 sm:flex-nowrap"
              : "mt-6",
          )}
        >
          <img
            width={100}
            height={100}
            className="h-10 w-10 flex-none rounded-full bg-muted object-cover"
            src={imageSrc}
            alt={name}
          />
          <div className="flex-auto">
            <div className="font-semibold flex gap-0.5 items-center">
              {name}{" "}
              {verified && (
                <BadgeCheck className="flex-shrink-0 fill-blue-500 text-white w-4 h-4" />
              )}
            </div>
            <div className="text-muted-foreground text-sm">{handle}</div>
          </div>
        </figcaption>
      </figure>
    </a>
  );
};
