"use client"

import { useState } from "react"
import { FolderOpen, Stethoscope, Database, MapPin, Code2, Table2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ForensicCase } from "@/lib/mock-data"

const severityClasses: Record<string, string> = {
  minor: "bg-[color:var(--risk-low)]/15 text-[color:var(--risk-low)]",
  moderate: "bg-[color:var(--risk-medium)]/15 text-[color:var(--risk-medium)]",
  significant: "bg-[color:var(--risk-high)]/15 text-[color:var(--risk-high)]",
}

const toxStatusClasses: Record<string, string> = {
  expected: "text-muted-foreground",
  unexpected: "text-[color:var(--risk-high)]",
}

export function DataExplorer({ data }: { data: ForensicCase }) {
  const [view, setView] = useState<"table" | "json">("table")

  return (
    <Card className="bg-card/60 border-border">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <FolderOpen className="h-4 w-4 text-primary" aria-hidden="true" />
            Data Explorer
            <span className="ml-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Raw structured datasets
            </span>
          </CardTitle>
          <div className="flex rounded-md border border-border p-0.5 bg-secondary/40">
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "h-6 px-2 text-[11px] font-mono",
                view === "table" ? "bg-primary/15 text-primary" : "text-muted-foreground",
              )}
              onClick={() => setView("table")}
            >
              <Table2 className="h-3 w-3 mr-1" />
              Table
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "h-6 px-2 text-[11px] font-mono",
                view === "json" ? "bg-primary/15 text-primary" : "text-muted-foreground",
              )}
              onClick={() => setView("json")}
            >
              <Code2 className="h-3 w-3 mr-1" />
              JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="autopsy">
          <TabsList className="bg-secondary/50 mb-4">
            <TabsTrigger value="autopsy" className="gap-1.5 text-xs">
              <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
              Autopsy Data
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-1.5 text-xs">
              <Database className="h-3.5 w-3.5" aria-hidden="true" />
              Event Dataset
            </TabsTrigger>
            <TabsTrigger value="locations" className="gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Location Dataset
            </TabsTrigger>
          </TabsList>

          {/* AUTOPSY */}
          <TabsContent value="autopsy" className="mt-0">
            {view === "table" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Body Temperature" value={data.autopsy.bodyTemperature} />
                  <Field label="Rigor Mortis" value={data.autopsy.rigorMortis} />
                  <Field label="Livor Mortis" value={data.autopsy.livorMortis} />
                  <Field label="Estimated TOD" value={data.autopsy.estimatedTOD} />
                  <Field label="Cause of Death" value={data.autopsy.causeOfDeath} />
                  <Field label="Manner" value={data.autopsy.manner} />
                  <Field label="Examiner" value={data.autopsy.examiner} />
                  <Field label="Examination Date" value={data.autopsy.examinationDate} />
                </div>

                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                    Injuries
                  </div>
                  <div className="overflow-hidden rounded-md border border-border">
                    <table className="w-full text-xs">
                      <thead className="bg-secondary/50">
                        <tr className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          <th className="px-3 py-2 text-left">Region</th>
                          <th className="px-3 py-2 text-left">Description</th>
                          <th className="px-3 py-2 text-left">Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.autopsy.injuries.map((inj, idx) => (
                          <tr
                            key={idx}
                            className={cn("border-t border-border/60", idx % 2 === 1 && "bg-secondary/20")}
                          >
                            <td className="px-3 py-2 font-mono text-foreground">{inj.region}</td>
                            <td className="px-3 py-2 text-foreground/80">{inj.description}</td>
                            <td className="px-3 py-2">
                              <span
                                className={cn(
                                  "font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm",
                                  severityClasses[inj.severity],
                                )}
                              >
                                {inj.severity}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                    Toxicology Panel
                  </div>
                  <div className="overflow-hidden rounded-md border border-border">
                    <table className="w-full text-xs">
                      <thead className="bg-secondary/50">
                        <tr className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          <th className="px-3 py-2 text-left">Substance</th>
                          <th className="px-3 py-2 text-left">Level</th>
                          <th className="px-3 py-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.autopsy.toxicology.map((tox, idx) => (
                          <tr
                            key={idx}
                            className={cn("border-t border-border/60", idx % 2 === 1 && "bg-secondary/20")}
                          >
                            <td className="px-3 py-2 font-mono text-foreground">{tox.substance}</td>
                            <td className="px-3 py-2 font-mono text-foreground/80">{tox.level}</td>
                            <td
                              className={cn(
                                "px-3 py-2 font-mono text-[11px] uppercase tracking-wider",
                                toxStatusClasses[tox.status],
                              )}
                            >
                              {tox.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <JsonView data={data.autopsy} />
            )}
          </TabsContent>

          {/* EVENTS */}
          <TabsContent value="events" className="mt-0">
            {view === "table" ? (
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-xs min-w-[640px]">
                  <thead className="bg-secondary/50">
                    <tr className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-3 py-2 text-left">Timestamp (UTC)</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Source</th>
                      <th className="px-3 py-2 text-left">Location</th>
                      <th className="px-3 py-2 text-left">Entity ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.timeline.map((e, idx) => (
                      <tr
                        key={e.id}
                        className={cn(
                          "border-t border-border/60 font-mono",
                          idx % 2 === 1 && "bg-secondary/20",
                          e.flagged && "bg-[color:var(--risk-high)]/5",
                        )}
                      >
                        <td className="px-3 py-2 text-foreground">{e.timestamp}</td>
                        <td className="px-3 py-2 text-foreground/80 uppercase text-[11px]">{e.type}</td>
                        <td className="px-3 py-2 text-foreground/80">{e.source}</td>
                        <td className="px-3 py-2 text-muted-foreground truncate max-w-[200px]">
                          {e.location ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{e.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <JsonView data={data.timeline} />
            )}
          </TabsContent>

          {/* LOCATIONS */}
          <TabsContent value="locations" className="mt-0">
            {view === "table" ? (
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-secondary/50">
                    <tr className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-3 py-2 text-left">Latitude</th>
                      <th className="px-3 py-2 text-left">Longitude</th>
                      <th className="px-3 py-2 text-left">Timestamp</th>
                      <th className="px-3 py-2 text-right">Speed</th>
                      <th className="px-3 py-2 text-right">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.gpsPoints.map((p, idx) => (
                      <tr
                        key={p.id}
                        className={cn(
                          "border-t border-border/60 font-mono",
                          idx % 2 === 1 && "bg-secondary/20",
                        )}
                      >
                        <td className="px-3 py-2 text-foreground">{p.latitude.toFixed(6)}</td>
                        <td className="px-3 py-2 text-foreground">{p.longitude.toFixed(6)}</td>
                        <td className="px-3 py-2 text-foreground/80">{p.timestamp}</td>
                        <td className="px-3 py-2 text-right text-foreground/80">{p.speed} km/h</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">±{p.accuracy}m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <JsonView data={data.gpsPoints} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-secondary/30 px-3 py-2.5">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-xs text-foreground/90">{value}</div>
    </div>
  )
}

function JsonView({ data }: { data: unknown }) {
  return (
    <pre className="overflow-auto max-h-[420px] rounded-md border border-border bg-[oklch(0.13_0.005_260)] px-4 py-3 font-mono text-[11px] leading-relaxed text-foreground/90">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}
