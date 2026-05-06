import { cn } from "@/lib/utils";

/**
 * Single feature card — icon + title + description.
 *
 * Used within a feature grid or list to highlight key product aspects.
 * `icon`: Required — pass any React icon or component (e.g., `<CheckIcon />`)
 * Variant-aware background and border styling (primary/secondary).
 */
export const LandingFeature = ({
  className,
  title,
  description,
  titleComponent,
  descriptionComponent,
  icon,
  variant = "primary",
}: {
  className?: string;
  title?: string;
  description?: string;
  titleComponent?: React.ReactNode;
  descriptionComponent?: React.ReactNode;
  icon: React.ReactNode;
  variant?: "primary" | "secondary";
}) => {
  return (
    <div className={cn("flex flex-col gap-4 py-4", className)}>
      <div
        className={cn(
          "flex items-center justify-center w-16 h-16 rounded-md",
          variant === "primary"
            ? "bg-primary/30 border border-primary/70 dark:border-primary/40 dark:bg-primary/20 text-primary"
            : "bg-secondary/30 border border-secondary/70 dark:border-secondary/40 dark:bg-secondary/20 text-secondary",
        )}
        aria-describedby="icon"
      >
        {icon}
      </div>

      {titleComponent || (title && (
        <h3 className="text-lg font-semibold">{title}</h3>
      ))}

      {descriptionComponent || (description && (
        <p className="text-sm text-gray-800 dark:text-gray-200">
          {description}
        </p>
      ))}
    </div>
  );
};
