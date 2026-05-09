"use client"

import { useState } from "react"
import { Camera, Smartphone, Navigation, AlertTriangle, FileText, MessageSquare, Clock4 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { EventType, ForensicCase } from "@/lib/mock-data"

const eventConfig: Record<EventType, { icon: typeof Camera; label: string; color: string }> = {
  cctv: { icon: Camera, label: "CCTV", color: "text-chart-4" },
  mobile: { icon: Smartphone, label: "Mobile", color: "text-chart-1" },
  gps: { icon: Navigation, label: "GPS", color: "text-chart-2" },
  witness: { icon: MessageSquare, label: "Witness", color: "text-chart-5" },
  forensic: { icon: FileText, label: "Forensic", color: "text-primary" },
}

const filters: { id: EventType | "all"; label: string }[] = [
  { id: "all", label: "All Events" },
  { id: "cctv", label: "CCTV" },
  { id: "mobile", label: "Mobile" },
  { id: "gps", label: "GPS" },
  { id: "witness", label: "Witness" },
  { id: "forensic", label: "Forensic" },
]

export function TimelineView({ data }: { data: ForensicCase }) {
  const [filter, setFilter] = useState<EventType | "all">("all")

  const events =
    filter === "all" ? data.timeline : data.timeline.filter((e) => e.type === filter)

  return (
    <Card className="bg-card/60 border-border">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Clock4 className="h-4 w-4 text-primary" aria-hidden="true" />
            Correlated Event Timeline
            <span className="font-mono text-[11px] text-muted-foreground ml-1">
              · {events.length} of {data.timeline.length}
            </span>
          </CardTitle>
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => (
              <Button
                key={f.id}
                variant={filter === f.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "h-7 px-2.5 text-xs font-mono",
                  filter === f.id
                    ? "bg-primary/15 text-primary hover:bg-primary/20"
                    : "text-muted-foreground",
                )}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="relative">
          {events.map((event, idx) => {
            const cfg = eventConfig[event.type]
            const Icon = cfg.icon
            const isLast = idx === events.length - 1
            return (
              <li key={event.id} className="relative pl-12 pb-5 last:pb-0">
                {!isLast && (
                  <span
                    className="absolute left-[18px] top-9 bottom-0 w-px bg-gradient-to-b from-border to-border/30"
                    aria-hidden="true"
                  />
                )}
                <div
                  className={cn(
                    "absolute left-0 top-0.5 flex h-9 w-9 items-center justify-center rounded-md border bg-card shadow-sm",
                    event.flagged
                      ? "border-[color:var(--risk-high)]/40 bg-[color:var(--risk-high)]/5"
                      : "border-border",
                  )}
                >
                  <Icon
                    className={cn("h-4 w-4", event.flagged ? "text-[color:var(--risk-high)]" : cfg.color)}
                    aria-hidden="true"
                  />
                </div>

                <div
                  className={cn(
                    "rounded-md border bg-secondary/30 px-3.5 py-3 transition-colors hover:bg-secondary/50",
                    event.flagged
                      ? "border-[color:var(--risk-high)]/30"
                      : "border-border",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                    <span className="font-mono text-sm font-medium text-foreground">
                      {event.time}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {event.date}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[10px] uppercase tracking-wider px-1.5 rounded-sm bg-muted",
                        cfg.color,
                      )}
                    >
                      {cfg.label}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground truncate">
                      · {event.source}
                    </span>
                    {event.flagged && (
                      <span className="ml-auto inline-flex items-center gap-1 rounded-sm bg-[color:var(--risk-high)]/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[color:var(--risk-high)]">
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                        Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 text-pretty">
                    {event.description}
                  </p>
                  {event.location && (
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      ↳ {event.location}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
