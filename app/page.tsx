import { TopNav } from "@/components/forensic/top-nav"
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
import { mockCase } from "@/lib/mock-data"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <TopNav />
      <main>
        <CaseHeader data={mockCase} />

        <div className="px-4 md:px-6 py-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Top KPI strip */}
          <StatsStrip data={mockCase} />

          {/* Row 1: Summary + Risk */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <SummaryCard data={mockCase} />
            </div>
            <div>
              <RiskAnalysis data={mockCase} />
            </div>
          </div>

          {/* Row 2: Timeline (wide) + side stack */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <TimelineView data={mockCase} />
              <MapCard data={mockCase} />
            </div>
            <div className="space-y-4">
              <AnomalyAlerts data={mockCase} />
              <KeyFindings data={mockCase} />
            </div>
          </div>

          {/* Row 3: Evidence + Data Explorer */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <EvidencePanel data={mockCase} />
            <DataExplorer data={mockCase} />
          </div>

          <footer className="pt-2 pb-6 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Veridex Forensic Intelligence · Case {mockCase.caseId} · Restricted Access · {new Date().getFullYear()}
          </footer>
        </div>
      </main>
    </div>
  )
}
