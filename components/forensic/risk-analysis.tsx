"use client"

import { ShieldAlert, TrendingUp } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { riskTrendData, type ForensicCase } from "@/lib/mock-data"

const riskMeta: Record<string, { label: string; color: string; ring: string }> = {
  low: { label: "LOW", color: "text-[color:var(--risk-low)]", ring: "ring-[color:var(--risk-low)]/40" },
  medium: { label: "MEDIUM", color: "text-[color:var(--risk-medium)]", ring: "ring-[color:var(--risk-medium)]/40" },
  high: { label: "HIGH", color: "text-[color:var(--risk-high)]", ring: "ring-[color:var(--risk-high)]/40" },
  critical: { label: "CRITICAL", color: "text-[color:var(--risk-critical)]", ring: "ring-[color:var(--risk-critical)]/50" },
}

export function RiskAnalysis({ data }: { data: ForensicCase }) {
  const meta = riskMeta[data.riskLevel]
  const stroke =
    data.riskLevel === "high" || data.riskLevel === "critical"
      ? "var(--risk-high)"
      : data.riskLevel === "medium"
        ? "var(--risk-medium)"
        : "var(--risk-low)"

  return (
    <Card className="bg-card/60 border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <ShieldAlert className="h-4 w-4 text-primary" aria-hidden="true" />
          Risk Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "relative flex h-20 w-20 shrink-0 items-center justify-center rounded-md border ring-2 ring-inset",
              meta.ring,
            )}
          >
            <span className={cn("font-mono text-3xl font-semibold tabular-nums", meta.color)}>
              {data.riskScore}
            </span>
            <span className="absolute bottom-1 right-1.5 font-mono text-[9px] text-muted-foreground">
              /100
            </span>
          </div>
          <div className="min-w-0">
            <div className={cn("font-mono text-xs uppercase tracking-wider", meta.color)}>
              {meta.label} RISK
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              <span className="text-[color:var(--risk-high)]">+14</span>
              <span>vs. 24h ago</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${data.riskScore}%`,
                  background: `linear-gradient(to right, var(--risk-low), var(--risk-medium), ${stroke})`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-border bg-secondary/20 p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            7-day risk trajectory
          </div>
          <ChartContainer
            config={{
              score: {
                label: "Risk Score",
                color: stroke,
              },
            }}
            className="h-[100px] w-full"
          >
            <AreaChart data={riskTrendData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
                interval={0}
              />
              <YAxis hide domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke={stroke}
                strokeWidth={1.5}
                fill="url(#riskGradient)"
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Contributing factors
          </div>
          <ul className="space-y-1.5">
            {data.riskReasons.map((reason, idx) => (
              <li key={idx} className="flex gap-2.5 text-xs leading-relaxed text-foreground/80">
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums shrink-0 mt-0.5">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-pretty">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
