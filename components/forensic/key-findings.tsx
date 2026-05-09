import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ForensicCase } from "@/lib/mock-data"

const weightClasses: Record<string, string> = {
  high: "bg-[color:var(--risk-high)]",
  medium: "bg-[color:var(--risk-medium)]",
  low: "bg-[color:var(--risk-low)]",
}

const HIGHLIGHT_REGEX =
  /\b(\d{1,2}:\d{2}|\d+(?:\.\d+)?\s?(?:km|m|°C|ng\/mL|%)|TOD|burner|stationary|GPS|CCTV|zolpidem|unidentified|contradicting|contradicts|forced entry|deliberately)\b/gi

function highlightText(text: string) {
  const parts = text.split(HIGHLIGHT_REGEX)
  return parts.map((part, i) =>
    HIGHLIGHT_REGEX.test(part) ? (
      <mark
        key={i}
        className="bg-primary/15 text-primary font-medium rounded-sm px-0.5"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

export function KeyFindings({ data }: { data: ForensicCase }) {
  return (
    <Card className="bg-card/60 border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Search className="h-4 w-4 text-primary" aria-hidden="true" />
          Key Findings
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
            {data.findings.length} insights
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {data.findings.map((finding, idx) => (
            <li key={finding.id} className="flex gap-3 group">
              <div className="flex flex-col items-center pt-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full ring-2 ring-offset-2 ring-offset-card",
                    weightClasses[finding.weight],
                  )}
                  style={{ ["--tw-ring-color" as string]: "transparent" }}
                />
                {idx < data.findings.length - 1 && (
                  <span className="w-px flex-1 bg-border mt-1" />
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Finding {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-wider px-1.5 rounded-sm",
                      finding.weight === "high" &&
                        "bg-[color:var(--risk-high)]/15 text-[color:var(--risk-high)]",
                      finding.weight === "medium" &&
                        "bg-[color:var(--risk-medium)]/15 text-[color:var(--risk-medium)]",
                      finding.weight === "low" &&
                        "bg-[color:var(--risk-low)]/15 text-[color:var(--risk-low)]",
                    )}
                  >
                    {finding.weight}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90 text-pretty">
                  {highlightText(finding.text)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
