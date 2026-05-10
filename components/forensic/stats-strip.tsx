"use client"

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ClipboardList, Microscope, Scale, Timer } from "lucide-react"
import type { AutopsyCase } from "@/lib/mock-data"

export function StatsStrip({ data }: { data: AutopsyCase }) {
  const organWeights = data.organFindings
    .filter((o) => typeof o.weightGrams === "number" && (o.weightGrams as number) > 0)
    .map((o) => ({ name: o.organ, grams: o.weightGrams as number }))
    .sort((a, b) => b.grams - a.grams)
    .slice(0, 6)

  const abnormalOrCritical = data.organFindings.filter((o) => o.status !== "normal").length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        icon={Microscope}
        label="Organs Examined"
        value={data.organsExamined.toString()}
        sub={`${abnormalOrCritical} with abnormal findings`}
      />
      <StatCard
        icon={Scale}
        label="Total Organ Weight"
        value={`${data.totalOrganWeightGrams.toLocaleString()} g`}
        sub="Sum of weighed organs"
      >
        <ChartContainer
          config={{ grams: { label: "Grams", color: "var(--primary)" } }}
          className="h-[40px] w-full"
        >
          <BarChart data={organWeights} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="grams" radius={[2, 2, 0, 0]}>
              {organWeights.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={idx === 0 ? "var(--primary)" : idx < 3 ? "var(--chart-2)" : "var(--chart-4)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </StatCard>

      <StatCard
        icon={ClipboardList}
        label="Pulmonary Emboli Identified"
        value={(data.pathology.samples.filter((s) => /embol/i.test(s.finding)).length).toString()}
        sub="Right lung — old + new"
      />
      <StatCard
        icon={Timer}
        label="Resuscitation Duration"
        value={`${data.resuscitationDurationMinutes} min`}
        sub="15:00 arrival → 16:05 pronounced"
      />
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  children,
}: {
  icon: typeof Scale
  label: string
  value: string
  sub: string
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      </div>
      <div className="font-mono text-2xl font-semibold tabular-nums text-foreground">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  )
}
