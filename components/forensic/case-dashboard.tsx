import { CaseHeader } from "@/components/forensic/case-header"
import { SummaryCard } from "@/components/forensic/summary-card"
import { KeyFindings } from "@/components/forensic/key-findings"
import { TimelineView } from "@/components/forensic/timeline-view"
import { StatsStrip } from "@/components/forensic/stats-strip"
import { AutopsyAnalysis } from "@/components/forensic/autopsy-analysis"
import type { AutopsyCase } from "@/lib/mock-data"

export function CaseDashboard({ data }: { data: AutopsyCase }) {
  return (
    <>
      <CaseHeader data={data} />
      <div className="px-4 md:px-6 py-6 space-y-6 max-w-[1600px] mx-auto">
        <StatsStrip data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SummaryCard data={data} />
          </div>
          <div>
            <KeyFindings data={data} />
          </div>
        </div>

        <AutopsyAnalysis data={data} />

        <TimelineView data={data} />

        <footer className="pt-2 pb-6 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Veridex Forensic Intelligence · Case {data.caseId} · Restricted Access · {new Date().getFullYear()}
        </footer>
      </div>
    </>
  )
}
