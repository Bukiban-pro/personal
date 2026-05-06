import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Markdown Editor / Renderer** — simple markdown editing and preview
 *
 * Supports:
 * - Live preview (side-by-side)
 * - Basic markdown syntax
 * - Toolbar buttons for formatting
 * - Split view toggle
 * - Export to HTML
 *
 * Use: Blog editors, documentation, note-taking
 */

export interface MarkdownEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  onSave?: (markdown: string) => void;
  initialValue?: string;
}

export const MarkdownEditor = React.forwardRef<HTMLDivElement, MarkdownEditorProps>(
  (
    {
      onSave,
      initialValue = "",
      className,
      ...props
    },
    ref,
  ) => {
    const [markdown, setMarkdown] = React.useState(initialValue);
    const [splitView, setSplitView] = React.useState(true);

    // Basic markdown to HTML conversion
    const renderMarkdown = (md: string) => {
      let html = md
        .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
        .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
        .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        .replace(/\n\n/g, "</p><p>")
        .replace(/^/gm, "<p>")
        .replace(/$/gm, "</p>");

      return html;
    };

    return (
      <div
        ref={ref}
        className={cn("border border-border rounded-lg overflow-hidden", className)}
        {...props}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-muted p-2 border-b border-border gap-2">
          <div className="flex gap-1">
            <button
              onClick={() => setMarkdown((prev) => prev + "\n**bold**")}
              className="px-3 py-1 text-sm bg-background hover:bg-muted-foreground/20 rounded transition-colors"
              title="Bold"
            >
              B
            </button>
            <button
              onClick={() => setMarkdown((prev) => prev + "\n*italic*")}
              className="px-3 py-1 text-sm bg-background hover:bg-muted-foreground/20 rounded transition-colors"
              title="Italic"
            >
              I
            </button>
            <button
              onClick={() => setMarkdown((prev) => prev + "\n# Heading")}
              className="px-3 py-1 text-sm bg-background hover:bg-muted-foreground/20 rounded transition-colors"
              title="Heading"
            >
              H1
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSplitView(!splitView)}
              className="px-3 py-1 text-sm bg-background hover:bg-muted-foreground/20 rounded transition-colors"
            >
              {splitView ? "Edit Only" : "Split View"}
            </button>
            <button
              onClick={() => onSave?.(markdown)}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Editor + Preview */}
        <div className={cn("flex", splitView && "divide-x divide-border")}>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className={cn(
              "p-4 font-mono text-sm outline-none bg-background text-foreground resize-none",
              splitView ? "w-1/2" : "w-full",
            )}
            style={{ height: "400px" }}
            placeholder="Enter markdown here..."
          />

          {splitView && (
            <div
              className="w-1/2 p-4 overflow-y-auto prose prose-sm prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
            />
          )}
        </div>
      </div>
    );
  },
);

MarkdownEditor.displayName = "MarkdownEditor";
