import { NextRequest, NextResponse } from "next/server";
import { parsePdfBuffer, standardizeDigitalEvidence } from "@/lib/pipeline/ingestion";
import { analyzeAutopsyText, generateCaseInsights } from "@/lib/pipeline/ai-service";
import { correlateAndAnalyze } from "@/lib/pipeline/correlation-engine";
import { saveCase } from "@/lib/case-store";
import { ForensicCase } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Phase 1: Ingestion
    const pdfFile = formData.get("pdf") as File | null;
    const jsonFile = formData.get("json") as File | null;

    let autopsyText = "";
    let digitalEventsRaw = [];

    if (pdfFile) {
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      autopsyText = await parsePdfBuffer(buffer);
    }

    if (jsonFile) {
      const text = await jsonFile.text();
      try {
        digitalEventsRaw = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON file", e);
      }
    }

    // Phase 2: Standardization
    const standardizedEvents = standardizeDigitalEvidence(digitalEventsRaw);

    // Phase 3: Autopsy Analysis
    const autopsyResult = await analyzeAutopsyText(autopsyText || "No autopsy text provided.");

    // Phase 4, 5, 6, 7: Correlation Engine
    const correlationResult = correlateAndAnalyze(standardizedEvents, autopsyResult);

    // Phase 8: Insight Generation
    const generatedInsights = await generateCaseInsights(correlationResult.anomalies, autopsyResult);

    // Map to the format the UI expects (ForensicCase)
    const caseId = `VX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const caseData: ForensicCase = {
      caseId,
      title: "Generated Case Analysis",
      status: "Active",
      priority: correlationResult.riskAssessment.level,
      dateOpened: new Date().toISOString().split("T")[0],
      investigator: "System Gen",
      summary: autopsyResult.medicalProfileSummary || "Case analysis generated successfully.",
      
      autopsy: {
        causeOfDeath: autopsyResult.causeOfDeath,
        estimatedTimeOfDeath: autopsyResult.estimatedTimeOfDeath?.start || "Unknown",
        medicalFindings: autopsyResult.organDamage.length > 0 ? autopsyResult.organDamage : ["No significant findings"],
        toxicology: autopsyResult.toxicSubstances.length > 0 ? autopsyResult.toxicSubstances : ["Clean"]
      },

      digitalEvidence: {
        totalEvents: correlationResult.events.length,
        devicesAnalyzed: [...new Set(correlationResult.events.map(e => e.deviceId))].length,
        criticalFlags: correlationResult.anomalies.length,
        lastActivity: correlationResult.events.length > 0 ? correlationResult.events[correlationResult.events.length - 1].timestamp : "N/A"
      },

      riskAssessment: {
        score: correlationResult.riskAssessment.total,
        level: correlationResult.riskAssessment.level,
        factors: correlationResult.riskAssessment.reasons.map(r => ({ description: r, impact: "High" as const }))
      },

      timeline: correlationResult.events.map(e => ({
        id: e.id,
        timestamp: e.timestamp,
        type: e.eventType,
        description: e.note || `${e.eventType} logged from ${e.source}`,
        source: e.source,
        risk: correlationResult.anomalies.some(a => a.relatedEvents.includes(e.id)) ? "high" : "low"
      })),

      anomalies: correlationResult.anomalies.map(a => ({
        id: a.id,
        type: a.type,
        severity: a.severity.toLowerCase() as "high" | "medium" | "low",
        description: a.description,
        timestamp: correlationResult.events.find(e => e.id === a.relatedEvents[0])?.timestamp || new Date().toISOString()
      })),

      insights: generatedInsights
    };

    // Save in memory
    saveCase(caseId, caseData);

    return NextResponse.json({ success: true, caseId });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
