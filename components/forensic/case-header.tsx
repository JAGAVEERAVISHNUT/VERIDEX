import { Activity, Building2, ClipboardCheck, Clock, Stethoscope, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AutopsyCase, DeathManner } from "@/lib/mock-data"

const mannerStyles: Record<DeathManner, string> = {
  natural: "bg-[--color-severity-low]/15 text-[--color-severity-low] ring-[--color-severity-low]/30",
  accident: "bg-[--color-severity-medium]/15 text-[--color-severity-medium] ring-[--color-severity-medium]/30",
  suicide: "bg-[--color-severity-medium]/20 text-[--color-severity-medium] ring-[--color-severity-medium]/40",
  homicide: "bg-[--color-severity-high]/15 text-[--color-severity-high] ring-[--color-severity-high]/30",
  undetermined: "bg-muted text-muted-foreground ring-border",
}

const statusStyles: Record<string, string> = {
  active: "bg-primary/10 text-primary ring-primary/25",
  completed: "bg-[--color-severity-low]/15 text-[--color-severity-medium] ring-[--color-severity-medium]/30",
  review: "bg-[--color-severity-medium]/15 text-[--color-severity-medium] ring-[--color-severity-medium]/30",
}

export function CaseHeader({ data }: { data: AutopsyCase }) {
  return (
    <div className="border-b border-border bg-card">
      <div className="px-4 md:px-6 py-6 max-w-[1600px] mx-auto">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Case ID
          </span>
          <span className="font-mono text-[11px] text-foreground">{data.caseId}</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="font-mono text-[11px] text-muted-foreground">Opened {data.openedDate}</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="font-mono text-[11px] text-muted-foreground">Updated {data.lastUpdated}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-balance text-foreground">
              {data.caseTitle}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" aria-hidden="true" />
                {data.subject.age} y/o {data.subject.ethnicity} {data.subject.sex.toLowerCase()}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                {data.facility}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
                {data.examiner}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Pronounced {data.pronouncedAt}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                statusStyles[data.status],
              )}
            >
              <Activity className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="uppercase tracking-wide font-mono text-[11px]">{data.status}</span>
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                mannerStyles[data.manner],
              )}
            >
              <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="uppercase tracking-wide font-mono text-[11px]">manner · {data.manner}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
