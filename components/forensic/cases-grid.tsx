"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { Search, ShieldAlert, Activity, MapPin, User, ArrowUpRight, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { caseList, type CaseSummary } from "@/lib/mock-data"

const riskClasses: Record<string, string> = {
  low: "bg-[color:var(--risk-low)]/15 text-[color:var(--risk-low)] ring-[color:var(--risk-low)]/30",
  medium: "bg-[color:var(--risk-medium)]/15 text-[color:var(--risk-medium)] ring-[color:var(--risk-medium)]/30",
  high: "bg-[color:var(--risk-high)]/15 text-[color:var(--risk-high)] ring-[color:var(--risk-high)]/30",
  critical: "bg-[color:var(--risk-critical)]/20 text-[color:var(--risk-critical)] ring-[color:var(--risk-critical)]/40",
}

const statusClasses: Record<string, string> = {
  active: "bg-primary/15 text-primary ring-primary/30",
  closed: "bg-muted text-muted-foreground ring-border",
  review: "bg-[color:var(--risk-medium)]/15 text-[color:var(--risk-medium)] ring-[color:var(--risk-medium)]/30",
}

const filters: { label: string; value: "all" | CaseSummary["status"] | CaseSummary["riskLevel"] }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Review", value: "review" },
  { label: "Closed", value: "closed" },
  { label: "Critical", value: "critical" },
  { label: "High Risk", value: "high" },
]

export function CasesGrid() {
  const [filter, setFilter] = useState<string>("all")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    return caseList.filter((c) => {
      const matchesQuery =
        !query ||
        c.caseTitle.toLowerCase().includes(query.toLowerCase()) ||
        c.caseId.toLowerCase().includes(query.toLowerCase()) ||
        c.leadInvestigator.toLowerCase().includes(query.toLowerCase())
      const matchesFilter =
        filter === "all" || c.status === filter || c.riskLevel === filter
      return matchesQuery && matchesFilter
    })
  }, [filter, query])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Open Investigations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {caseList.length} cases under analysis ·{" "}
            <span className="font-mono text-[color:var(--risk-high)]">
              {caseList.filter((c) => c.riskLevel === "high" || c.riskLevel === "critical").length} high-priority
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-2.5 py-2 w-full md:w-80">
          <Search className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, IDs, investigators…"
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider ring-1 ring-inset transition-colors",
              filter === f.value
                ? "bg-foreground text-background ring-foreground"
                : "bg-secondary/40 text-muted-foreground ring-border hover:text-foreground hover:bg-secondary",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/40 py-16 text-center">
          <Folder className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">No cases match the current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Link
              key={c.caseId}
              href={`/cases/${c.caseId}`}
              className="group flex flex-col rounded-lg border border-border bg-card/60 p-5 transition-colors hover:border-foreground/30 hover:bg-card"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[11px] tracking-wider text-muted-foreground">
                  {c.caseId}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden="true" />
              </div>

              <h3 className="text-base font-semibold tracking-tight text-balance leading-snug">
                {c.caseTitle}
              </h3>

              <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {c.blurb}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] ring-1 ring-inset",
                    statusClasses[c.status],
                  )}
                >
                  <Activity className="h-3 w-3" aria-hidden="true" />
                  <span className="font-mono uppercase tracking-wide">{c.status}</span>
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] ring-1 ring-inset",
                    riskClasses[c.riskLevel],
                  )}
                >
                  <ShieldAlert className="h-3 w-3" aria-hidden="true" />
                  <span className="font-mono uppercase tracking-wide">
                    {c.riskLevel} · {c.riskScore}
                  </span>
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-3">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3 w-3" aria-hidden="true" />
                  {c.leadInvestigator}
                </span>
                <span className="font-mono">{c.lastUpdated}</span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-secondary/40 px-2 py-1.5">
                  <div className="font-mono text-sm">{c.evidenceCount}</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    Evidence
                  </div>
                </div>
                <div className="rounded-md bg-secondary/40 px-2 py-1.5">
                  <div className="font-mono text-sm text-[color:var(--risk-high)]">
                    {c.anomalyCount}
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    Anomalies
                  </div>
                </div>
                <div className="rounded-md bg-secondary/40 px-2 py-1.5">
                  <div className="font-mono text-sm">{c.subjects}</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    Subjects
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                <span className="truncate">{c.jurisdiction}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full font-mono text-[11px] uppercase tracking-wider"
                  asChild
                >
                  <span>Open Case</span>
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
