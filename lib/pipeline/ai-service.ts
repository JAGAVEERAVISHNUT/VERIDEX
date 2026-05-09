import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "dummy-key";
const genAI = new GoogleGenerativeAI(apiKey);

export interface AutopsyAnalysisResult {
  estimatedTimeOfDeath: { start: string; end: string } | null;
  causeOfDeath: string;
  injurySeverity: string;
  organDamage: string[];
  toxicSubstances: string[];
  medicalProfileSummary: string;
}

// Phase 3: Autopsy Analysis (Medical Intelligence)
export async function analyzeAutopsyText(text: string): Promise<AutopsyAnalysisResult> {
  if (apiKey === "dummy-key") {
    // Fallback if no API key is provided
    return {
      estimatedTimeOfDeath: { start: "2025-03-14T18:00:00Z", end: "2025-03-14T20:00:00Z" },
      causeOfDeath: "Blunt force trauma",
      injurySeverity: "Severe",
      organDamage: ["Liver laceration", "Rib fractures"],
      toxicSubstances: ["None detected"],
      medicalProfileSummary: "Subject suffered severe blunt force trauma resulting in fatal organ damage."
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro", generationConfig: { responseMimeType: "application/json" } });
    
    const prompt = `
    Analyze the following autopsy report and extract the medical intelligence.
    Extract the following fields strictly into a JSON object:
    - estimatedTimeOfDeath: { start: "ISO String", end: "ISO String" } (based on algor/rigor/livor mortis mentioned)
    - causeOfDeath: string
    - injurySeverity: string (e.g. "Critical", "Moderate")
    - organDamage: string[]
    - toxicSubstances: string[]
    - medicalProfileSummary: string (A concise summary)

    If data is missing, use null or empty arrays. Do not hallucinate.

    Report Text:
    ${text}
    `;

    const result = await model.generateContent(prompt);
    const jsonStr = result.response.text();
    return JSON.parse(jsonStr) as AutopsyAnalysisResult;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw new Error("Failed to process Autopsy report using AI.");
  }
}

// Phase 8: Insight Generation
export async function generateCaseInsights(anomalies: any[], autopsyResult: AutopsyAnalysisResult): Promise<string[]> {
  if (apiKey === "dummy-key" || anomalies.length === 0) {
    return [
      "Subject entered building before estimated death time.",
      "Device activity continued after death.",
      "Movement pattern inconsistent with normal behavior."
    ];
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro", generationConfig: { responseMimeType: "application/json" } });
    const prompt = `
    Generate a JSON array of 3 human-readable string insights based on these anomalies and the autopsy report.
    Anomalies: ${JSON.stringify(anomalies)}
    Autopsy: ${JSON.stringify(autopsyResult)}
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text()) as string[];
  } catch (error) {
    console.error("Insight generation failed:", error);
    return ["Automated insights could not be generated."];
  }
}
