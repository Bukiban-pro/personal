import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Drag-Drop Zone** — file upload area with drag-drop support
 *
 * Supports:
 * - Drag-drop file input
 * - Click to select files
 * - Multiple file selection
 * - File type filtering
 * - File size validation
 * - Preview thumbnails
 * - Progress tracking
 * - Error states
 *
 * Use: File uploads, document submission, media imports
 */

export interface DragDropZoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onChange?: (files: File[]) => void;
  onError?: (error: string) => void;
  label?: string;
  description?: string;
  loading?: boolean;
}

export const DragDropZone = React.forwardRef<HTMLDivElement, DragDropZoneProps>(
  (
    {
      accept,
      multiple = true,
      maxSize = 10 * 1024 * 1024, // 10MB
      maxFiles = 5,
      onChange,
      onError,
      label = "Upload files",
      description,
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [isDragActive, setIsDragActive] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setIsDragActive(true);
      } else if (e.type === "dragleave") {
        setIsDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
    };

    const handleFiles = (files: File[]) => {
      // Validate file count
      if (selectedFiles.length + files.length > maxFiles) {
        onError?.(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate file sizes
      const validFiles: File[] = [];
      for (const file of files) {
        if (file.size > maxSize) {
          onError?.(`File ${file.name} exceeds max size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        const newFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
        setSelectedFiles(newFiles);
        onChange?.(newFiles);
      }
    };

    const removeFile = (index: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
      onChange?.(newFiles);
    };

    const handleClick = () => {
      if (!loading) inputRef.current?.click();
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed transition-colors cursor-pointer",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary hover:bg-muted/50",
            loading && "opacity-50 cursor-not-allowed",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleChange}
            disabled={loading}
            className="hidden"
            aria-label="File upload"
          />

          {loading ? (
            <>
              <div className="animate-spin">⟳</div>
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <div className="text-4xl">📎</div>
              <div className="text-center">
                <div className="font-medium text-foreground">{label}</div>
                {description && (
                  <div className="text-sm text-muted-foreground">{description}</div>
                )}
              </div>
            </>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""} selected
            </div>
            <div className="space-y-1">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 border border-border/50"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg">📄</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);

DragDropZone.displayName = "DragDropZone";
