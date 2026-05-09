import { Activity, MapPin, ShieldAlert, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ForensicCase } from "@/lib/mock-data"

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

export function CaseHeader({ data }: { data: ForensicCase }) {
  return (
    <div className="border-b border-border bg-card/40">
      <div className="px-4 md:px-6 py-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Case ID
          </span>
          <span className="font-mono text-[11px] text-foreground">{data.caseId}</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono text-[11px] text-muted-foreground">
            Opened {data.openedDate}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono text-[11px] text-muted-foreground">
            Updated {data.lastUpdated}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-balance">
              {data.caseTitle}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {data.jurisdiction}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" aria-hidden="true" />
                {data.leadInvestigator}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                TOD {data.estimatedTimeOfDeath}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                statusClasses[data.status],
              )}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
              </span>
              <Activity className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="uppercase tracking-wide font-mono text-[11px]">
                {data.status}
              </span>
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                riskClasses[data.riskLevel],
              )}
            >
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="uppercase tracking-wide font-mono text-[11px]">
                {data.riskLevel} risk
              </span>
              <span className="font-mono text-[11px] opacity-70">·</span>
              <span className="font-mono text-[11px]">{data.riskScore}/100</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
