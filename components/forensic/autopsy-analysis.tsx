"use client"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  HeartPulse,
  Microscope,
  NotebookPen,
  Sparkles,
  FileText,
  ShieldAlert,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type {
  AnalysisSection,
  DeathManner,
  ForensicCase,
  InjurySeverity,
  OrganStatus,
  PathologySeverity,
} from "@/lib/mock-data"

type TabKey = "injury" | "cause" | "organ" | "tissue" | "notes"

const TABS: { key: TabKey; label: string; icon: typeof Activity }[] = [
  { key: "injury", label: "Injury Pattern", icon: ShieldAlert },
  { key: "cause", label: "Cause of Death", icon: AlertTriangle },
  { key: "organ", label: "Organ Condition", icon: HeartPulse },
  { key: "tissue", label: "Tissue Pathology", icon: Microscope },
  { key: "notes", label: "Investigation Notes", icon: NotebookPen },
]

const injurySeverityStyles: Record<InjurySeverity, string> = {
  minor: "bg-muted text-muted-foreground border-border",
  moderate: "bg-[color:var(--risk-low)]/15 text-[color:var(--risk-low)] border-[color:var(--risk-low)]/30",
  severe: "bg-[color:var(--risk-medium)]/15 text-[color:var(--risk-medium)] border-[color:var(--risk-medium)]/30",
  fatal: "bg-[color:var(--risk-high)]/15 text-[color:var(--risk-high)] border-[color:var(--risk-high)]/30",
}

const organStatusStyles: Record<OrganStatus, { label: string; className: string }> = {
  normal: {
    label: "Normal",
    className: "bg-[color:var(--risk-low)]/15 text-[color:var(--risk-low)] border-[color:var(--risk-low)]/30",
  },
  abnormal: {
    label: "Abnormal",
    className: "bg-[color:var(--risk-medium)]/15 text-[color:var(--risk-medium)] border-[color:var(--risk-medium)]/30",
  },
  damaged: {
    label: "Damaged",
    className: "bg-[color:var(--risk-medium)]/20 text-[color:var(--risk-medium)] border-[color:var(--risk-medium)]/40",
  },
  critical: {
    label: "Critical",
    className: "bg-[color:var(--risk-high)]/15 text-[color:var(--risk-high)] border-[color:var(--risk-high)]/30",
  },
}

const pathologySeverityStyles: Record<PathologySeverity, string> = {
  low: "bg-[color:var(--risk-low)]/15 text-[color:var(--risk-low)] border-[color:var(--risk-low)]/30",
  medium: "bg-[color:var(--risk-medium)]/15 text-[color:var(--risk-medium)] border-[color:var(--risk-medium)]/30",
  high: "bg-[color:var(--risk-high)]/15 text-[color:var(--risk-high)] border-[color:var(--risk-high)]/30",
}

const mannerStyles: Record<DeathManner, string> = {
  natural: "bg-[color:var(--risk-low)]/15 text-[color:var(--risk-low)] border-[color:var(--risk-low)]/30",
  accident: "bg-[color:var(--risk-medium)]/15 text-[color:var(--risk-medium)] border-[color:var(--risk-medium)]/30",
  suicide: "bg-[color:var(--risk-medium)]/20 text-[color:var(--risk-medium)] border-[color:var(--risk-medium)]/40",
  homicide: "bg-[color:var(--risk-high)]/15 text-[color:var(--risk-high)] border-[color:var(--risk-high)]/30",
  undetermined: "bg-muted text-muted-foreground border-border",
}

const noteTagStyles: Record<NonNullable<AnalysisSection["investigationNotes"]["notes"][number]["tag"]>, string> = {
  observation: "bg-primary/15 text-primary border-primary/30",
  hypothesis: "bg-[color:var(--risk-medium)]/15 text-[color:var(--risk-medium)] border-[color:var(--risk-medium)]/30",
  "follow-up": "bg-muted text-muted-foreground border-border",
  conclusion: "bg-[color:var(--risk-high)]/15 text-[color:var(--risk-high)] border-[color:var(--risk-high)]/30",
}

function Sources({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Extracted from</span>
      {items.map((src) => (
        <span
          key={src}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
        >
          <FileText className="h-3 w-3" aria-hidden="true" />
          {src}
        </span>
      ))}
    </div>
  )
}

function SectionSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-primary/20 bg-primary/5 p-3.5">
      <div className="mb-1.5 flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-primary">AI Synthesis</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 text-pretty">{children}</p>
    </div>
  )
}

function InjuryPanel({ data }: { data: AnalysisSection["injuryPattern"] }) {
  return (
    <div className="space-y-4">
      <SectionSummary>{data.summary}</SectionSummary>

      <div className="grid gap-2.5">
        {data.findings.map((f) => (
          <div
            key={f.id}
            className="rounded-md border border-border bg-secondary/30 p-3.5 transition-colors hover:bg-secondary/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">{f.region}</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">{f.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>Mechanism · {f.mechanism}</span>
                  <span aria-hidden="true">·</span>
                  <span>{f.perimortem ? "Peri-mortem" : "Pre-mortem"}</span>
                </div>
              </div>
              <Badge variant="outline" className={cn("shrink-0 capitalize", injurySeverityStyles[f.severity])}>
                {f.severity}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-border bg-card p-3.5">
        <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Overall Assessment
        </div>
        <p className="text-sm leading-relaxed text-foreground/90 text-pretty">{data.overallAssessment}</p>
      </div>

      <Sources items={data.extractedFrom} />
    </div>
  )
}

function CausePanel({ data }: { data: AnalysisSection["causeOfDeath"] }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2 rounded-md border border-border bg-secondary/30 p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Primary cause</div>
          <div className="mt-1 text-base font-semibold text-foreground text-balance">{data.primary}</div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Mechanism</div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">{data.mechanism}</p>
        </div>

        <div className="rounded-md border border-border bg-secondary/30 p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Manner of death</div>
          <Badge variant="outline" className={cn("mt-1.5 capitalize", mannerStyles[data.manner])}>
            {data.manner}
          </Badge>

          <div className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            AI confidence
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-semibold text-foreground tabular-nums">{data.confidence}</span>
            <span className="font-mono text-xs text-muted-foreground">/100</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.max(0, Math.min(100, data.confidence))}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Contributing factors
        </div>
        <ul className="grid gap-2">
          {data.contributing.map((c, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground/90"
            >
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span className="text-pretty">{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <SectionSummary>{data.reasoning}</SectionSummary>

      <Sources items={data.extractedFrom} />
    </div>
  )
}

function OrganPanel({ data }: { data: AnalysisSection["organCondition"] }) {
  return (
    <div className="space-y-4">
      <SectionSummary>{data.summary}</SectionSummary>

      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 text-left font-medium">Organ</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-right font-medium">Weight</th>
              <th className="px-3 py-2 text-left font-medium">Observations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.findings.map((f) => {
              const style = organStatusStyles[f.status]
              return (
                <tr key={f.id} className="bg-card/40 hover:bg-secondary/30">
                  <td className="px-3 py-2.5 font-medium text-foreground align-top">{f.organ}</td>
                  <td className="px-3 py-2.5 align-top">
                    <Badge variant="outline" className={cn("text-xs", style.className)}>
                      {style.label}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-xs text-muted-foreground tabular-nums align-top">
                    {f.weightGrams ? `${f.weightGrams} g` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-xs leading-relaxed text-muted-foreground text-pretty">
                    {f.observations}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Sources items={data.extractedFrom} />
    </div>
  )
}

function TissuePanel({ data }: { data: AnalysisSection["tissuePathology"] }) {
  return (
    <div className="space-y-4">
      <SectionSummary>{data.summary}</SectionSummary>

      <div className="grid gap-2.5">
        {data.samples.map((s) => (
          <div key={s.id} className="rounded-md border border-border bg-secondary/30 p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">{s.sample}</div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.technique}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground text-pretty">{s.finding}</p>
              </div>
              <Badge variant="outline" className={cn("shrink-0 capitalize", pathologySeverityStyles[s.severity])}>
                {s.severity}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <Sources items={data.extractedFrom} />
    </div>
  )
}

function NotesPanel({ data }: { data: AnalysisSection["investigationNotes"] }) {
  return (
    <div className="space-y-4">
      <SectionSummary>{data.summary}</SectionSummary>

      <ol className="relative space-y-3 border-l border-border pl-5">
        {data.notes.map((n) => (
          <li key={n.id} className="relative">
            <span
              className="absolute -left-[26px] top-1.5 inline-block h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background"
              aria-hidden="true"
            />
            <div className="rounded-md border border-border bg-secondary/30 p-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-foreground">{n.author}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{n.role}</span>
                {n.tag && (
                  <Badge variant="outline" className={cn("capitalize text-[10px]", noteTagStyles[n.tag])}>
                    {n.tag}
                  </Badge>
                )}
                <span className="ml-auto font-mono text-[10px] text-muted-foreground tabular-nums">{n.timestamp}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90 text-pretty">{n.content}</p>
            </div>
          </li>
        ))}
      </ol>

      <Sources items={data.extractedFrom} />
    </div>
  )
}

export function AutopsyAnalysis({ data }: { data: ForensicCase }) {
  const [active, setActive] = useState<TabKey>("injury")
  const analysis = data.analysis
  if (!analysis) return null

  return (
    <Card className="border-border bg-card/60">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
              <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Autopsy &amp; Forensic Analysis
              </CardTitle>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                AI-extracted from ingested reports
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="self-start border-primary/30 bg-primary/10 text-primary font-mono text-[10px] uppercase tracking-wider"
          >
            <Sparkles className="mr-1 h-3 w-3" aria-hidden="true" />
            Veridex AI · v2.4
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div
          role="tablist"
          aria-label="Forensic analysis sections"
          className="flex flex-wrap gap-1.5 rounded-md border border-border bg-secondary/30 p-1"
        >
          {TABS.map((t) => {
            const Icon = t.icon
            const isActive = active === t.key
            return (
              <button
                key={t.key}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActive(t.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {t.label}
              </button>
            )
          })}
        </div>

        <div role="tabpanel">
          {active === "injury" && <InjuryPanel data={analysis.injuryPattern} />}
          {active === "cause" && <CausePanel data={analysis.causeOfDeath} />}
          {active === "organ" && <OrganPanel data={analysis.organCondition} />}
          {active === "tissue" && <TissuePanel data={analysis.tissuePathology} />}
          {active === "notes" && <NotesPanel data={analysis.investigationNotes} />}
        </div>
      </CardContent>
    </Card>
  )
}
