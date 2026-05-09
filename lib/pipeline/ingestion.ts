// Polyfills for pdf-parse in Next.js Node environment
if (typeof globalThis.DOMMatrix === "undefined") {
  (globalThis as any).DOMMatrix = class DOMMatrix {};
}
if (typeof globalThis.Path2D === "undefined") {
  (globalThis as any).Path2D = class Path2D {};
}

const pdfParse = require("pdf-parse");

// Phase 1: Data Ingestion
// In a real scenario, this processes buffers directly from the Next.js API.

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return "";
  }
}

// Phase 2: Data Preprocessing (Standardization)
export interface RawEvent {
  timestamp?: string;
  time?: string;
  event_type?: string;
  type?: string;
  location?: any;
  device_id?: string;
  entity_id?: string;
  source?: string;
  note?: string;
  metadata?: any;
}

export interface StandardizedEvent {
  id: string;
  timestamp: string; // ISO String, UTC normalized
  eventType: string;
  location: any | null;
  deviceId: string;
  source: string;
  note: string;
}

export function standardizeDigitalEvidence(rawJson: any): StandardizedEvent[] {
  let events: RawEvent[] = [];
  
  if (Array.isArray(rawJson)) {
    events = rawJson;
  } else if (rawJson && Array.isArray(rawJson.events)) {
    events = rawJson.events;
  }

  const standardized: StandardizedEvent[] = [];

  for (const event of events) {
    // Normalize Timestamp
    let ts = event.timestamp || event.time;
    if (!ts) continue; // Skip events without time (noisy data)
    
    let dateObj = new Date(ts);
    // basic validation
    if (isNaN(dateObj.getTime())) {
      // attempt simple fixing if it's just a time like "21:45"
      if (ts.includes(":")) {
         // Assuming a default date for the case if only time is provided
         dateObj = new Date(`2025-03-14T${ts}:00Z`);
      } else {
         continue;
      }
    }

    standardized.push({
      id: Math.random().toString(36).substring(7),
      timestamp: dateObj.toISOString(),
      eventType: event.event_type || event.type || "unknown",
      location: event.location || null,
      deviceId: event.device_id || event.entity_id || "unknown",
      source: event.source || "System Log",
      note: event.note || "",
    });
  }

  // Sort chronological
  standardized.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return standardized;
}
