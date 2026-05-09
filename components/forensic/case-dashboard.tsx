import { CaseHeader } from "@/components/forensic/case-header"
import { SummaryCard } from "@/components/forensic/summary-card"
import { KeyFindings } from "@/components/forensic/key-findings"
import { TimelineView } from "@/components/forensic/timeline-view"
import { AnomalyAlerts } from "@/components/forensic/anomaly-alerts"
import { RiskAnalysis } from "@/components/forensic/risk-analysis"
import { EvidencePanel } from "@/components/forensic/evidence-panel"
import { DataExplorer } from "@/components/forensic/data-explorer"
import { MapCard } from "@/components/forensic/map-card"
import { StatsStrip } from "@/components/forensic/stats-strip"
import type { ForensicCase } from "@/lib/mock-data"

export function CaseDashboard({ data }: { data: ForensicCase }) {
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
            <RiskAnalysis data={data} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <TimelineView data={data} />
            <MapCard data={data} />
          </div>
          <div className="space-y-4">
            <AnomalyAlerts data={data} />
            <KeyFindings data={data} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <EvidencePanel data={data} />
          <DataExplorer data={data} />
        </div>

        <footer className="pt-2 pb-6 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Veridex Forensic Intelligence · Case {data.caseId} · Restricted Access · {new Date().getFullYear()}
        </footer>
      </div>
    </>
  )
}
