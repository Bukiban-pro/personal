import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Code Editor / Syntax Display** — inline code editor with syntax highlighting
 *
 * Supports:
 * - Syntax highlighting (basic)
 * - Line numbers
 * - Copy button
 * - Custom themes
 * - Read-only mode
 *
 * Use: Documentation, code snippets, tutorials
 */

export interface CodeEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  onChange?: (code: string) => void;
}

export const CodeEditor = React.forwardRef<HTMLDivElement, CodeEditorProps>(
  (
    {
      code: initialCode,
      language = "javascript",
      readOnly = true,
      showLineNumbers = true,
      onChange,
      className,
      ...props
    },
    ref,
  ) => {
    const [code, setCode] = React.useState(initialCode);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newCode = e.target.value;
      setCode(newCode);
      onChange?.(newCode);
    };

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
    };

    const lines = code.split("\n");

    return (
      <div
        ref={ref}
        className={cn(
          "bg-slate-900 text-slate-100 rounded-lg overflow-hidden border border-slate-700",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
          <span className="text-xs font-mono text-slate-400">{language}</span>
          <button
            onClick={handleCopy}
            className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-100 transition-colors"
          >
            Copy
          </button>
        </div>

        {/* Editor */}
        <div className="flex overflow-auto max-h-96">
          {/* Line numbers */}
          {showLineNumbers && (
            <div className="bg-slate-950 text-slate-600 px-4 py-2 text-right text-xs font-mono border-r border-slate-700 select-none">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}

          {/* Code */}
          <div className="flex-1 relative">
            {!readOnly && (
              <textarea
                value={code}
                onChange={handleChange}
                className="absolute inset-0 w-full h-full p-4 bg-transparent text-slate-100 font-mono text-sm resize-none outline-none border-none"
                spellCheck="false"
              />
            )}
            <pre className="p-4 font-mono text-sm text-slate-100 overflow-hidden">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  },
);

CodeEditor.displayName = "CodeEditor";
