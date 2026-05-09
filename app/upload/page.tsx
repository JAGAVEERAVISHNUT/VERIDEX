"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Cpu,
  FileSearch,
  Plus,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Zap,
} from "lucide-react"
import { TopNav } from "@/components/forensic/top-nav"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"
import { cn } from "@/lib/utils"

type Step = "create" | "autopsy" | "evidence" | "process" | "done"
type FileStatus = "idle" | "uploading" | "success" | "error"

interface StepState {
  status: FileStatus
  message: string
  detail?: string
}

export default function UploadPage() {
  const router = useRouter()
  const [caseTitle, setCaseTitle] = useState("")
  const [caseId, setCaseId] = useState<string | null>(null)
  const [step, setStep] = useState<Step>("create")
  const [autopsyFile, setAutopsyFile] = useState<File | null>(null)
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)
  const [stepState, setStepState] = useState<Record<string, StepState>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const setState = (key: string, s: Partial<StepState>) =>
    setStepState((prev) => ({ ...prev, [key]: { ...prev[key], ...s } as StepState }))

  // Step 1: Create Case
  const handleCreateCase = async () => {
    if (!caseTitle.trim()) return
    setState("create", { status: "uploading", message: "Creating case..." })
    try {
      const c = await api.createCase(caseTitle.trim())
      setCaseId(c.case_id)
      setState("create", { status: "success", message: `Case ${c.case_id} created.` })
      setStep("autopsy")
    } catch (e: unknown) {
      setState("create", { status: "error", message: "Failed to create case.", detail: String(e) })
    }
  }

  // Step 2: Upload Autopsy PDF
  const handleUploadAutopsy = async () => {
    if (!autopsyFile || !caseId) return
    setState("autopsy", { status: "uploading", message: "Extracting & structuring autopsy report via AI..." })
    try {
      const res = await api.uploadAutopsy(caseId, autopsyFile)
      setState("autopsy", { status: "success", message: res.message })
      setStep("evidence")
    } catch (e: unknown) {
      setState("autopsy", { status: "error", message: "Autopsy upload failed.", detail: String(e) })
    }
  }

  // Step 3: Upload Digital Evidence (optional)
  const handleUploadEvidence = async (skip = false) => {
    if (skip) {
      setStep("process")
      return
    }
    if (!evidenceFile || !caseId) return
    setState("evidence", { status: "uploading", message: "Parsing digital evidence events..." })
    try {
      const res = await api.uploadEvidence(caseId, evidenceFile)
      setState("evidence", {
        status: "success",
        message: `${res.events_ingested} events ingested.`,
        detail: res.parse_errors.length ? `Warnings: ${res.parse_errors.join("; ")}` : undefined,
      })
      setStep("process")
    } catch (e: unknown) {
      setState("evidence", { status: "error", message: "Evidence upload failed.", detail: String(e) })
    }
  }

  // Step 4: Run Analysis
  const handleProcess = async () => {
    if (!caseId) return
    setIsProcessing(true)
    setState("process", { status: "uploading", message: "Running forensic engine (7 modules)..." })
    try {
      const res = await api.processCase(caseId)
      setState("process", {
        status: "success",
        message: `Analysis complete. Risk: ${res.risk_level.toUpperCase()} (${res.risk_score}/100) · Confidence: ${res.confidence_score}%`,
      })
      setStep("done")
      // Navigate to the case dashboard after 1.5s
      setTimeout(() => router.push(`/cases/${caseId}`), 1500)
    } catch (e: unknown) {
      setState("process", { status: "error", message: "Processing failed.", detail: String(e) })
    } finally {
      setIsProcessing(false)
    }
  }

  const steps: { key: Step; label: string; desc: string }[] = [
    { key: "create", label: "Create Case", desc: "Name your investigation" },
    { key: "autopsy", label: "Autopsy Report", desc: "Upload PDF" },
    { key: "evidence", label: "Digital Evidence", desc: "Upload JSON (optional)" },
    { key: "process", label: "Run Analysis", desc: "Forensic engine" },
  ]

  return (
    <div className="min-h-screen bg-background bg-grid">
      <TopNav />
      <main className="px-4 md:px-6 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground -ml-2 mb-4">
            <Link href="/">
              Back to Cases
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            New Investigation
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Ingest autopsy reports and digital evidence. The AI forensic engine will extract,
            correlate, and analyze all evidence — no assumptions, no fabricated data.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => {
            const state = stepState[s.key]
            const isActive = step === s.key
            const isDone = state?.status === "success" || (steps.findIndex(x => x.key === step) > i)
            const isError = state?.status === "error"
            return (
              <div key={s.key} className="flex items-center gap-1 shrink-0">
                <div className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                  isActive && "bg-primary/15 text-primary ring-1 ring-primary/30",
                  isDone && !isActive && "text-muted-foreground",
                  isError && "bg-destructive/10 text-destructive",
                  !isActive && !isDone && !isError && "text-muted-foreground/50",
                )}>
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono",
                    isActive && "bg-primary text-primary-foreground",
                    isDone && !isActive && "bg-primary/30 text-primary",
                    isError && "bg-destructive text-destructive-foreground",
                    !isActive && !isDone && !isError && "bg-muted text-muted-foreground",
                  )}>
                    {isDone && !isActive ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />}
              </div>
            )
          })}
        </div>

        {/* Step Panels */}
        <div className="space-y-4">

          {/* Step 1: Create Case */}
          <StepPanel
            label="Step 1 — Create Case"
            active={step === "create"}
            state={stepState["create"]}
          >
            <p className="text-xs text-muted-foreground mb-3">
              Give your investigation a title. A unique Case ID will be generated automatically.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCase()}
                placeholder="e.g. Riverside District — Unattended Death"
                className="flex-1 rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button
                onClick={handleCreateCase}
                disabled={!caseTitle.trim() || stepState["create"]?.status === "uploading"}
                size="sm"
              >
                {stepState["create"]?.status === "uploading"
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><Plus className="h-4 w-4" /> Create</>}
              </Button>
            </div>
            {caseId && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-primary">
                Case ID: {caseId}
              </p>
            )}
          </StepPanel>

          {/* Step 2: Autopsy PDF */}
          <StepPanel
            label="Step 2 — Autopsy Report (PDF)"
            active={step === "autopsy"}
            state={stepState["autopsy"]}
            locked={step === "create"}
          >
            <p className="text-xs text-muted-foreground mb-3">
              Upload the medical examiner's autopsy PDF. AI will extract body temperature,
              rigor mortis, livor mortis, cause of death, and toxicology — strictly from the document.
            </p>
            <FileInput
              accept=".pdf"
              label="PDF only · max 25MB"
              file={autopsyFile}
              onFile={setAutopsyFile}
            />
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleUploadAutopsy}
                disabled={!autopsyFile || stepState["autopsy"]?.status === "uploading"}
                size="sm"
              >
                {stepState["autopsy"]?.status === "uploading"
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                  : "Upload & Extract"}
              </Button>
            </div>
          </StepPanel>

          {/* Step 3: Digital Evidence */}
          <StepPanel
            label="Step 3 — Digital Evidence (JSON)"
            active={step === "evidence"}
            state={stepState["evidence"]}
            locked={["create", "autopsy"].includes(step)}
            optional
          >
            <p className="text-xs text-muted-foreground mb-3">
              Upload CCTV, mobile, or GPS logs in JSON format. See schema below.
              This step is optional — you can skip and still run analysis on autopsy alone.
            </p>
            <FileInput
              accept=".json"
              label="JSON only · max 25MB"
              file={evidenceFile}
              onFile={setEvidenceFile}
            />
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => handleUploadEvidence(false)}
                disabled={!evidenceFile || stepState["evidence"]?.status === "uploading"}
                size="sm"
              >
                {stepState["evidence"]?.status === "uploading"
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Parsing…</>
                  : "Upload Evidence"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => handleUploadEvidence(true)}
                disabled={stepState["evidence"]?.status === "uploading"}
              >
                Skip for now
              </Button>
            </div>

            {/* JSON Schema */}
            <details className="mt-4 rounded-md border border-border bg-secondary/20 overflow-hidden">
              <summary className="px-3 py-2 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                Expected JSON Schema
              </summary>
              <pre className="px-4 py-3 font-mono text-[10px] leading-relaxed text-foreground/80 overflow-auto">
{`{
  "case_id": "VX-2026-XXXXX",
  "events": [
    {
      "timestamp": "2025-03-14T23:12:00Z",
      "event_type": "cctv | mobile | gps | witness",
      "source": "CAM-114 Westbridge",
      "entity_id": "subject-001",
      "location": "Westbridge & 4th",
      "description": "Vehicle stops. Second individual enters.",
      "latitude": 40.7388,
      "longitude": -73.962
    }
  ]
}`}
              </pre>
            </details>
          </StepPanel>

          {/* Step 4: Run Analysis */}
          <StepPanel
            label="Step 4 — Run Forensic Analysis"
            active={step === "process"}
            state={stepState["process"]}
            locked={["create", "autopsy", "evidence"].includes(step) && step !== "process"}
          >
            <p className="text-xs text-muted-foreground mb-4">
              The forensic engine will run all 7 analysis modules on your case data:
              timeline reconstruction, TOD estimation, correlation, anomaly detection,
              contradiction detection, risk scoring, and confidence scoring.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {[
                "Timeline Reconstruction",
                "TOD Estimation",
                "Correlation Engine",
                "Anomaly Detection",
                "Contradiction Check",
                "Risk Scoring",
                "Confidence Score",
                "AI Narrative",
              ].map((m) => (
                <div key={m} className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                  <Zap className="h-2.5 w-2.5 text-primary shrink-0" />
                  {m}
                </div>
              ))}
            </div>
            <Button
              onClick={handleProcess}
              disabled={isProcessing || step !== "process"}
              size="sm"
            >
              {isProcessing
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>
                : "Run Full Analysis"}
            </Button>
          </StepPanel>

          {/* Done */}
          {step === "done" && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 flex items-center gap-4">
              <CheckCircle2 className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold">Analysis Complete</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Redirecting to case dashboard for {caseId}…
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info tiles */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <InfoTile icon={Cpu} title="AI Pipeline"
            text="OCR → entity extraction → temporal correlation → anomaly detection. Avg. 90s per artifact." />
          <InfoTile icon={Lock} title="Chain of Custody"
            text="Evidence is processed server-side and stored with timestamps. No data fabrication." />
          <InfoTile icon={ShieldCheck} title="Strict Data Policy"
            text="System NEVER uses mock or simulated data. All outputs are derived strictly from uploaded evidence." />
        </section>

        <footer className="pt-8 pb-6 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Veridex Forensic Intelligence · Restricted Access · {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepPanel({
  label,
  active,
  locked,
  optional,
  state,
  children,
}: {
  label: string
  active: boolean
  locked?: boolean
  optional?: boolean
  state?: StepState
  children: React.ReactNode
}) {
  return (
    <div className={cn(
      "rounded-lg border bg-card/60 p-5 transition-all",
      active ? "border-primary/40 shadow-sm shadow-primary/10" : "border-border",
      locked && "opacity-40 pointer-events-none",
    )}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {optional && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            Optional
          </span>
        )}
      </div>
      {children}
      {state && (
        <div className={cn(
          "mt-3 flex items-start gap-2 rounded-md px-3 py-2 text-xs",
          state.status === "success" && "bg-primary/10 text-primary",
          state.status === "error" && "bg-destructive/10 text-destructive",
          state.status === "uploading" && "bg-secondary/40 text-muted-foreground",
        )}>
          {state.status === "uploading" && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0 mt-0.5" />}
          {state.status === "success" && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
          {state.status === "error" && <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
          <div>
            <p>{state.message}</p>
            {state.detail && <p className="mt-0.5 opacity-70">{state.detail}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

function FileInput({
  accept,
  label,
  file,
  onFile,
}: {
  accept: string
  label: string
  file: File | null
  onFile: (f: File) => void
}) {
  return (
    <label className={cn(
      "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed cursor-pointer transition-all px-6 py-8 text-center",
      file ? "border-primary/50 bg-primary/5" : "border-border bg-secondary/20 hover:border-primary/40 hover:bg-secondary/30",
    )}>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      {file ? (
        <>
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-foreground">{file.name}</span>
          <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB · Click to change</span>
        </>
      ) : (
        <>
          <FileSearch className="h-6 w-6 text-muted-foreground" />
          <span className="text-sm text-foreground"><span className="font-medium">Drop file here</span> or click to browse</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        </>
      )}
    </label>
  )
}

function InfoTile({ icon: Icon, title, text }: { icon: typeof Cpu; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-4">
      <Icon className="h-4 w-4 text-primary mb-2" aria-hidden="true" />
      <div className="text-sm font-medium text-foreground">{title}</div>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{text}</p>
    </div>
  )
}
