/**
 * api-client.ts
 * Typed API client for the VERIDEX backend.
 * All requests go to http://localhost:8001
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }))
    throw new ApiError(res.status, body.detail ?? "Unknown error")
  }
  return res.json() as Promise<T>
}

// ── Case Types ───────────────────────────────────────────────────────────────

export interface CaseSummaryApi {
  case_id: string
  case_title: string
  status: "active" | "review" | "closed"
  created_at: string
  updated_at: string
  has_autopsy: boolean
  event_count: number
  has_analysis: boolean
  risk_level: string | null
  risk_score: number | null
  confidence_score: number | null
}

export interface AutopsyData {
  case_id: string | null
  body_temperature: string | null
  rigor_mortis: string | null
  livor_mortis: string | null
  decomposition_stage: string | null
  cause_of_death: string | null
  toxicity: string | null
  source_file?: string
  raw_text_preview?: string
}

export interface UnifiedEvent {
  id: string
  case_id: string
  timestamp: string
  event_type: string
  source: string
  entity_id: string
  location: string
  description: string
  latitude?: number
  longitude?: number
  flagged?: boolean
}

export interface FullCase {
  case_id: string
  case_title: string
  status: string
  created_at: string
  updated_at: string
  autopsy: AutopsyData | null
  events: UnifiedEvent[]
  analysis: ForensicAnalysis | null
  summary: string | null
}

export interface ForensicAnalysis {
  timeline: {
    sorted_events: UnifiedEvent[]
    first_activity: string | null
    last_activity: string | null
    time_gaps: { from: string; to: string; gap_minutes: number; from_source: string; to_source: string }[]
  }
  time_of_death: {
    estimated_window: string
    low_hours: number | null
    high_hours: number | null
    reasoning: string[]
  }
  correlations: Record<string, unknown>[]
  anomalies: {
    id: string
    type: string
    severity: "low" | "medium" | "high"
    title: string
    description: string
    related_events: string[]
  }[]
  contradictions: {
    id?: string
    type?: string
    severity?: string
    title?: string
    description?: string
    note?: string
    related_events?: string[]
  }[]
  risk: {
    risk_level: string
    risk_score: number
    reasons: string[]
  }
  confidence: {
    confidence_score: number
    notes: string[]
  }
}

// ── API Methods ───────────────────────────────────────────────────────────────

export const api = {
  // Cases
  createCase: (title?: string) =>
    request<FullCase>("/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }),

  listCases: () =>
    request<{ cases: CaseSummaryApi[]; total: number }>("/cases"),

  getCase: (id: string) =>
    request<FullCase>(`/cases/${id}`),

  deleteCase: (id: string) =>
    request<{ message: string }>(`/cases/${id}`, { method: "DELETE" }),

  // Ingestion
  uploadAutopsy: (caseId: string, file: File) => {
    const form = new FormData()
    form.append("file", file)
    return request<{ message: string; case_id: string; autopsy: AutopsyData }>(
      `/cases/${caseId}/autopsy`,
      { method: "POST", body: form },
    )
  },

  uploadEvidence: (caseId: string, file: File) => {
    const form = new FormData()
    form.append("file", file)
    return request<{
      message: string
      case_id: string
      events_ingested: number
      total_events: number
      parse_errors: string[]
    }>(`/cases/${caseId}/evidence`, { method: "POST", body: form })
  },

  // Analysis
  processCase: (caseId: string) =>
    request<{
      message: string
      case_id: string
      risk_level: string
      risk_score: number
      confidence_score: number
      analysis: ForensicAnalysis
      summary: string
    }>(`/cases/${caseId}/process`, { method: "POST" }),

  // Health
  health: () => request<{ status: string }>("/health"),
}
