"use client"

import { useCallback, useRef, useState } from "react"
import {
  UploadCloud,
  FileText,
  FileJson,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type UploadStatus = "queued" | "uploading" | "success" | "error"

interface UploadFile {
  id: string
  name: string
  size: number
  progress: number
  status: UploadStatus
  error?: string
}

interface DropzoneProps {
  title: string
  description: string
  accept: string
  acceptLabel: string
  icon: "pdf" | "json"
  maxSizeMB?: number
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function UploadDropzone({
  title,
  description,
  accept,
  acceptLabel,
  icon,
  maxSizeMB = 25,
}: DropzoneProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const Icon = icon === "pdf" ? FileText : FileJson

  const validate = useCallback(
    (file: File): string | null => {
      const acceptedExts = accept.split(",").map((s) => s.trim().toLowerCase())
      const ext = "." + file.name.split(".").pop()?.toLowerCase()
      if (!acceptedExts.includes(ext)) {
        return `Unsupported file type. Expected ${acceptLabel}.`
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File exceeds ${maxSizeMB}MB limit.`
      }
      return null
    },
    [accept, acceptLabel, maxSizeMB],
  )

  const simulateUpload = useCallback((id: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 6
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, progress: 100, status: "success" } : f,
          ),
        )
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, progress, status: "uploading" } : f,
          ),
        )
      }
    }, 220)
  }, [])

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming)
      const newFiles: UploadFile[] = arr.map((f) => {
        const err = validate(f)
        return {
          id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
          name: f.name,
          size: f.size,
          progress: 0,
          status: err ? "error" : "queued",
          error: err ?? undefined,
        }
      })
      setFiles((prev) => [...prev, ...newFiles])
      newFiles.forEach((f) => {
        if (f.status === "queued") simulateUpload(f.id)
      })
    },
    [simulateUpload, validate],
  )

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files)
    e.target.value = ""
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="rounded-lg border border-border bg-card/60 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 text-pretty">{description}</p>
        </div>
      </div>

      <div
        onDragEnter={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed cursor-pointer transition-all px-6 py-10 text-center",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-secondary/20 hover:border-primary/40 hover:bg-secondary/30",
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
        aria-label={`${title} dropzone`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="sr-only"
          onChange={onChange}
        />
        <UploadCloud
          className={cn(
            "h-8 w-8 mb-1 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground",
          )}
          aria-hidden="true"
        />
        <div className="text-sm text-foreground">
          <span className="font-medium">Drop files here</span>{" "}
          <span className="text-muted-foreground">or click to browse</span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {acceptLabel} · max {maxSizeMB}MB
        </div>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="rounded-md border border-border bg-secondary/30 px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground truncate">
                      {file.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                  {file.status === "uploading" && (
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  {file.status === "success" && (
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--risk-low)] mt-0.5">
                      Uploaded · queued for analysis
                    </div>
                  )}
                  {file.status === "error" && (
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--risk-high)] mt-0.5">
                      {file.error}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {file.status === "uploading" && (
                    <Loader2 className="h-4 w-4 text-primary animate-spin" aria-hidden="true" />
                  )}
                  {file.status === "success" && (
                    <CheckCircle2
                      className="h-4 w-4 text-[color:var(--risk-low)]"
                      aria-hidden="true"
                    />
                  )}
                  {file.status === "error" && (
                    <AlertCircle
                      className="h-4 w-4 text-[color:var(--risk-high)]"
                      aria-hidden="true"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(file.id)
                    }}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
