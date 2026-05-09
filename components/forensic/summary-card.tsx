import { Sparkles, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ForensicCase } from "@/lib/mock-data"

export function SummaryCard({ data }: { data: ForensicCase }) {
  return (
    <Card className="bg-card/60 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            AI Investigation Summary
          </CardTitle>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Auto-generated · v3.2
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-relaxed text-foreground/90 text-pretty">
          {data.summary}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-md border border-border bg-secondary/30 px-3 py-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Estimated Time of Death
            </div>
            <div className="mt-1 font-mono text-sm text-foreground">
              {data.estimatedTimeOfDeath}
            </div>
          </div>

          <div className="rounded-md border border-border bg-secondary/30 px-3 py-3">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              <span>Confidence Score</span>
              <span className="text-foreground">{data.confidenceScore}%</span>
            </div>
            <Progress
              value={data.confidenceScore}
              className="mt-2 h-1.5 bg-muted"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
