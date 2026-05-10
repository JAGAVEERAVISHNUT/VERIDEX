"use client"

import { useState } from "react"
import { Activity, Heart, Pill, Skull, Clock4 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AutopsyCase, ResusEventKind } from "@/lib/mock-data"

const kindConfig: Record<ResusEventKind, { icon: typeof Heart; label: string }> = {
  vital: { icon: Heart, label: "Vital" },
  intervention: { icon: Pill, label: "Intervention" },
  deterioration: { icon: Activity, label: "Deterioration" },
  outcome: { icon: Skull, label: "Outcome" },
}

const kindAccent: Record<ResusEventKind, { border: string; text: string; pill: string }> = {
  vital: {
    border: "border-[--color-severity-low]/40",
    text: "text-[--color-severity-medium]",
    pill: "bg-[--color-severity-low]/15 text-[--color-severity-medium]",
  },
  intervention: {
    border: "border-primary/30",
    text: "text-primary",
    pill: "bg-primary/10 text-primary",
  },
  deterioration: {
    border: "border-[--color-severity-medium]/40",
    text: "text-[--color-severity-medium]",
    pill: "bg-[--color-severity-medium]/10 text-[--color-severity-medium]",
  },
  outcome: {
    border: "border-[--color-severity-high]/40",
    text: "text-[--color-severity-high]",
    pill: "bg-[--color-severity-high]/10 text-[--color-severity-high]",
  },
}

const filters: { id: ResusEventKind | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "vital", label: "Vitals" },
  { id: "intervention", label: "Interventions" },
  { id: "deterioration", label: "Deterioration" },
  { id: "outcome", label: "Outcome" },
]

export function TimelineView({ data }: { data: AutopsyCase }) {
  const [filter, setFilter] = useState<ResusEventKind | "all">("all")

  const events =
    filter === "all"
      ? data.resuscitationTimeline
      : data.resuscitationTimeline.filter((e) => e.kind === filter)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock4 className="h-4 w-4 text-primary" aria-hidden="true" />
            Clinical & Resuscitation Timeline
            <span className="font-mono text-[11px] text-muted-foreground ml-1">
              · {events.length} of {data.resuscitationTimeline.length}
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
                  filter === f.id ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground",
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
            const cfg = kindConfig[event.kind]
            const accent = kindAccent[event.kind]
            const Icon = cfg.icon
            const isLast = idx === events.length - 1
            return (
              <li key={event.id} className="relative pl-12 pb-5 last:pb-0">
                {!isLast && (
                  <span
                    className="absolute left-[18px] top-9 bottom-0 w-px bg-border"
                    aria-hidden="true"
                  />
                )}
                <div
                  className={cn(
                    "absolute left-0 top-0.5 flex h-9 w-9 items-center justify-center rounded-md border bg-card",
                    accent.border,
                  )}
                >
                  <Icon className={cn("h-4 w-4", accent.text)} aria-hidden="true" />
                </div>

                <div
                  className={cn(
                    "rounded-md border bg-muted px-3.5 py-3",
                    accent.border,
                  )}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                    <span className="font-mono text-sm font-medium text-foreground">{event.time}</span>
                    <span
                      className={cn(
                        "font-mono text-[10px] uppercase tracking-wider px-1.5 rounded-sm",
                        accent.pill,
                      )}
                    >
                      {cfg.label}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground truncate">· {event.location}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 text-pretty">{event.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
