import { generateText, Output } from "ai"
import { z } from "zod"
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>

// Exact system prompt from the uploaded forensic AI specification document
const SYSTEM_PROMPT = `You are a forensic investigation AI system and postmortem assistance system.

The input is text extracted from:
- a PDF using pdfplumber (for digital text-based reports), OR
- OCR (Optical Character Recognition) for scanned PDFs/images.

Note:
OCR text may contain noise, spelling errors, or broken formatting. You must interpret carefully but do NOT guess missing facts.

Your job is to:

1. Validate the Report:
- Check if the text contains real forensic indicators such as:
  - Body temperature
  - Rigor mortis
  - Livor mortis
  - Environmental conditions
- If these are missing, unclear, or corrupted beyond recognition → mark the report as INVALID

2. If the report is VALID:

A. Extract Structured Data:
- body_temperature
- rigor_mortis
- livor_mortis
- environment
- any timestamps or observations (if clearly present)

B. Time-of-Death Insight:
- Estimate approximate time since death based ONLY on clearly available factors
- If insufficient data → return "insufficient data"

C. Summary:
- Provide a short forensic explanation based ONLY on extracted facts

3. If the report is INVALID:
Return ONLY:
{"status":"invalid","message":"Uploaded file does not contain valid forensic/autopsy data"}

4. If VALID, return ONLY JSON:
{"status":"valid","source_type":"pdfplumber_or_ocr","structured_data":{"body_temperature":"","rigor_mortis":"","livor_mortis":"","environment":""},"time_of_death_estimate":"","summary":""}

STRICT RULES:
- Do NOT guess missing values
- Do NOT hallucinate
- Handle OCR noise carefully (e.g., minor spelling errors)
- If uncertain → mark as invalid or "insufficient data"
- Output must be valid JSON only
- Do NOT include any explanation outside JSON`

const validSchema = z.object({
  status: z.literal("valid"),
  source_type: z.string(),
  structured_data: z.object({
    body_temperature: z.string(),
    rigor_mortis: z.string(),
    livor_mortis: z.string(),
    environment: z.string(),
  }),
  time_of_death_estimate: z.string(),
  summary: z.string(),
})

const invalidSchema = z.object({
  status: z.literal("invalid"),
  message: z.string(),
})

const responseSchema = z.discriminatedUnion("status", [validSchema, invalidSchema])

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    const maxBytes = 25 * 1024 * 1024
    if (file.size > maxBytes) {
      return Response.json({ error: "File exceeds 25MB limit" }, { status: 400 })
    }

    // Extract text from the uploaded file
    let extractedText = ""
    let sourceType = "pdfplumber"

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      try {
        const parsed = await pdfParse(buffer)
        extractedText = parsed.text?.trim() ?? ""
        sourceType = "pdfplumber"
      } catch {
        return Response.json(
          {
            status: "invalid",
            message: "Uploaded file does not contain valid forensic/autopsy data",
          },
          { status: 422 },
        )
      }
    } else if (
      file.type === "text/plain" ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md")
    ) {
      extractedText = buffer.toString("utf-8")
      sourceType = "ocr"
    } else {
      return Response.json(
        {
          status: "invalid",
          message: "Uploaded file does not contain valid forensic/autopsy data",
        },
        { status: 422 },
      )
    }

    if (!extractedText || extractedText.length < 50) {
      return Response.json({
        status: "invalid",
        message: "Uploaded file does not contain valid forensic/autopsy data",
      })
    }

    // Inject extracted text into the prompt exactly as specified
    const userPrompt = `Extracted Text:\n${extractedText}`

    const { experimental_output } = await generateText({
      model: "openai/gpt-4o-mini",
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      experimental_output: Output.object({
        schema: responseSchema,
      }),
    })

    // Attach the source_type from our extraction if AI returned valid
    const result =
      experimental_output.status === "valid"
        ? { ...experimental_output, source_type: sourceType }
        : experimental_output

    return Response.json(result)
  } catch (err) {
    console.error("[analyze] error:", err)
    return Response.json(
      {
        status: "invalid",
        message: "Uploaded file does not contain valid forensic/autopsy data",
      },
      { status: 500 },
    )
  }
}
