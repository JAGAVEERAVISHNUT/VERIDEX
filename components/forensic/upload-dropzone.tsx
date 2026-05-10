"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  UploadCloud,
  FileText,
  FileJson,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCasesStore } from "@/lib/cases-store"
import type { AutopsyCase } from "@/lib/mock-data"

type UploadStatus = "uploading" | "analyzing" | "analyzed" | "error" | "invalid"

interface UploadFile {
  id: string
  name: string
  size: number
  progress: number
  status: UploadStatus
  error?: string
  caseId?: string
  caseTitle?: string
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
  const router = useRouter()
  const addCase = useCasesStore((s) => s.addCase)
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

  const runAnalysis = useCallback(
    async (id: string, file: File) => {
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

        // Check if response is OK before parsing JSON
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text.slice(0, 100) || `Server error: ${res.status}`)
        }

        const result = await res.json()

        if (result.status === "invalid") {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? {
                    ...f,
                    status: "invalid",
                    error: result.message ?? "Invalid forensic document.",
                  }
                : f,
            ),
          )
        } else if (result.status === "error") {
          // Server-side error
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? {
                    ...f,
                    status: "error",
                    error: result.message ?? "Analysis service error.",
                  }
                : f,
            ),
          )
        } else if (result.status === "valid" && result.case) {
          // Add the extracted case to the global store
          const extractedCase = result.case as AutopsyCase
          addCase(extractedCase)

          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? {
                    ...f,
                    status: "analyzed",
                    caseId: extractedCase.caseId,
                    caseTitle: extractedCase.caseTitle,
                  }
                : f,
            ),
          )
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? { ...f, status: "error", error: "Unexpected response format." }
                : f,
            ),
          )
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error"
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  status: "error",
                  error: `Network error: ${errorMsg}`,
                }
              : f,
          ),
        )
      }
    },
    [addCase],
  )

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
          status: err ? "error" : ("uploading" as UploadStatus),
          error: err ?? undefined,
        }
      })

      setFiles((prev) => [...newFiles, ...prev])

      arr.forEach((f, i) => {
        const entry = newFiles[i]
        if (!entry.error) {
          simulateUpload(entry.id, f)
        }
      })
    },
    [validate, simulateUpload],
  )

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length) {
        addFiles(e.dataTransfer.files)
      }
    },
    [addFiles],
  )

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const openCase = useCallback(
    (caseId: string) => {
      router.push(`/cases/${caseId}`)
    },
    [router],
  )

  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/40 hover:bg-card/80",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          className="sr-only"
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
          <UploadCloud className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground text-center">{description}</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {acceptLabel} · max {maxSizeMB}MB · auto-analyzed on upload
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {f.name}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {formatBytes(f.size)}
                  </span>
                </div>

                {f.status === "uploading" && (
                  <>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-150"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Uploading · {Math.round(f.progress)}%
                    </span>
                  </>
                )}

                {f.status === "analyzing" && (
                  <div className="mt-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                      AI analyzing document...
                    </span>
                  </div>
                )}

                {f.status === "analyzed" && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[--color-severity-medium]" />
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[--color-severity-medium]">
                        Analyzed · Case added to dashboard
                      </span>
                    </div>
                    {f.caseId && (
                      <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                        <p className="text-xs font-medium text-foreground">
                          {f.caseTitle ?? f.caseId}
                        </p>
                        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                          Case ID: {f.caseId}
                        </p>
                        <Button
                          variant="default"
                          size="sm"
                          className="mt-2 font-mono text-[10px] uppercase tracking-wider"
                          onClick={() => openCase(f.caseId!)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1.5" />
                          View Case
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {f.status === "invalid" && (
                  <div className="mt-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[--color-severity-high]" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[--color-severity-high]">
                      Invalid · {f.error}
                    </span>
                  </div>
                )}

                {f.status === "error" && (
                  <div className="mt-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[--color-severity-high]" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[--color-severity-high]">
                      Error · {f.error}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => removeFile(f.id)}
                className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
