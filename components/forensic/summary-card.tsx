import { FileText, Stethoscope } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AutopsyCase } from "@/lib/mock-data"

export function SummaryCard({ data }: { data: AutopsyCase }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
            Case Summary
          </CardTitle>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Source · ingested autopsy report
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-relaxed text-foreground/90 text-pretty">{data.summary}</p>

        <div className="rounded-md border border-border bg-muted px-4 py-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <Stethoscope className="h-3 w-3" aria-hidden="true" />
            Clinical history
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90 text-pretty">
            {data.clinicalHistory.narrative}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow label="Past medical history" value={data.subject.pastMedicalHistory} />
          <InfoRow
            label="Known risk factors"
            value={data.subject.knownRiskFactors.length ? data.subject.knownRiskFactors.join(", ") : "None documented"}
          />
          <InfoRow label="Presenting complaints" value={data.clinicalHistory.presentingComplaints.join(", ")} />
          <InfoRow label="Resuscitation duration" value={`${data.resuscitationDurationMinutes} min (15:00 → 16:05)`} />
        </div>
      </CardContent>
    </Card>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted px-3 py-2.5">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm text-foreground text-pretty">{value}</div>
    </div>
  )
}
