import { cn } from "@/lib/utils";
import { CheckIcon, LucideIcon } from "lucide-react";
import { ReactElement } from "react";

export interface KeyPoint {
  title: string;
  description?: string;
}

type Child = ReactElement<any, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Vertical list of key-point rows — icon + bold title + optional description.
 *
 * Pass `keyPoints` as an array of `{ title, description? }` objects.
 * Use `icon` to swap the default check icon (e.g. `<XIcon />` for problems).
 * `descriptionStyle='inline'` places description on the same line as the title.
 */
export const LandingProductFeatureKeyPoints = ({
  className,
  iconClassName,
  keyPoints,
  variant = "primary",
  descriptionStyle = "block",
  icon,
}: {
  className?: string;
  iconClassName?: string;
  keyPoints: KeyPoint[];
  variant?: "primary" | "secondary";
  descriptionStyle?: "inline" | "block";
  icon?: React.ReactNode | SVGSVGElement | LucideIcon;
}) => {
  const iconAsReactNode = icon as Child;
  const iconWithProps = iconAsReactNode || (
    <CheckIcon
      className={cn(
        "inline-block w-full h-full",
        variant === "primary" ? "text-primary" : "text-secondary",
        iconClassName,
      )}
    />
  );

  return (
    <dl
      className={cn(
        "mt-10 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-500 lg:max-w-md",
        className,
      )}
    >
      {keyPoints.map((keyPoint, index) => (
        <div
          key={index}
          className={cn("last:mb-0", keyPoint.description ? "mb-8" : "mb-2")}
        >
          <dt className="inline font-semibold text-gray-900 dark:text-gray-100">
            <div className="inline-block h-5 w-5 mr-0.5">{iconWithProps}</div>{" "}
            {keyPoint.title}.
          </dt>{" "}
          {keyPoint.description ? (
            <dd className={cn(descriptionStyle === "inline" ? "inline" : "")}>
              {keyPoint.description}
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
};
