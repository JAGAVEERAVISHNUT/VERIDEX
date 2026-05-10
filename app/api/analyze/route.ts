import { generateText } from "ai"

// Dynamic import to avoid issues with pdf-parse initialization
async function parsePDF(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse")
  const result = await pdfParse(buffer)
  return result.text?.trim() ?? ""
}

// Comprehensive autopsy extraction prompt
const SYSTEM_PROMPT = `You are a forensic pathology AI that extracts structured autopsy case data from medical examiner reports.

Given extracted text from an autopsy PDF, you MUST return a JSON object containing a full case record.

If the document is NOT a valid forensic/autopsy report, return:
{"status":"invalid","message":"Not a forensic/autopsy document"}

If VALID, extract ALL available information and return:
{
  "status": "valid",
  "case": {
    "caseId": "string - case/ME number from the document",
    "caseTitle": "string - decedent name + manner of death summary",
    "status": "completed",
    "manner": "natural|accident|suicide|homicide|undetermined",
    "subject": {
      "age": number,
      "sex": "Male|Female",
      "ethnicity": "string",
      "pastMedicalHistory": "string",
      "knownRiskFactors": ["array of strings"]
    },
    "examiner": "string - medical examiner name and credentials",
    "examinationDate": "string",
    "facility": "string - ME office name",
    "pronouncedAt": "string - date/time and location",
    "openedDate": "string",
    "lastUpdated": "string",
    "summary": "string - 2-3 sentence case summary",
    "keyFindings": [
      {"id": "kf1", "text": "string", "weight": "low|medium|high"}
    ],
    "clinicalHistory": {
      "narrative": "string",
      "presentingComplaints": ["array"],
      "interventions": ["array"]
    },
    "resuscitationTimeline": [
      {"id": "rt1", "time": "string", "location": "string", "description": "string", "kind": "vital|intervention|deterioration|outcome"}
    ],
    "externalExamination": {
      "description": "string - general body description",
      "findings": [
        {"id": "ex1", "region": "string", "description": "string", "significance": "low|medium|high", "perimortem": true|false}
      ],
      "devicesInPlace": ["array"]
    },
    "bodyCavities": [
      {"cavity": "string", "finding": "string"}
    ],
    "organFindings": [
      {"id": "of1", "organ": "string", "weightGrams": number|null, "status": "normal|abnormal|critical", "observations": "string"}
    ],
    "pathology": {
      "summary": "string",
      "samples": [
        {"id": "ps1", "region": "string", "finding": "string", "severity": "low|medium|high"}
      ]
    },
    "causeOfDeath": {
      "primary": "string",
      "immediate": "string",
      "underlying": "string",
      "contributing": ["array"],
      "manner": "natural|accident|suicide|homicide|undetermined",
      "confidence": number 0-100,
      "mechanism": "string",
      "reasoning": "string",
      "extractedFrom": ["array of source sections"]
    },
    "correlation": {
      "summary": "string",
      "notes": [
        {"id": "n1", "author": "string", "role": "string", "timestamp": "string", "content": "string", "tag": "observation|hypothesis|follow-up|conclusion"}
      ],
      "unansweredQuestions": ["array"],
      "recommendedTests": ["array"]
    },
    "analysis": {
      "injuryPattern": {"summary": "string", "findings": [], "overallAssessment": "string", "extractedFrom": []},
      "causeOfDeath": {same as causeOfDeath above},
      "organCondition": {"summary": "string", "findings": [], "extractedFrom": []},
      "tissuePathology": {"summary": "string", "samples": [], "extractedFrom": []},
      "investigationNotes": {"summary": "string", "notes": [], "unansweredQuestions": [], "recommendedTests": [], "extractedFrom": []}
    },
    "totalOrganWeightGrams": number,
    "organsExamined": number,
    "resuscitationDurationMinutes": number
  }
}

STRICT RULES:
- Extract ALL available data from the document
- Generate unique IDs for array items (kf1, kf2, ex1, ex2, etc.)
- Do NOT hallucinate - only include information present in the document
- If data is not available, use reasonable defaults or empty arrays
- Output MUST be valid JSON only, no explanations
- The caseId should be the ME/case number from the document header`

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ status: "invalid", message: "No file provided" }, { status: 400 })
    }

    const maxBytes = 25 * 1024 * 1024
    if (file.size > maxBytes) {
      return Response.json({ status: "invalid", message: "File exceeds 25MB limit" }, { status: 400 })
    }

    // Extract text from the uploaded file
    let extractedText = ""

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      try {
        console.log("[v0] Parsing PDF, size:", file.size)
        extractedText = await parsePDF(buffer)
        console.log("[v0] PDF parsed, text length:", extractedText.length)
      } catch (pdfErr) {
        console.error("[v0] PDF parse error:", pdfErr)
        return Response.json({ status: "invalid", message: "Could not parse PDF" }, { status: 422 })
      }
    } else if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      extractedText = buffer.toString("utf-8")
    } else {
      return Response.json({ status: "invalid", message: "Unsupported file type" }, { status: 422 })
    }

    if (!extractedText || extractedText.length < 100) {
      return Response.json({ status: "invalid", message: "Document too short or empty" })
    }

    // Truncate text to avoid token limits and timeouts (max ~50k chars)
    const maxChars = 50000
    const truncatedText = extractedText.length > maxChars 
      ? extractedText.slice(0, maxChars) + "\n\n[Document truncated for processing...]"
      : extractedText

    console.log("[v0] Calling AI with text length:", truncatedText.length)

    // Call AI to extract full autopsy case
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: SYSTEM_PROMPT,
      prompt: `Extract autopsy case data from this document:\n\n${truncatedText}`,
    })

    console.log("[v0] AI response received, length:", text.length)

    // Parse the JSON response
    let result: { status: string; case?: Record<string, unknown>; message?: string }
    try {
      // Strip any markdown code fences if present
      const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      result = JSON.parse(cleanText)
    } catch (parseErr) {
      console.error("[v0] JSON parse error:", parseErr)
      console.error("[v0] Raw AI response:", text.slice(0, 500))
      return Response.json({ status: "invalid", message: "AI response was not valid JSON" })
    }

    if (result.status === "invalid") {
      return Response.json({ status: "invalid", message: result.message ?? "Not a forensic document" })
    }

    // Return the full case object
    return Response.json({ status: "valid", case: result.case })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error("[v0] Analyze API error:", errorMessage)
    console.error("[v0] Full error:", err)
    
    // Return more specific error message
    return Response.json({ 
      status: "error", 
      message: `Analysis failed: ${errorMessage}` 
    }, { status: 500 })
  }
}
