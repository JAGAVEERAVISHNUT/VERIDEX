"use client"

import { useState } from "react"
import {
  Brain,
  Loader2,
  AlertTriangle,
  Link2,
  GaugeCircle,
  Sparkles,
  Clock,
  Camera,
  Smartphone,
  MapPin,
  ShieldAlert,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { ForensicCase } from "@/lib/mock-data"

type Source = "cctv" | "mobile" | "gps" | "other"

interface CorrelationResult {
  timeline: {
    timestamp: string
    source: Source
    location: string
    description: string
    entityId: string | null
  }[]
  correlations: {
    id: string
    sources: Source[]
    description: string
    strength: "weak" | "moderate" | "strong"
    eventIds: string[]
  }[]
  anomalies: {
    id: string
    category: string
    description: string
    severity: "low" | "medium" | "high"
    timestamp: string | null
  }[]
  risk: { score: number; level: "LOW" | "MEDIUM" | "HIGH"; rationale: string }
  summary: string
}

function buildEvents(data: ForensicCase) {
  return {
    caseId: data.caseId,
    cctv: data.cctvLogs.map((c) => ({
      id: c.id,
      timestamp: c.timestamp,
      cameraId: c.cameraId,
      location: c.location,
      duration: c.duration,
      identifiedSubjects: c.identifiedSubjects,
      status: c.status,
    })),
    mobile: data.mobileRecords.map((m) => ({
      id: m.id,
      timestamp: m.timestamp,
      type: m.type,
      contact: m.contact,
      duration: m.duration,
      cellTower: m.cellTower,
      status: m.status,
    })),
    gps: data.gpsPoints.map((g) => ({
      id: g.id,
      timestamp: g.timestamp,
      latitude: g.latitude,
      longitude: g.longitude,
      accuracy: g.accuracy,
      speed: g.speed,
      source: g.source,
    })),
  }
}

const sourceMeta: Record<Source, { icon: typeof Camera; label: string; color: string }> = {
  cctv: { icon: Camera, label: "CCTV", color: "text-chart-1" },
  mobile: { icon: Smartphone, label: "Mobile", color: "text-chart-2" },
  gps: { icon: MapPin, label: "GPS", color: "text-chart-3" },
  other: { icon: ShieldAlert, label: "Other", color: "text-muted-foreground" },
}

function levelTone(level: "LOW" | "MEDIUM" | "HIGH") {
  if (level === "HIGH") return "bg-risk-high/15 text-risk-high border-risk-high/40"
  if (level === "MEDIUM") return "bg-risk-medium/15 text-risk-medium border-risk-medium/40"
  return "bg-risk-low/15 text-risk-low border-risk-low/40"
}

function severityTone(s: "low" | "medium" | "high") {
  if (s === "high") return "bg-risk-high/15 text-risk-high border-risk-high/40"
  if (s === "medium") return "bg-risk-medium/15 text-risk-medium border-risk-medium/40"
  return "bg-risk-low/15 text-risk-low border-risk-low/40"
}

function strengthTone(s: "weak" | "moderate" | "strong") {
  if (s === "strong") return "bg-primary/15 text-primary border-primary/40"
  if (s === "moderate") return "bg-chart-2/15 text-chart-2 border-chart-2/40"
  return "bg-muted text-muted-foreground border-border"
}

export function CorrelationEngine({ data }: { data: ForensicCase }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CorrelationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function run() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/correlate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: buildEvents(data) }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error ?? "Correlation failed")
      setResult(json.result as CorrelationResult)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Correlation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-primary/40 bg-card/80">
      <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <Brain className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">AI Correlation Engine</h3>
              <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
                Live
              </Badge>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              CCTV + Mobile + GPS · Timeline · Anomalies · Risk Score
            </p>
          </div>
        </div>
        <Button onClick={run} disabled={loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Analyzing…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {result ? "Re-run Analysis" : "Run AI Correlation"}
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="m-4 rounded-md border border-risk-high/40 bg-risk-high/10 p-3 text-xs text-risk-high">
          {error}
        </div>
      )}

      {!result && !loading && !error && (
        <div className="p-6 text-center">
          <p className="text-xs text-muted-foreground">
            Sends {data.cctvLogs.length} CCTV + {data.mobileRecords.length} mobile + {data.gpsPoints.length} GPS records
            to the correlation engine. Output is structured per the forensic schema.
          </p>
        </div>
      )}

      {loading && (
        <div className="space-y-3 p-6">
          <PulseRow label="Building chronological timeline" />
          <PulseRow label="Cross-referencing CCTV ↔ Mobile ↔ GPS" />
          <PulseRow label="Detecting anomalies & signal conflicts" />
          <PulseRow label="Computing risk score" />
        </div>
      )}

      {result && (
        <div className="space-y-4 p-4">
          {/* Risk + Summary */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-background/60 p-4 lg:col-span-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  AI Summary
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{result.summary}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/60 p-4">
              <div className="flex items-center gap-2">
                <GaugeCircle className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Risk Score
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-semibold tabular-nums text-foreground">
                  {result.risk.score}
                </span>
                <span className="text-xs text-muted-foreground">/100</span>
                <Badge className={`ml-auto border ${levelTone(result.risk.level)}`}>{result.risk.level}</Badge>
              </div>
              <Progress value={result.risk.score} className="mt-3 h-1.5" />
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{result.risk.rationale}</p>
            </div>
          </div>

          {/* Three columns */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {/* Timeline */}
            <section className="rounded-lg border border-border bg-background/60">
              <div className="flex items-center gap-2 border-b border-border/60 p-3">
                <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Reconstructed Timeline
                </div>
                <Badge variant="outline" className="ml-auto font-mono text-[10px]">
                  {result.timeline.length}
                </Badge>
              </div>
              <ol className="max-h-[420px] divide-y divide-border/60 overflow-y-auto">
                {result.timeline.map((ev, i) => {
                  const meta = sourceMeta[ev.source] ?? sourceMeta.other
                  const Icon = meta.icon
                  return (
                    <li key={i} className="flex gap-3 p-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-card">
                        <Icon className={`h-3.5 w-3.5 ${meta.color}`} aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            {meta.label} · {ev.location}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-foreground/90">{ev.description}</p>
                        <div className="mt-1 font-mono text-[10px] text-muted-foreground">{ev.timestamp}</div>
                      </div>
                    </li>
                  )
                })}
                {result.timeline.length === 0 && (
                  <li className="p-4 text-center text-xs text-muted-foreground">No events extracted.</li>
                )}
              </ol>
            </section>

            {/* Correlations */}
            <section className="rounded-lg border border-border bg-background/60">
              <div className="flex items-center gap-2 border-b border-border/60 p-3">
                <Link2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Cross-Source Correlations
                </div>
                <Badge variant="outline" className="ml-auto font-mono text-[10px]">
                  {result.correlations.length}
                </Badge>
              </div>
              <ul className="max-h-[420px] divide-y divide-border/60 overflow-y-auto">
                {result.correlations.map((c) => (
                  <li key={c.id} className="space-y-2 p-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {c.sources.map((s) => {
                        const m = sourceMeta[s] ?? sourceMeta.other
                        const Icon = m.icon
                        return (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground"
                          >
                            <Icon className={`h-3 w-3 ${m.color}`} aria-hidden="true" />
                            {m.label}
                          </span>
                        )
                      })}
                      <Badge className={`ml-auto border text-[10px] ${strengthTone(c.strength)}`}>{c.strength}</Badge>
                    </div>
                    <p className="text-xs text-foreground/90">{c.description}</p>
                  </li>
                ))}
                {result.correlations.length === 0 && (
                  <li className="p-4 text-center text-xs text-muted-foreground">No correlations identified.</li>
                )}
              </ul>
            </section>

            {/* Anomalies */}
            <section className="rounded-lg border border-border bg-background/60">
              <div className="flex items-center gap-2 border-b border-border/60 p-3">
                <AlertTriangle className="h-3.5 w-3.5 text-risk-medium" aria-hidden="true" />
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Anomalies Detected
                </div>
                <Badge variant="outline" className="ml-auto font-mono text-[10px]">
                  {result.anomalies.length}
                </Badge>
              </div>
              <ul className="max-h-[420px] divide-y divide-border/60 overflow-y-auto">
                {result.anomalies.map((a) => (
                  <li key={a.id} className="space-y-1.5 p-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`border text-[10px] ${severityTone(a.severity)}`}>
                        {a.severity.toUpperCase()}
                      </Badge>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {a.category.replace(/-/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/90">{a.description}</p>
                    {a.timestamp && (
                      <div className="font-mono text-[10px] text-muted-foreground">{a.timestamp}</div>
                    )}
                  </li>
                ))}
                {result.anomalies.length === 0 && (
                  <li className="p-4 text-center text-xs text-muted-foreground">No anomalies flagged.</li>
                )}
              </ul>
            </section>
          </div>
        </div>
      )}
    </Card>
  )
}

function PulseRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-background/60 p-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/30">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" aria-hidden="true" />
      </div>
      <span className="text-xs text-foreground/90">{label}</span>
      <div className="ml-auto h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/2 animate-pulse bg-primary/70" />
      </div>
    </div>
  )
}
