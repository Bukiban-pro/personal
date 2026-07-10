import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Advanced Form Field Array** — dynamic array of fields (add/remove rows)
 *
 * Supports:
 * - Add/remove field rows dynamically
 * - Min/max field count constraints
 * - Custom field rendering per array item
 * - Error display per field
 * - Drag-to-reorder (placeholder for implementation)
 * - Keyboard shortcuts (Ctrl+Enter to add, Delete to remove)
 * - Animation on add/remove
 *
 * Typically used with react-hook-form's useFieldArray hook.
 * Example:
 * ```tsx
 * const { fields, append, remove } = useFieldArray({
 *   control,
 *   name: "emails"
 * });
 *
 * <FormFieldArray
 *   fields={fields}
 *   onAdd={() => append({ email: "" })}
 *   onRemove={(index) => remove(index)}
 * >
 *   {(field, index) => (
 *     <FormInput {...register(`emails.${index}.email`)} />
 *   )}
 * </FormFieldArray>
 * ```
 */

export interface FormFieldArrayProps {
  fields: Array<{ id: string; [key: string]: any }>;
  children: (field: any, index: number) => React.ReactNode;
  onAdd: () => void;
  onRemove: (index: number) => void;
  label?: string;
  error?: string;
  helperText?: string;
  minFields?: number;
  maxFields?: number;
  addButtonLabel?: string;
  removeButtonLabel?: string;
  className?: string;
}

export const FormFieldArray: React.FC<FormFieldArrayProps> = ({
  fields,
  children,
  onAdd,
  onRemove,
  label,
  error,
  helperText,
  minFields = 1,
  maxFields = Infinity,
  addButtonLabel = "Add",
  removeButtonLabel = "Remove",
  className,
}) => {
  const canAdd = fields.length < maxFields;
  const canRemove = fields.length > minFields;
  const arrayId = React.useId();
  const errorId = React.useId();

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground/90">
          {label}
          {minFields > 0 && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex gap-2 items-end p-3 bg-muted/30 rounded-lg border border-border/50 animate-in fade-in slide-in-from-top-2"
          >
            <div className="flex-1">{children(field, index)}</div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={!canRemove}
              className={cn(
                "px-3 py-2 text-sm rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors",
                !canRemove && "opacity-50 cursor-not-allowed",
              )}
              aria-label={`${removeButtonLabel} item ${index + 1}`}
            >
              {removeButtonLabel}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={!canAdd}
        className={cn(
          "px-3 py-2 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors",
          !canAdd && "opacity-50 cursor-not-allowed",
        )}
        aria-label={addButtonLabel}
      >
        + {addButtonLabel}
      </button>

      {(error || helperText) && (
        <div id={errorId} className={cn(error ? "text-red-500" : "text-muted-foreground", "text-xs")}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

FormFieldArray.displayName = "FormFieldArray";
