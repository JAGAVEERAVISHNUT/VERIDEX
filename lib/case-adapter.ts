/**
 * lib/case-adapter.ts
 * Converts the API's FullCase format into the ForensicCase format
 * expected by the existing dashboard UI components.
 */

import type { FullCase, ForensicAnalysis } from "@/lib/api-client"
import type { ForensicCase, TimelineEvent, Anomaly } from "@/lib/mock-data"

function riskLevelToUi(level: string): "low" | "medium" | "high" | "critical" {
  if (level === "critical") return "critical"
  if (level === "high") return "high"
  if (level === "medium") return "medium"
  if (level === "insufficient_data") return "low"
  return "low"
}

function apiEventToUi(ev: Record<string, unknown>, idx: number): TimelineEvent {
  const ts = String(ev.timestamp || "")
  const dt = ts ? new Date(ts) : null
  return {
    id: String(ev.id || `e${idx}`),
    timestamp: ts,
    time: dt ? dt.toTimeString().slice(0, 5) : "--:--",
    date: dt ? dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "",
    type: (String(ev.event_type || "forensic")) as TimelineEvent["type"],
    source: String(ev.source || ""),
    description: String(ev.description || ""),
    location: String(ev.location || ""),
    flagged: Boolean(ev.flagged),
  }
}

function apiAnomalyToUi(a: Record<string, unknown>, idx: number): Anomaly {
  return {
    id: String(a.id || `a${idx}`),
    type: (String(a.type || "time")) as Anomaly["type"],
    severity: (String(a.severity || "medium")) as Anomaly["severity"],
    title: String(a.title || "Anomaly"),
    description: String(a.description || ""),
    relatedEvents: Array.isArray(a.related_events) ? a.related_events.map(String) : [],
  }
}

export function apiCaseToForensicCase(apiCase: FullCase): ForensicCase {
  const analysis = apiCase.analysis as ForensicAnalysis | null
  const autopsy = apiCase.autopsy

  const timeline: TimelineEvent[] = analysis?.timeline?.sorted_events
    ? analysis.timeline.sorted_events.map((ev, i) => apiEventToUi(ev as Record<string, unknown>, i))
    : apiCase.events.map((ev, i) => apiEventToUi(ev as Record<string, unknown>, i))

  const anomalies: Anomaly[] = analysis?.anomalies
    ? analysis.anomalies.map((a, i) => apiAnomalyToUi(a as Record<string, unknown>, i))
    : []

  const riskLevel = riskLevelToUi(analysis?.risk?.risk_level || "low")
  const riskScore = analysis?.risk?.risk_score ?? 0
  const confidenceScore = analysis?.confidence?.confidence_score ?? 0

  const findings = [
    ...(analysis?.contradictions || []).map((c, i) => ({
      id: String((c as Record<string, unknown>).id || `cf${i}`),
      text: String((c as Record<string, unknown>).description || (c as Record<string, unknown>).note || ""),
      weight: "high" as const,
    })).filter((f) => f.text),
    ...(analysis?.risk?.reasons || []).map((r, i) => ({
      id: `rr${i}`,
      text: r,
      weight: "medium" as const,
    })),
    ...(analysis?.time_of_death?.reasoning || []).map((r, i) => ({
      id: `tr${i}`,
      text: r,
      weight: "low" as const,
    })),
  ]

  return {
    caseId: apiCase.case_id,
    caseTitle: apiCase.case_title,
    status: (apiCase.status as "active" | "closed" | "review") || "active",
    riskLevel,
    riskScore,
    confidenceScore,
    estimatedTimeOfDeath: analysis?.time_of_death?.estimated_window ?? "Insufficient data to determine",
    jurisdiction: "VERIDEX Forensic Intelligence",
    leadInvestigator: "System Analysis",
    openedDate: new Date(apiCase.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    lastUpdated: new Date(apiCase.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    summary: apiCase.summary ?? "Analysis not yet run. Upload evidence and process the case.",
    findings: findings.length > 0 ? findings : [{
      id: "f0",
      text: "No findings extracted yet. Run forensic analysis to generate findings.",
      weight: "low",
    }],
    timeline,
    anomalies,
    riskReasons: analysis?.risk?.reasons ?? [],
    cctvLogs: [],
    mobileRecords: [],
    gpsPoints: [],
    autopsy: {
      bodyTemperature: autopsy?.body_temperature ?? "Not provided",
      rigorMortis: autopsy?.rigor_mortis ?? "Not provided",
      livorMortis: autopsy?.livor_mortis ?? "Not provided",
      estimatedTOD: analysis?.time_of_death?.estimated_window ?? "Insufficient data",
      causeOfDeath: autopsy?.cause_of_death ?? "Not provided",
      manner: "Under investigation",
      injuries: [],
      toxicology: autopsy?.toxicity
        ? [{ substance: "Toxicology findings", level: autopsy.toxicity, status: "reported" }]
        : [],
      examiner: "Forensic Examiner",
      examinationDate: apiCase.updated_at,
    },
  }
}
