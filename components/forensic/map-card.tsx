"use client"

import dynamic from "next/dynamic"
import { Map as MapIcon, Navigation } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ForensicCase } from "@/lib/mock-data"

const MapView = dynamic(() => import("./map-view"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-card">
      <div className="text-xs font-mono text-muted-foreground">Loading geo-trace…</div>
    </div>
  ),
})

export function MapCard({ data }: { data: ForensicCase }) {
  return (
    <Card className="bg-card/60 border-border overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <MapIcon className="h-4 w-4 text-primary" aria-hidden="true" />
            Geo-Trace · Movement Path
          </CardTitle>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Vehicle Telemetry
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[color:var(--risk-high)]" />
              Stationary Anomaly
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Navigation className="h-3 w-3" />
              {data.gpsPoints.length} pts
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative h-[320px] w-full overflow-hidden rounded-md border border-border">
          <MapView points={data.gpsPoints} />
          <div className="pointer-events-none absolute top-2 left-2 rounded-sm bg-card/90 backdrop-blur px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border">
            Riverside District · 14–15 Mar 2025
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
