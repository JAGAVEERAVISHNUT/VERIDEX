"use client"

import Link from "next/link"
import { Activity, ArrowUpRight, Building2, ClipboardCheck, Stethoscope, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCasesStore } from "@/lib/cases-store"
import type { AutopsyCase, DeathManner } from "@/lib/mock-data"

const mannerStyles: Record<DeathManner, string> = {
  natural: "bg-[--color-severity-low]/15 text-[--color-severity-medium] ring-[--color-severity-low]/40",
  accident: "bg-[--color-severity-medium]/10 text-[--color-severity-medium] ring-[--color-severity-medium]/30",
  suicide: "bg-[--color-severity-medium]/15 text-[--color-severity-medium] ring-[--color-severity-medium]/40",
  homicide: "bg-[--color-severity-high]/10 text-[--color-severity-high] ring-[--color-severity-high]/30",
  undetermined: "bg-muted text-muted-foreground ring-border",
}

const statusStyles: Record<AutopsyCase["status"], string> = {
  active: "bg-primary/10 text-primary ring-primary/25",
  completed: "bg-[--color-severity-low]/15 text-[--color-severity-medium] ring-[--color-severity-low]/40",
  review: "bg-[--color-severity-medium]/10 text-[--color-severity-medium] ring-[--color-severity-medium]/30",
}

export function CasesGrid() {
  const cases: AutopsyCase[] = useCasesStore((s) => s.getAllCases())

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Ingested Cases
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Case Files</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {cases.length} {cases.length === 1 ? "case" : "cases"} under analysis · all data extracted from ingested autopsy documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cases.map((c) => {
          const abnormalOrgans = c.organFindings.filter((o) => o.status !== "normal").length
          return (
            <Link
              key={c.caseId}
              href={`/cases/${c.caseId}`}
              className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[11px] tracking-wider text-muted-foreground">{c.caseId}</span>
                <ArrowUpRight
                  className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>

              <h3 className="text-base font-semibold tracking-tight text-balance leading-snug text-foreground">
                {c.caseTitle}
              </h3>

              <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3 text-pretty">
                {c.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] ring-1 ring-inset",
                    statusStyles[c.status],
                  )}
                >
                  <Activity className="h-3 w-3" aria-hidden="true" />
                  <span className="font-mono uppercase tracking-wide">{c.status}</span>
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] ring-1 ring-inset",
                    mannerStyles[c.manner],
                  )}
                >
                  <ClipboardCheck className="h-3 w-3" aria-hidden="true" />
                  <span className="font-mono uppercase tracking-wide">manner · {c.manner}</span>
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat label="Organs" value={c.organsExamined.toString()} />
                <Stat label="Abnormal" value={abnormalOrgans.toString()} highlight />
                <Stat label="Findings" value={c.keyFindings.length.toString()} />
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-3">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3 w-3" aria-hidden="true" />
                  {c.subject.age} y/o {c.subject.sex.toLowerCase()}
                </span>
                <span className="font-mono">{c.lastUpdated}</span>
              </div>

              <div className="mt-3 grid gap-1.5 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3 w-3" aria-hidden="true" />
                  <span className="truncate">{c.facility}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Stethoscope className="h-3 w-3" aria-hidden="true" />
                  <span className="truncate">{c.examiner}</span>
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full font-mono text-[11px] uppercase tracking-wider"
                  asChild
                >
                  <span>Open Case</span>
                </Button>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md bg-muted px-2 py-1.5">
      <div className={cn("font-mono text-sm tabular-nums", highlight ? "text-primary" : "text-foreground")}>
        {value}
      </div>
      <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  )
}
