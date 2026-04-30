"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Upload, X, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

// ── Types ──────────────────────────────────────────────────────────────
interface FileUploadProps {
  /** Accepted file types, e.g. "image/*,.pdf" */
  accept?: string
  /** Max file size in bytes */
  maxSize?: number
  /** Allow multiple files */
  multiple?: boolean
  /** Max files when multiple */
  maxFiles?: number
  /** Callback when files are selected */
  onFilesChange?: (files: File[]) => void
  /** Disabled state */
  disabled?: boolean
  className?: string
}

// ── Helpers ────────────────────────────────────────────────────────────
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Component ──────────────────────────────────────────────────────────
export function FileUpload({
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  maxFiles = 5,
  onFilesChange,
  disabled = false,
  className,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [dragActive, setDragActive] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const validateFiles = (incoming: File[]): File[] => {
    setError(null)

    const valid = incoming.filter((file) => {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds ${formatFileSize(maxSize)} limit`)
        return false
      }
      return true
    })

    if (multiple) {
      const total = files.length + valid.length
      if (total > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return valid.slice(0, maxFiles - files.length)
      }
    }

    return multiple ? valid : valid.slice(0, 1)
  }

  const addFiles = (incoming: File[]) => {
    const validated = validateFiles(incoming)
    if (validated.length === 0) return

    const next = multiple ? [...files, ...validated] : validated
    setFiles(next)
    onFilesChange?.(next)
  }

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index)
    setFiles(next)
    onFilesChange?.(next)
    setError(null)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files))
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop zone */}
      <div
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload files"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <Upload className="mb-3 size-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drag & drop {multiple ? "files" : "a file"} here, or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Max {formatFileSize(maxSize)}
          {accept && ` · ${accept}`}
          {multiple && ` · Up to ${maxFiles} files`}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
          tabIndex={-1}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-md border bg-muted/50 px-3 py-2"
            >
              <FileIcon className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(i)
                }}
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
