"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Database, Camera, Smartphone, Navigation, AlertTriangle } from "lucide-react"
import { evidenceVolumeData, type ForensicCase } from "@/lib/mock-data"

const COLORS = [
  "var(--chart-4)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-5)",
  "var(--chart-3)",
]

export function StatsStrip({ data }: { data: ForensicCase }) {
  const total = evidenceVolumeData.reduce((s, d) => s + d.count, 0)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        icon={Database}
        label="Total Evidence Records"
        value={total.toLocaleString()}
        sub={`${data.timeline.length} correlated events`}
      >
        <ChartContainer
          config={{ count: { label: "Records", color: "var(--primary)" } }}
          className="h-[36px] w-full"
        >
          <BarChart data={evidenceVolumeData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <ChartTooltip
              cursor={{ fill: "var(--accent)" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {evidenceVolumeData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </StatCard>

      <StatCard
        icon={Camera}
        label="CCTV Hits"
        value={data.cctvLogs.length.toString()}
        sub={`${data.cctvLogs.filter((c) => c.status === "anomaly").length} flagged anomalies`}
        accent="text-chart-4"
      />

      <StatCard
        icon={Smartphone}
        label="Mobile Records"
        value={data.mobileRecords.length.toString()}
        sub="Cell tower triangulated"
        accent="text-chart-1"
      />

      <StatCard
        icon={AlertTriangle}
        label="Active Anomalies"
        value={data.anomalies.length.toString()}
        sub={`${data.anomalies.filter((a) => a.severity === "high").length} high severity`}
        accent="text-[color:var(--risk-high)]"
      />
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = "text-primary",
  children,
}: {
  icon: typeof Database
  label: string
  value: string
  sub: string
  accent?: string
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className={`h-3.5 w-3.5 ${accent}`} aria-hidden="true" />
      </div>
      <div className="font-mono text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  )
}
