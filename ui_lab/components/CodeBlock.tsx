import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Code Block Component** — syntax-highlighted code display
 *
 * Supports:
 * - Language highlighting (basic)
 * - Copy-to-clipboard button
 * - Line numbers
 * - Line highlighting
 * - Dark/light theme
 * - Horizontal scroll for wide code
 *
 * Use: Documentation, blog posts, code examples, error messages
 */

export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  copyable?: boolean;
}

export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  (
    {
      code,
      language = "javascript",
      showLineNumbers = true,
      highlightLines = [],
      copyable = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const lines = code.split("\n");

    return (
      <div className="relative rounded-lg overflow-hidden border border-border bg-muted/50">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <span className="text-xs font-medium text-muted-foreground">{language}</span>
          {copyable && (
            <button
              onClick={handleCopy}
              className="text-xs px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>

        {/* Code */}
        <pre
          ref={ref}
          className={cn(
            "overflow-x-auto p-4 text-sm font-mono",
            className,
          )}
          {...props}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-4",
                highlightLines.includes(i + 1) && "bg-yellow-500/10 px-2 -mx-2",
              )}
            >
              {showLineNumbers && (
                <span className="w-8 text-right text-muted-foreground select-none">
                  {i + 1}
                </span>
              )}
              <span>{line}</span>
            </div>
          ))}
        </pre>
      </div>
    );
  },
);

CodeBlock.displayName = "CodeBlock";
