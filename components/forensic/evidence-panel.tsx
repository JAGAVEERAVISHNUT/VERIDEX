"use client"

import { Camera, Smartphone, Navigation, Database, PhoneCall, MessageSquare, Wifi, ArrowDownLeft, ArrowUpRight, PhoneMissed } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ForensicCase, MobileRecord } from "@/lib/mock-data"

const cctvStatusClasses: Record<string, string> = {
  clear: "bg-[color:var(--risk-low)]/15 text-[color:var(--risk-low)]",
  obstructed: "bg-[color:var(--risk-medium)]/15 text-[color:var(--risk-medium)]",
  anomaly: "bg-[color:var(--risk-high)]/15 text-[color:var(--risk-high)]",
}

const mobileTypeIcon: Record<MobileRecord["type"], typeof PhoneCall> = {
  call: PhoneCall,
  sms: MessageSquare,
  data: Wifi,
}

const mobileStatusIcon: Record<MobileRecord["status"], typeof ArrowUpRight> = {
  outgoing: ArrowUpRight,
  incoming: ArrowDownLeft,
  missed: PhoneMissed,
}

export function EvidencePanel({ data }: { data: ForensicCase }) {
  return (
    <Card className="bg-card/60 border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Database className="h-4 w-4 text-primary" aria-hidden="true" />
          Evidence Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cctv">
          <TabsList className="bg-secondary/50 mb-4">
            <TabsTrigger value="cctv" className="gap-1.5 text-xs">
              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
              CCTV
              <span className="font-mono text-[10px] text-muted-foreground ml-0.5">
                {data.cctvLogs.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="gap-1.5 text-xs">
              <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
              Mobile
              <span className="font-mono text-[10px] text-muted-foreground ml-0.5">
                {data.mobileRecords.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="gps" className="gap-1.5 text-xs">
              <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
              GPS
              <span className="font-mono text-[10px] text-muted-foreground ml-0.5">
                {data.gpsPoints.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cctv" className="mt-0 space-y-2">
            {data.cctvLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 rounded-md border border-border bg-secondary/30 px-3 py-2.5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Camera className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-foreground">{log.cameraId}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-xs text-foreground/80 truncate">{log.location}</span>
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
                    {log.timestamp} · {log.duration} · {log.identifiedSubjects} subject(s)
                  </div>
                </div>
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm shrink-0",
                    cctvStatusClasses[log.status],
                  )}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="mobile" className="mt-0 space-y-2">
            {data.mobileRecords.map((rec) => {
              const TypeIcon = mobileTypeIcon[rec.type]
              const StatusIcon = mobileStatusIcon[rec.status]
              return (
                <div
                  key={rec.id}
                  className="flex items-center gap-3 rounded-md border border-border bg-secondary/30 px-3 py-2.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                    <TypeIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
                      <span className="text-xs text-foreground truncate">{rec.contact}</span>
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
                      {rec.timestamp} · Tower {rec.cellTower}
                      {rec.duration ? ` · ${rec.duration}` : ""}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground shrink-0">
                    {rec.type}
                  </span>
                </div>
              )
            })}
          </TabsContent>

          <TabsContent value="gps" className="mt-0">
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-xs">
                <thead className="bg-secondary/50">
                  <tr className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2 text-left">Timestamp</th>
                    <th className="px-3 py-2 text-left">Lat</th>
                    <th className="px-3 py-2 text-left">Lon</th>
                    <th className="px-3 py-2 text-right">Speed</th>
                    <th className="px-3 py-2 text-right">±</th>
                    <th className="px-3 py-2 text-left">Source</th>
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
                      <td className="px-3 py-2 text-foreground">{p.timestamp}</td>
                      <td className="px-3 py-2 text-foreground/80">{p.latitude.toFixed(4)}</td>
                      <td className="px-3 py-2 text-foreground/80">{p.longitude.toFixed(4)}</td>
                      <td className="px-3 py-2 text-right text-foreground/80">{p.speed} km/h</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{p.accuracy}m</td>
                      <td className="px-3 py-2 text-muted-foreground">{p.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
