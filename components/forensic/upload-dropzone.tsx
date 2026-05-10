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
  Sparkles,
  Thermometer,
  Clock,
  FlaskConical,
  Wind,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type UploadStatus = "uploading" | "analyzing" | "analyzed" | "error" | "invalid"

interface AnalysisResult {
  status: "valid" | "invalid"
  source_type?: string
  structured_data?: {
    body_temperature: string
    rigor_mortis: string
    livor_mortis: string
    environment: string
  }
  time_of_death_estimate?: string
  summary?: string
  message?: string
}

interface UploadFile {
  id: string
  name: string
  size: number
  progress: number
  status: UploadStatus
  error?: string
  result?: AnalysisResult
  expanded?: boolean
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

  const runAnalysis = useCallback(async (id: string, file: File) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "analyzing", progress: 100 } : f,
      ),
    )

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      const result: AnalysisResult = await res.json()

      if (result.status === "invalid") {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  status: "invalid",
                  result,
                  error: result.message ?? "Invalid forensic document.",
                }
              : f,
          ),
        )
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, status: "analyzed", result, expanded: true }
              : f,
          ),
        )
      }
    } catch {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status: "error",
                error: "Network error — could not reach analysis service.",
              }
            : f,
        ),
      )
    }
  }, [])

  const simulateUpload = useCallback(
    (id: string, file: File) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 22 + 12
        if (progress >= 100) {
          clearInterval(interval)
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress: 100 } : f)),
          )
          runAnalysis(id, file)
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id ? { ...f, progress, status: "uploading" } : f,
            ),
          )
        }
      }, 130)
    },
    [runAnalysis],
  )

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
          status: err ? "error" : "uploading",
          error: err ?? undefined,
        }
      })
      setFiles((prev) => [...prev, ...newFiles])
      arr.forEach((f, i) => {
        const entry = newFiles[i]
        if (entry.status === "uploading") simulateUpload(entry.id, f)
      })
    },
    [simulateUpload, validate],
  )

  const toggleExpand = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, expanded: !f.expanded } : f)),
    )
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="rounded-lg border border-border bg-card/60 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 text-pretty">{description}</p>
        </div>
      </div>

      <div
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed cursor-pointer transition-all px-6 py-10 text-center",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-secondary/10 hover:border-primary/30 hover:bg-secondary/20",
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click() }}
        aria-label={`${title} dropzone`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="sr-only"
          onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = "" }}
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
          {acceptLabel} &middot; max {maxSizeMB}MB &middot; AI-analyzed immediately on upload
        </div>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-3">
          {files.map((file) => (
            <li key={file.id} className="rounded-md border border-border bg-background overflow-hidden">
              {/* File row */}
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground truncate">{file.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                      {formatBytes(file.size)}
                    </span>
                  </div>

                  {file.status === "uploading" && (
                    <>
                      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary transition-all" style={{ width: `${file.progress}%` }} />
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                        Uploading {Math.round(file.progress)}%
                      </div>
                    </>
                  )}

                  {file.status === "analyzing" && (
                    <div className="font-mono text-[10px] uppercase tracking-wider text-primary mt-1">
                      AI analyzing document&hellip;
                    </div>
                  )}

                  {file.status === "analyzed" && (
                    <div className="font-mono text-[10px] uppercase tracking-wider text-green-600 mt-1">
                      Analysis complete &middot; valid forensic report
                    </div>
                  )}

                  {file.status === "invalid" && (
                    <div className="font-mono text-[10px] uppercase tracking-wider text-amber-600 mt-1">
                      Invalid &mdash; not a forensic/autopsy document
                    </div>
                  )}

                  {file.status === "error" && (
                    <div className="font-mono text-[10px] uppercase tracking-wider text-red-600 mt-1">
                      {file.error}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {file.status === "uploading" && (
                    <Loader2 className="h-4 w-4 text-primary animate-spin" aria-hidden="true" />
                  )}
                  {file.status === "analyzing" && (
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" aria-hidden="true" />
                  )}
                  {file.status === "analyzed" && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={(e) => { e.stopPropagation(); toggleExpand(file.id) }}
                        aria-label={file.expanded ? "Collapse results" : "Expand results"}
                      >
                        {file.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </Button>
                    </>
                  )}
                  {file.status === "invalid" && (
                    <AlertCircle className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  )}
                  {file.status === "error" && (
                    <AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={(e) => { e.stopPropagation(); removeFile(file.id) }}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* AI result panel — shown when analyzed and expanded */}
              {file.status === "analyzed" && file.expanded && file.result?.status === "valid" && (
                <div className="border-t border-border bg-secondary/10 px-4 py-4 space-y-4">
                  {/* Structured data grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <ResultField
                      icon={Thermometer}
                      label="Body Temperature"
                      value={file.result.structured_data?.body_temperature}
                    />
                    <ResultField
                      icon={FlaskConical}
                      label="Rigor Mortis"
                      value={file.result.structured_data?.rigor_mortis}
                    />
                    <ResultField
                      icon={FlaskConical}
                      label="Livor Mortis"
                      value={file.result.structured_data?.livor_mortis}
                    />
                    <ResultField
                      icon={Wind}
                      label="Environment"
                      value={file.result.structured_data?.environment}
                    />
                  </div>

                  {/* TOD estimate */}
                  {file.result.time_of_death_estimate && (
                    <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2.5 flex items-start gap-2.5">
                      <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-0.5">
                          Time-of-Death Estimate
                        </p>
                        <p className="text-xs text-foreground leading-relaxed">
                          {file.result.time_of_death_estimate}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI Summary */}
                  {file.result.summary && (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                        Forensic Summary
                      </p>
                      <p className="text-xs text-foreground leading-relaxed">
                        {file.result.summary}
                      </p>
                    </div>
                  )}

                  {/* Source type badge */}
                  <div className="flex items-center justify-end">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Source: {file.result.source_type}
                    </span>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ResultField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Thermometer
  label: string
  value?: string
}) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3 w-3 text-primary" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-xs text-foreground leading-relaxed">
        {value && value.trim() !== "" ? value : "Not documented"}
      </p>
    </div>
  )
}
