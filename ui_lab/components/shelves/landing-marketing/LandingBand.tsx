import { cn } from "@/lib/utils";

/**
 * Full-width brand-colored band — breaks page flow to highlight a key
 * selling point, tech stack logos, or important announcement.
 *
 * Place it between sections. Pass logos / icons as `supportingComponent`.
 */
export const LandingBandSection = ({
  children,
  className,
  title,
  titleComponent,
  description,
  descriptionComponent,
  supportingComponent,
  withBackground = true,
  variant = "primary",
}: {
  children?: React.ReactNode;
  className?: string;
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  /** Icons, logos, or anything that goes in the right-side flex container. */
  supportingComponent?: React.ReactNode;
  withBackground?: boolean;
  variant?: "primary" | "secondary";
}) => (
  <section
    className={cn(
      "w-full flex items-center justify-center p-2 md:p-6 gap-6",
      withBackground && variant === "primary"
        ? "bg-primary/10 dark:bg-primary/60 text-primary-foreground"
        : "",
      withBackground && variant === "secondary"
        ? "bg-secondary/10 dark:bg-secondary/60 text-secondary-foreground"
        : "",
      className,
    )}
  >
    <div className="w-full p-6 max-w-7xl gap-6 items-center lg:flex lg:flex-row">
      <div
        className={cn(
          "w-full lg:w-auto flex flex-col flex-shrink-0 max-w-lg xl:max-w-3xl",
          withBackground ? "text-inherit" : "",
        )}
      >
        {titleComponent ||
          (title && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              {title}
            </h2>
          ))}

        {descriptionComponent ||
          (description && <p className="text-lg mt-2">{description}</p>)}

        {children}
      </div>

      {supportingComponent && (
        <div
          className={cn(
            "flex gap-8 lg:gap-12 ml-auto mt-12 lg:mt-0 lg:max-w-lg xl:max-w-none flex-shrink flex-wrap",
            withBackground ? "text-inherit" : "",
          )}
        >
          {supportingComponent}
        </div>
      )}
    </div>
  </section>
);
