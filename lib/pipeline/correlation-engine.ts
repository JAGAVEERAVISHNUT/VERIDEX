import { StandardizedEvent } from "./ingestion";
import { AutopsyAnalysisResult } from "./ai-service";

export interface Anomaly {
  id: string;
  type: "Time" | "Location" | "Behavioral" | "Identity" | "CrossValidation";
  description: string;
  severity: "High" | "Medium" | "Low";
  scoreImpact: number;
  relatedEvents: string[]; // event IDs
}

export interface RiskScore {
  total: number;
  level: "High" | "Medium" | "Low";
  reasons: string[];
}

export interface CorrelatedTimeline {
  events: StandardizedEvent[];
  anomalies: Anomaly[];
  riskAssessment: RiskScore;
}

// Phase 4, 5, 6, 7 Logic
export function correlateAndAnalyze(
  events: StandardizedEvent[],
  autopsyResult: AutopsyAnalysisResult
): CorrelatedTimeline {
  const anomalies: Anomaly[] = [];
  let totalScore = 0;
  const reasons: string[] = [];

  // Sort events chronologically (Phase 4 implicitly handled if events are passed sorted)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Phase 5: Anomaly Detection Rules
  for (let i = 0; i < sortedEvents.length; i++) {
    const current = sortedEvents[i];
    const prev = i > 0 ? sortedEvents[i - 1] : null;

    // Time Anomalies: Activity at unusual hours (e.g. 2 AM to 5 AM)
    const hour = new Date(current.timestamp).getUTCHours();
    if (hour >= 2 && hour <= 5) {
      anomalies.push({
        id: `anom-${current.id}-time`,
        type: "Time",
        description: `Activity detected at unusual hour: ${hour}:00`,
        severity: "Medium",
        scoreImpact: 20,
        relatedEvents: [current.id],
      });
      totalScore += 20;
      reasons.push(`Activity at ${hour}:00 AM`);
    }

    // Behavioral Anomalies: Rapid sequence of actions
    if (prev) {
      const timeDiffMins = (new Date(current.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 60000;
      if (timeDiffMins < 2 && current.source !== prev.source) {
        anomalies.push({
          id: `anom-${current.id}-beh`,
          type: "Behavioral",
          description: `Rapid cross-system activity detected within ${Math.round(timeDiffMins)} mins.`,
          severity: "Medium",
          scoreImpact: 25,
          relatedEvents: [prev.id, current.id],
        });
        totalScore += 25;
        if (!reasons.includes("Suspicious sequence of actions")) reasons.push("Suspicious sequence of actions");
      }
    }
  }

  // Phase 7: Cross-Validation (Medical Truth vs Digital Truth)
  if (autopsyResult.estimatedTimeOfDeath && autopsyResult.estimatedTimeOfDeath.end) {
    const todEnd = new Date(autopsyResult.estimatedTimeOfDeath.end).getTime();
    
    for (const event of sortedEvents) {
      const eventTime = new Date(event.timestamp).getTime();
      // If digital activity happens > 1 hour after estimated ToD end
      if (eventTime > todEnd + 3600000) {
        anomalies.push({
          id: `anom-${event.id}-cross`,
          type: "CrossValidation",
          description: `Postmortem digital activity detected from ${event.source}`,
          severity: "High",
          scoreImpact: 50,
          relatedEvents: [event.id],
        });
        totalScore += 50;
        if (!reasons.includes("Postmortem digital activity detected")) reasons.push("Postmortem digital activity detected");
      }
    }
  }

  // Phase 6: Risk Scoring Evaluation
  let level: "High" | "Medium" | "Low" = "Low";
  if (totalScore >= 70) level = "High";
  else if (totalScore >= 30) level = "Medium";

  return {
    events: sortedEvents,
    anomalies,
    riskAssessment: {
      total: Math.min(totalScore, 100),
      level,
      reasons,
    },
  };
}
