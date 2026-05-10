import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AutopsyCase, Severity } from "@/lib/mock-data"

const dotClasses: Record<Severity, string> = {
  high: "bg-[--color-severity-high]",
  medium: "bg-[--color-severity-medium]",
  low: "bg-[--color-severity-low]",
}

const labelClasses: Record<Severity, string> = {
  high: "bg-[--color-severity-high]/10 text-[--color-severity-high]",
  medium: "bg-[--color-severity-medium]/10 text-[--color-severity-medium]",
  low: "bg-[--color-severity-low]/15 text-[--color-severity-low]",
}

export function KeyFindings({ data }: { data: AutopsyCase }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Search className="h-4 w-4 text-primary" aria-hidden="true" />
          Key Findings
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
            {data.keyFindings.length} extracted
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {data.keyFindings.map((finding, idx) => (
            <li key={finding.id} className="flex gap-3">
              <div className="flex flex-col items-center pt-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[finding.weight])} />
                {idx < data.keyFindings.length - 1 && <span className="w-px flex-1 bg-border mt-1" />}
              </div>
              <div className="flex-1 pb-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Finding {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-wider px-1.5 rounded-sm",
                      labelClasses[finding.weight],
                    )}
                  >
                    {finding.weight}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90 text-pretty">{finding.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
