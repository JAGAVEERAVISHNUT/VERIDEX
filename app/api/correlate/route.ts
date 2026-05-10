import { generateText, Output } from "ai"
import { z } from "zod"

export const maxDuration = 60

const correlationSchema = z.object({
  timeline: z
    .array(
      z.object({
        timestamp: z.string().describe("ISO 8601 timestamp"),
        source: z.enum(["cctv", "mobile", "gps", "other"]),
        location: z.string(),
        description: z.string(),
        entityId: z.string().nullable().describe("Subject/device/vehicle identifier"),
      }),
    )
    .describe("Chronologically ordered events synthesized from all evidence sources"),
  correlations: z
    .array(
      z.object({
        id: z.string(),
        sources: z.array(z.enum(["cctv", "mobile", "gps", "other"])).min(2),
        description: z.string().describe("How these sources connect — same actor, same place, same window"),
        strength: z.enum(["weak", "moderate", "strong"]),
        eventIds: z.array(z.string()).describe("References to timeline event IDs (or empty)"),
      }),
    )
    .describe("Cross-source links that establish entity tracks"),
  anomalies: z
    .array(
      z.object({
        id: z.string(),
        category: z.enum([
          "late-night-activity",
          "rapid-displacement",
          "sudden-stop",
          "signal-conflict",
          "device-actor-mismatch",
          "other",
        ]),
        description: z.string(),
        severity: z.enum(["low", "medium", "high"]),
        timestamp: z.string().nullable(),
      }),
    )
    .describe("Suspicious or unusual patterns"),
  risk: z.object({
    score: z.number().min(0).max(100),
    level: z.enum(["LOW", "MEDIUM", "HIGH"]),
    rationale: z.string().describe("One-paragraph justification for the score"),
  }),
  summary: z.string().describe("Executive summary of the correlation analysis (2-4 sentences)"),
})

export type CorrelationResult = z.infer<typeof correlationSchema>

const SYSTEM_PROMPT = `You are a forensic investigation AI.

Analyze the given digital evidence dataset containing CCTV logs, mobile metadata, GPS/geolocation records, and timestamps.

Perform the following tasks:

1. Digital Evidence Correlation:
- Identify connections between events across sources (CCTV, Mobile, GPS)
- Track movement of entities using timestamps and locations
- Build a clear chronological timeline

2. Anomaly Detection:
- Detect unusual patterns such as:
  - Activity during late night hours (before 6 AM or after 10 PM)
  - Rapid movement across distant locations in short time
  - Sudden stops or suspicious activity
  - Conflicting or overlapping signals (e.g., a device stationary at home while its owner appears on CCTV elsewhere)

3. Case Risk Scoring:
- Assign a risk score from 0 to 100 based on:
  - Number of anomalies
  - Severity of movement patterns
  - Multi-source correlation strength
- Classify risk level as LOW (0-39), MEDIUM (40-69), or HIGH (70-100)

Be precise, evidence-driven, and conservative. If signals are weak, say so. Never fabricate locations or timestamps not present in the dataset.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const events = body?.events ?? body

    const { output } = await generateText({
      model: "openai/gpt-5-mini",
      system: SYSTEM_PROMPT,
      output: Output.object({ schema: correlationSchema }),
      prompt: `Dataset:\n${JSON.stringify(events, null, 2)}`,
    })

    return Response.json({ ok: true, result: output })
  } catch (err) {
    console.log("[v0] correlate route error:", err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}
