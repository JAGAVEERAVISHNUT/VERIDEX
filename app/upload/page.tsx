import Link from "next/link"
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Cpu,
  FileSearch,
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Microscope,
  NotebookPen,
  Sparkles,
} from "lucide-react"
import { TopNav } from "@/components/forensic/top-nav"
import { UploadDropzone } from "@/components/forensic/upload-dropzone"
import { Button } from "@/components/ui/button"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <TopNav />
      <main className="px-4 md:px-6 py-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground -ml-2 mb-3">
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Evidence Ingestion · Case AUT-2025-0001
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UploadDropzone
            title="Autopsy Report"
            description="Medical examiner findings, toxicology, body diagrams. Single PDF, ≤25MB."
            accept=".pdf"
            acceptLabel="PDF only"
            icon="pdf"
            maxSizeMB={25}
          />
          <UploadDropzone
            title="Digital Evidence"
            description="Structured CCTV / mobile / GPS logs. JSON format, chain-of-custody preserved."
            accept=".json"
            acceptLabel="JSON only"
            icon="json"
            maxSizeMB={25}
          />
        </div>

        <section className="mt-8 rounded-lg border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                AI extracts five forensic dimensions per case
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Output appears in each case&apos;s Autopsy &amp; Forensic Analysis panel
              </p>
            </div>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <AnalysisChip icon={ShieldAlert} label="Injury Pattern" />
            <AnalysisChip icon={AlertTriangle} label="Cause of Death" />
            <AnalysisChip icon={HeartPulse} label="Organ Condition" />
            <AnalysisChip icon={Microscope} label="Tissue Pathology" />
            <AnalysisChip icon={NotebookPen} label="Investigation Notes" />
          </ul>
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
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
              <pre className="overflow-auto rounded-md border border-border bg-muted px-4 py-3 font-mono text-[11px] leading-relaxed text-foreground/85">
{`{
  "case_id": "AUT-2025-0001",
  "subject": { "age": 35, "sex": "M", "ethnicity": "African American" },
  "external_examination": [ { "region": "...", "description": "...", "perimortem": true } ],
  "organ_findings": [
    { "organ": "Right lung", "weight_g": 630, "status": "critical", "observations": "..." }
  ],
  "pathology_samples": [
    { "region": "Right pulmonary artery", "finding": "...", "age_estimate": "..." }
  ],
  "cause_of_death": { "primary": "...", "manner": "natural" },
  "investigation_notes": [ { "author": "...", "tag": "observation", "content": "..." } ]
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

function AnalysisChip({ icon: Icon, label }: { icon: typeof Cpu; label: string }) {
  return (
    <li className="flex items-center gap-2 rounded-md border border-border bg-card/70 px-3 py-2">
      <Icon className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
      <span className="text-xs font-medium text-foreground">{label}</span>
    </li>
  )
}
