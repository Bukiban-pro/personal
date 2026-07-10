import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Stepper/Wizard Form** — multi-step form with progress indicator
 *
 * Supports:
 * - Linear/non-linear stepping
 * - Step states: default/active/completed/error
 * - Optional descriptions
 * - Icons for steps
 * - Validation per step
 * - Previous/Next navigation
 * - Conditional steps
 * - Completion status
 *
 * Use: Multi-step onboarding, checkout, complex forms, wizards
 */

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  optional?: boolean;
  state?: "default" | "active" | "completed" | "error";
  content?: React.ReactNode;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[];
  activeStep?: number;
  onStepChange?: (step: number) => void;
  linear?: boolean;
  showNumbers?: boolean;
  variant?: "vertical" | "horizontal";
  onNext?: () => boolean | Promise<boolean>;
  onPrev?: () => void;
  onComplete?: () => void;
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      activeStep = 0,
      onStepChange,
      linear = true,
      showNumbers = true,
      variant = "vertical",
      onNext,
      onPrev,
      onComplete,
      className,
      ...props
    },
    ref,
  ) => {
    const [currentStep, setCurrentStep] = React.useState(activeStep);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      setCurrentStep(activeStep);
    }, [activeStep]);

    const handleNext = async () => {
      if (onNext) {
        setLoading(true);
        const result = await onNext();
        setLoading(false);
        if (!result) return;
      }

      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        onStepChange?.(nextStep);
      } else {
        onComplete?.();
      }
    };

    const handlePrev = () => {
      if (currentStep > 0) {
        const prevStep = currentStep - 1;
        setCurrentStep(prevStep);
        onStepChange?.(prevStep);
      }
      onPrev?.();
    };

    const handleStepClick = (index: number) => {
      if (!linear || index <= currentStep) {
        setCurrentStep(index);
        onStepChange?.(index);
      }
    };

    const stateColorMap = {
      default: "bg-muted text-muted-foreground",
      active: "bg-primary text-primary-foreground",
      completed: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-6",
          variant === "vertical" ? "flex-col" : "flex-row",
          className,
        )}
        {...props}
      >
        {/* Step Indicator */}
        <div className={cn("flex", variant === "vertical" ? "flex-col gap-4 w-64" : "gap-4 w-full mb-6")}>
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const state = step.state || (isActive ? "active" : isCompleted ? "completed" : "default");

            return (
              <div key={step.id}>
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={linear && index > currentStep}
                  className={cn("flex items-start gap-3 w-full", linear && index > currentStep && "opacity-50 cursor-not-allowed")}
                >
                  <div className={cn("relative flex items-center justify-center h-10 w-10 rounded-full font-semibold", stateColorMap[state])}>
                    {step.icon ? (
                      step.icon
                    ) : showNumbers ? (
                      isCompleted ? (
                        "✓"
                      ) : (
                        index + 1
                      )
                    ) : state === "completed" ? (
                      "✓"
                    ) : state === "error" ? (
                      "!"
                    ) : null}
                  </div>
                  <div className={cn("flex flex-col gap-1 text-left", isActive && "text-foreground", !isActive && "text-muted-foreground")}>
                    <div className={cn("font-medium", isActive && "text-primary")}>
                      {step.label}
                      {step.optional && <span className="text-xs text-muted-foreground ml-2">(optional)</span>}
                    </div>
                    {step.description && <div className="text-xs text-muted-foreground">{step.description}</div>}
                  </div>
                </button>

                {/* Vertical Connector */}
                {variant === "vertical" && index < steps.length - 1 && (
                  <div className="ml-5 mt-2 h-8 w-0.5 bg-border" />
                )}
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="mb-6">
            {steps[currentStep]?.content && (
              <div className="animate-in fade-in">
                {steps[currentStep].content}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Loading..." : currentStep === steps.length - 1 ? "Complete" : "Next"}
            </button>
          </div>

          {/* Progress Indicator */}
          {variant === "horizontal" && (
            <div className="mt-6 flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 h-1 rounded-full transition-colors",
                    index <= currentStep ? "bg-primary" : "bg-muted",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Stepper.displayName = "Stepper";
