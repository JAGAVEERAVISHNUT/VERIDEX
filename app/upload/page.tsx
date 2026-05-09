"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShieldCheck, Lock, Cpu, FileSearch, Sparkles, Loader2 } from "lucide-react"
import { TopNav } from "@/components/forensic/top-nav"
import { UploadDropzone } from "@/components/forensic/upload-dropzone"
import { Button } from "@/components/ui/button"

export default function UploadPage() {
  const [pdfFiles, setPdfFiles] = useState<File[]>([])
  const [jsonFiles, setJsonFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  const handleAnalyze = async () => {
    if (pdfFiles.length === 0 && jsonFiles.length === 0) return
    setIsAnalyzing(true)

    const formData = new FormData()
    if (pdfFiles[0]) formData.append("pdf", pdfFiles[0])
    if (jsonFiles[0]) formData.append("json", jsonFiles[0])

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.success && data.caseId) {
        router.push(`/cases/${data.caseId}`)
      } else {
        alert("Analysis failed: " + data.error)
        setIsAnalyzing(false)
      }
    } catch (e) {
      console.error(e)
      alert("Analysis failed.")
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background bg-grid">
      <TopNav />
      <main className="px-4 md:px-6 py-8 max-w-5xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground -ml-2 mb-3">
              <Link href="/">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Evidence Ingestion · New Case
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Ingest Evidence for Analysis
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl text-pretty">
              Upload forensic source documents. Our AI engine will parse, structure, and correlate
              evidence across modalities. All artifacts are encrypted at rest and chain-of-custody
              logged.
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || (pdfFiles.length === 0 && jsonFiles.length === 0)}
              className="w-full md:w-auto bg-primary hover:bg-primary/90"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running AI Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Run AI Pipeline
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UploadDropzone
            title="Autopsy Report"
            description="Medical examiner findings, toxicology, body diagrams. Single PDF, ≤25MB."
            accept=".pdf"
            acceptLabel="PDF only"
            icon="pdf"
            maxSizeMB={25}
            onFilesChanged={setPdfFiles}
          />
          <UploadDropzone
            title="Digital Evidence"
            description="Structured CCTV / mobile / GPS logs. JSON format, chain-of-custody preserved."
            accept=".json"
            acceptLabel="JSON only"
            icon="json"
            maxSizeMB={25}
            onFilesChanged={setJsonFiles}
          />
        </div>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <InfoTile
            icon={Cpu}
            title="AI Pipeline"
            text="OCR → entity extraction → temporal correlation → anomaly detection. Avg. 90s per artifact."
          />
          <InfoTile
            icon={Lock}
            title="Chain of Custody"
            text="SHA-256 hashed on upload. Tamper-evident logging with examiner attribution."
          />
          <InfoTile
            icon={ShieldCheck}
            title="Compliance"
            text="CJIS · GDPR · ISO/IEC 27037 aligned. Encrypted at rest with HSM-backed keys."
          />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card/60 p-5">
          <div className="flex items-start gap-3">
            <FileSearch className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Expected Schema</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Digital evidence JSON should conform to the structured schema below. Unrecognized
                fields are preserved but not indexed.
              </p>
              <pre className="overflow-auto rounded-md border border-border bg-[oklch(0.13_0.005_260)] px-4 py-3 font-mono text-[11px] leading-relaxed text-foreground/85">
{`{
  "case_id": "VX-2025-04412",
  "events": [
    {
      "timestamp": "2025-03-14T23:12:00Z",
      "event_type": "cctv | mobile | gps | witness",
      "source": "CAM-114 Westbridge",
      "location": { "lat": 40.7388, "lon": -73.962 },
      "entity_id": "subject-001",
      "metadata": {}
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </section>

        <footer className="pt-8 pb-6 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Veridex Forensic Intelligence · Restricted Access · {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  )
}

function InfoTile({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Cpu
  title: string
  text: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-4">
      <Icon className="h-4 w-4 text-primary mb-2" aria-hidden="true" />
      <div className="text-sm font-medium text-foreground">{title}</div>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed text-pretty">{text}</p>
    </div>
  )
}
