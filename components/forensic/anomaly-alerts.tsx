import { AlertTriangle, Clock, MapPin, Brain, Scale } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AnomalyType, ForensicCase } from "@/lib/mock-data"

const anomalyConfig: Record<AnomalyType, { icon: typeof Clock; label: string }> = {
  time: { icon: Clock, label: "Time Anomaly" },
  location: { icon: MapPin, label: "Location Anomaly" },
  behavioral: { icon: Brain, label: "Behavioral Anomaly" },
  contradiction: { icon: Scale, label: "Contradiction" },
}

const severityClasses: Record<string, string> = {
  high: "border-[color:var(--risk-high)]/40 bg-[color:var(--risk-high)]/5",
  medium: "border-[color:var(--risk-medium)]/40 bg-[color:var(--risk-medium)]/5",
  low: "border-[color:var(--risk-low)]/40 bg-[color:var(--risk-low)]/5",
}

const severityBadge: Record<string, string> = {
  high: "bg-[color:var(--risk-high)]/20 text-[color:var(--risk-high)]",
  medium: "bg-[color:var(--risk-medium)]/20 text-[color:var(--risk-medium)]",
  low: "bg-[color:var(--risk-low)]/20 text-[color:var(--risk-low)]",
}

const severityIcon: Record<string, string> = {
  high: "text-[color:var(--risk-high)]",
  medium: "text-[color:var(--risk-medium)]",
  low: "text-[color:var(--risk-low)]",
}

export function AnomalyAlerts({ data }: { data: ForensicCase }) {
  const highCount = data.anomalies.filter((a) => a.severity === "high").length
  const mediumCount = data.anomalies.filter((a) => a.severity === "medium").length

  return (
    <Card className="bg-card/60 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 text-[color:var(--risk-high)]" aria-hidden="true" />
            Anomaly Alerts
          </CardTitle>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-[color:var(--risk-high)]">{highCount} high</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-[color:var(--risk-medium)]">{mediumCount} med</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {data.anomalies.map((anomaly) => {
            const cfg = anomalyConfig[anomaly.type]
            const Icon = cfg.icon
            return (
              <li
                key={anomaly.id}
                className={cn(
                  "rounded-md border px-3.5 py-3",
                  severityClasses[anomaly.severity],
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <Icon
                      className={cn("h-4 w-4", severityIcon[anomaly.severity])}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-foreground">
                        {anomaly.title}
                      </h3>
                      <span
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-wider px-1.5 rounded-sm",
                          severityBadge[anomaly.severity],
                        )}
                      >
                        {anomaly.severity}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
                      {anomaly.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Linked:
                      </span>
                      {anomaly.relatedEvents.map((id) => (
                        <span
                          key={id}
                          className="font-mono text-[10px] rounded-sm bg-muted px-1.5 py-0.5 text-muted-foreground"
                        >
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
