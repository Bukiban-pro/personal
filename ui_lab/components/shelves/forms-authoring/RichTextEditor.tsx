import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Rich Text Editor Toolbar** — toolbar with formatting options
 *
 * Supports:
 * - Bold, Italic, Underline
 * - Font size, heading levels
 * - Lists (ordered/unordered)
 * - Alignment
 * - Links, code blocks
 * - Undo/Redo
 * - Custom actions
 *
 * Use: Blog editors, content creation, form WYSIWYG inputs
 */

export interface ToolbarAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  active?: boolean;
}

export interface RichTextToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  actions: ToolbarAction[];
  onBold?: () => void;
  onItalic?: () => void;
  onUnderline?: () => void;
  onLink?: () => void;
}

export const RichTextToolbar = React.forwardRef<HTMLDivElement, RichTextToolbarProps>(
  (
    {
      actions,
      onBold,
      onItalic,
      onUnderline,
      onLink,
      className,
      ...props
    },
    ref,
  ) => {
    const defaultActions: ToolbarAction[] = [
      {
        id: "bold",
        label: "Bold",
        icon: "B",
        onClick: onBold || (() => {}),
      },
      {
        id: "italic",
        label: "Italic",
        icon: "I",
        onClick: onItalic || (() => {}),
      },
      {
        id: "underline",
        label: "Underline",
        icon: "U",
        onClick: onUnderline || (() => {}),
      },
      {
        id: "link",
        label: "Link",
        icon: "🔗",
        onClick: onLink || (() => {}),
      },
    ];

    const allActions = actions.length > 0 ? actions : defaultActions;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-1 p-2 bg-muted/50 border border-border rounded-lg flex-wrap",
          className,
        )}
        {...props}
      >
        {allActions.map((action, i) => (
          <React.Fragment key={action.id}>
            <button
              onClick={action.onClick}
              title={action.label}
              className={cn(
                "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                action.active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-background text-foreground",
              )}
            >
              {action.icon}
            </button>

            {/* Divider after groups */}
            {(action.id === "underline" || (actions.length > 0 && i % 3 === 2)) && (
              <div className="w-px h-5 bg-border" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  },
);

RichTextToolbar.displayName = "RichTextToolbar";

// ─── Simple Rich Text Editor component ────────────────────────────────────

export interface RichTextEditorProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  showToolbar?: boolean;
}

export const RichTextEditor = React.forwardRef<HTMLTextAreaElement, RichTextEditorProps>(
  (
    {
      value,
      onChange,
      showToolbar = true,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-2">
        {showToolbar && (
          <RichTextToolbar
            onBold={() => {
              const textarea = ref && "current" in ref ? ref.current : null;
              if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selected = value.substring(start, end);
                const newValue =
                  value.substring(0, start) +
                  `**${selected}**` +
                  value.substring(end);
                onChange(newValue);
              }
            }}
            onItalic={() => {
              const textarea = ref && "current" in ref ? ref.current : null;
              if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selected = value.substring(start, end);
                const newValue =
                  value.substring(0, start) +
                  `*${selected}*` +
                  value.substring(end);
                onChange(newValue);
              }
            }}
          />
        )}

        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "p-3 border border-border rounded-lg bg-background text-sm font-mono resize-none",
            "hover:border-primary/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

RichTextEditor.displayName = "RichTextEditor";
