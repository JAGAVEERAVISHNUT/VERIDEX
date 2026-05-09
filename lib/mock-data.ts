export type RiskLevel = "low" | "medium" | "high" | "critical"
export type CaseStatus = "active" | "closed" | "review"
export type EventType = "cctv" | "mobile" | "gps" | "witness" | "forensic"
export type AnomalyType = "time" | "location" | "behavioral" | "contradiction"
export type AnomalySeverity = "low" | "medium" | "high"

export interface TimelineEvent {
  id: string
  timestamp: string
  time: string
  date: string
  type: EventType
  source: string
  description: string
  location?: string
  flagged?: boolean
}

export interface Anomaly {
  id: string
  type: AnomalyType
  severity: AnomalySeverity
  title: string
  description: string
  relatedEvents: string[]
}

export interface CCTVLog {
  id: string
  timestamp: string
  cameraId: string
  location: string
  duration: string
  identifiedSubjects: number
  status: "clear" | "obstructed" | "anomaly"
}

export interface MobileRecord {
  id: string
  timestamp: string
  type: "call" | "sms" | "data"
  contact: string
  duration?: string
  cellTower: string
  status: "outgoing" | "incoming" | "missed"
}

export interface GPSPoint {
  id: string
  timestamp: string
  latitude: number
  longitude: number
  accuracy: number
  speed: number
  source: string
}

export interface AutopsyData {
  bodyTemperature: string
  rigorMortis: string
  livorMortis: string
  estimatedTOD: string
  causeOfDeath: string
  manner: string
  injuries: { region: string; description: string; severity: string }[]
  toxicology: { substance: string; level: string; status: string }[]
  examiner: string
  examinationDate: string
}

export interface ForensicCase {
  caseId: string
  caseTitle: string
  status: CaseStatus
  riskLevel: RiskLevel
  riskScore: number
  confidenceScore: number
  estimatedTimeOfDeath: string
  jurisdiction: string
  leadInvestigator: string
  openedDate: string
  lastUpdated: string
  summary: string
  findings: { id: string; text: string; weight: "high" | "medium" | "low" }[]
  timeline: TimelineEvent[]
  anomalies: Anomaly[]
  riskReasons: string[]
  cctvLogs: CCTVLog[]
  mobileRecords: MobileRecord[]
  gpsPoints: GPSPoint[]
  autopsy: AutopsyData
}

export const mockCase: ForensicCase = {
  caseId: "VX-2025-04412",
  caseTitle: "Riverside District — Unattended Death Investigation",
  status: "active",
  riskLevel: "high",
  riskScore: 78,
  confidenceScore: 86,
  estimatedTimeOfDeath: "Mar 14, 2025 · 23:40 – 00:25 UTC",
  jurisdiction: "Metro Forensics Division — Sector 7",
  leadInvestigator: "Det. M. Okafor (Badge #4421)",
  openedDate: "Mar 15, 2025",
  lastUpdated: "2 hours ago",
  summary:
    "AI correlation engine identifies inconsistencies between subject's reported route and CCTV/GPS evidence. The mobile device remained stationary at the residence while the subject's vehicle was logged 4.2 km away. Autopsy findings indicate a narrower TOD window than initially declared, raising probability of staged scene.",
  findings: [
    {
      id: "f1",
      text: "Subject mobile device stationary at residence while vehicle GPS active 4.2km away — implies device was deliberately left behind.",
      weight: "high",
    },
    {
      id: "f2",
      text: "CCTV at Westbridge & 4th captures unidentified second individual entering vehicle at 23:12 UTC.",
      weight: "high",
    },
    {
      id: "f3",
      text: "Autopsy core temperature places TOD between 23:40–00:25 UTC, contradicting witness statement of 01:30 UTC.",
      weight: "high",
    },
    {
      id: "f4",
      text: "Toxicology screen returned trace zolpidem (8 ng/mL) — not present in declared medications.",
      weight: "medium",
    },
    {
      id: "f5",
      text: "Subject made 3 outgoing calls to a burner number (+1-555-0148) in the 48 hours preceding death.",
      weight: "medium",
    },
    {
      id: "f6",
      text: "No signs of forced entry; rear patio door unlocked and ajar at scene arrival.",
      weight: "low",
    },
  ],
  timeline: [
    {
      id: "e1",
      timestamp: "2025-03-14T20:14:00Z",
      time: "20:14",
      date: "Mar 14",
      type: "mobile",
      source: "Cell Tower WB-117",
      description: "Outgoing call placed to +1-555-0148 (burner). Duration 4m 12s.",
      location: "Residence — 412 Maple Ave",
    },
    {
      id: "e2",
      timestamp: "2025-03-14T21:02:00Z",
      time: "21:02",
      date: "Mar 14",
      type: "cctv",
      source: "CAM-007 Lobby",
      description: "Subject exits residence carrying duffel bag. Alone.",
      location: "412 Maple Ave — Lobby",
    },
    {
      id: "e3",
      timestamp: "2025-03-14T21:18:00Z",
      time: "21:18",
      date: "Mar 14",
      type: "gps",
      source: "Vehicle Telematics",
      description: "Vehicle ignition logged. Begins eastbound route on Hwy-9.",
      location: "Maple Ave & 7th St",
    },
    {
      id: "e4",
      timestamp: "2025-03-14T23:12:00Z",
      time: "23:12",
      date: "Mar 14",
      type: "cctv",
      source: "CAM-114 Westbridge",
      description: "Vehicle stops. Unidentified second individual enters passenger side.",
      location: "Westbridge & 4th",
      flagged: true,
    },
    {
      id: "e5",
      timestamp: "2025-03-14T23:34:00Z",
      time: "23:34",
      date: "Mar 14",
      type: "mobile",
      source: "Subject Device",
      description: "Mobile device pinged tower BR-22 — stationary at residence (subject not present).",
      location: "412 Maple Ave",
      flagged: true,
    },
    {
      id: "e6",
      timestamp: "2025-03-15T00:08:00Z",
      time: "00:08",
      date: "Mar 15",
      type: "gps",
      source: "Vehicle Telematics",
      description: "Vehicle returns to Maple Ave. Engine off. No exit detected on driveway camera.",
      location: "412 Maple Ave",
      flagged: true,
    },
    {
      id: "e7",
      timestamp: "2025-03-15T00:25:00Z",
      time: "00:25",
      date: "Mar 15",
      type: "forensic",
      source: "Medical Examiner",
      description: "Estimated upper-bound TOD based on liver core temperature (32.1°C).",
      location: "412 Maple Ave — Bedroom",
    },
    {
      id: "e8",
      timestamp: "2025-03-15T01:30:00Z",
      time: "01:30",
      date: "Mar 15",
      type: "witness",
      source: "Spouse Statement",
      description: "Spouse claims to have discovered subject upon returning home.",
      location: "412 Maple Ave",
      flagged: true,
    },
    {
      id: "e9",
      timestamp: "2025-03-15T01:42:00Z",
      time: "01:42",
      date: "Mar 15",
      type: "mobile",
      source: "911 Dispatch",
      description: "Emergency call placed. Dispatch transcript flagged for tonal analysis.",
      location: "412 Maple Ave",
    },
  ],
  anomalies: [
    {
      id: "a1",
      type: "time",
      severity: "high",
      title: "Time-of-Death Contradiction",
      description:
        "Witness-declared discovery time (01:30) postdates autopsy upper-bound TOD (00:25) by 65 minutes. Indicates discovery was reported after death already occurred under unobserved conditions.",
      relatedEvents: ["e7", "e8"],
    },
    {
      id: "a2",
      type: "location",
      severity: "high",
      title: "Device-Subject Spatial Mismatch",
      description:
        "Subject mobile device remained at residence (tower BR-22) while vehicle GPS placed subject 4.2 km away. Probability of intentional device decoupling: 91%.",
      relatedEvents: ["e4", "e5"],
    },
    {
      id: "a3",
      type: "behavioral",
      severity: "medium",
      title: "Unusual Communication Pattern",
      description:
        "3 outgoing calls to unregistered number in 48h preceding event — deviation of 4.2σ from subject's 90-day baseline.",
      relatedEvents: ["e1"],
    },
    {
      id: "a4",
      type: "contradiction",
      severity: "high",
      title: "Witness Statement vs. Telematics",
      description:
        "Spouse statement places subject at residence from 21:00 onward; vehicle and CCTV evidence directly contradicts this claim.",
      relatedEvents: ["e2", "e3", "e8"],
    },
    {
      id: "a5",
      type: "behavioral",
      severity: "medium",
      title: "Unidentified Secondary Subject",
      description:
        "CCTV at 23:12 captures unknown individual entering vehicle. No facial match against registered databases (confidence < 18%).",
      relatedEvents: ["e4"],
    },
  ],
  riskReasons: [
    "Multiple high-severity anomalies converge on a single 90-minute window.",
    "Direct contradiction between physical evidence and primary witness statement.",
    "Trace pharmacological agent (zolpidem) inconsistent with declared prescriptions.",
    "Unidentified secondary subject present at flagged location event.",
    "Subject mobile device pattern consistent with deliberate evidentiary decoupling.",
  ],
  cctvLogs: [
    {
      id: "c1",
      timestamp: "21:02 · Mar 14",
      cameraId: "CAM-007",
      location: "412 Maple Ave — Lobby",
      duration: "00:14",
      identifiedSubjects: 1,
      status: "clear",
    },
    {
      id: "c2",
      timestamp: "21:09 · Mar 14",
      cameraId: "CAM-118",
      location: "Maple & 7th — Intersection",
      duration: "00:06",
      identifiedSubjects: 1,
      status: "clear",
    },
    {
      id: "c3",
      timestamp: "23:12 · Mar 14",
      cameraId: "CAM-114",
      location: "Westbridge & 4th",
      duration: "00:42",
      identifiedSubjects: 2,
      status: "anomaly",
    },
    {
      id: "c4",
      timestamp: "23:48 · Mar 14",
      cameraId: "CAM-203",
      location: "Riverside Pkwy — Mile 4",
      duration: "00:08",
      identifiedSubjects: 1,
      status: "obstructed",
    },
    {
      id: "c5",
      timestamp: "00:08 · Mar 15",
      cameraId: "CAM-007",
      location: "412 Maple Ave — Driveway",
      duration: "00:22",
      identifiedSubjects: 0,
      status: "anomaly",
    },
  ],
  mobileRecords: [
    {
      id: "m1",
      timestamp: "20:14 · Mar 14",
      type: "call",
      contact: "+1-555-0148 (unregistered)",
      duration: "4m 12s",
      cellTower: "WB-117",
      status: "outgoing",
    },
    {
      id: "m2",
      timestamp: "20:48 · Mar 14",
      type: "sms",
      contact: "Spouse",
      cellTower: "WB-117",
      status: "outgoing",
    },
    {
      id: "m3",
      timestamp: "22:31 · Mar 14",
      type: "data",
      contact: "Background sync",
      cellTower: "BR-22",
      status: "outgoing",
    },
    {
      id: "m4",
      timestamp: "23:34 · Mar 14",
      type: "data",
      contact: "Background sync",
      cellTower: "BR-22",
      status: "outgoing",
    },
    {
      id: "m5",
      timestamp: "01:42 · Mar 15",
      type: "call",
      contact: "911 Dispatch",
      duration: "6m 04s",
      cellTower: "BR-22",
      status: "outgoing",
    },
  ],
  gpsPoints: [
    { id: "g1", timestamp: "21:02 · Mar 14", latitude: 40.7128, longitude: -74.006, accuracy: 4, speed: 0, source: "Vehicle" },
    { id: "g2", timestamp: "21:18 · Mar 14", latitude: 40.7148, longitude: -74.002, accuracy: 5, speed: 28, source: "Vehicle" },
    { id: "g3", timestamp: "21:42 · Mar 14", latitude: 40.7211, longitude: -73.989, accuracy: 6, speed: 42, source: "Vehicle" },
    { id: "g4", timestamp: "22:15 · Mar 14", latitude: 40.7305, longitude: -73.971, accuracy: 4, speed: 35, source: "Vehicle" },
    { id: "g5", timestamp: "23:12 · Mar 14", latitude: 40.7388, longitude: -73.962, accuracy: 3, speed: 0, source: "Vehicle" },
    { id: "g6", timestamp: "23:48 · Mar 14", latitude: 40.7301, longitude: -73.978, accuracy: 7, speed: 38, source: "Vehicle" },
    { id: "g7", timestamp: "00:08 · Mar 15", latitude: 40.7128, longitude: -74.006, accuracy: 4, speed: 0, source: "Vehicle" },
  ],
  autopsy: {
    bodyTemperature: "32.1°C (core, hepatic)",
    rigorMortis: "Partial — jaw and upper limbs",
    livorMortis: "Fixed, posterior, blanching minimally",
    estimatedTOD: "23:40 — 00:25 UTC (Mar 14–15)",
    causeOfDeath: "Asphyxiation — pending toxicology confirmation",
    manner: "Undetermined — investigation ongoing",
    injuries: [
      { region: "Left wrist", description: "Circumferential abrasion 2.4cm — restraint pattern", severity: "moderate" },
      { region: "Right temporal", description: "Subcutaneous contusion, no skull fracture", severity: "minor" },
      { region: "Neck — anterior", description: "Linear ecchymosis 11cm × 1.2cm", severity: "significant" },
    ],
    toxicology: [
      { substance: "Zolpidem", level: "8 ng/mL", status: "unexpected" },
      { substance: "Ethanol", level: "0.04%", status: "expected" },
      { substance: "Citalopram", level: "112 ng/mL", status: "expected" },
      { substance: "Opioids (panel)", level: "Negative", status: "expected" },
    ],
    examiner: "Dr. R. Halverson, M.D., F.C.A.P.",
    examinationDate: "Mar 15, 2025 · 09:14 UTC",
  },
}

export const riskTrendData = [
  { day: "D-6", score: 22 },
  { day: "D-5", score: 28 },
  { day: "D-4", score: 35 },
  { day: "D-3", score: 41 },
  { day: "D-2", score: 52 },
  { day: "D-1", score: 64 },
  { day: "Today", score: 78 },
]

export const evidenceVolumeData = [
  { name: "CCTV", count: 47 },
  { name: "Mobile", count: 128 },
  { name: "GPS", count: 312 },
  { name: "Witness", count: 6 },
  { name: "Forensic", count: 14 },
]

export interface CaseSummary {
  caseId: string
  caseTitle: string
  status: CaseStatus
  riskLevel: RiskLevel
  riskScore: number
  jurisdiction: string
  leadInvestigator: string
  openedDate: string
  lastUpdated: string
  evidenceCount: number
  anomalyCount: number
  subjects: number
  blurb: string
}

// Multi-case index used by the Cases overview and dynamic case routes.
export const caseList: CaseSummary[] = [
  {
    caseId: "VX-2025-04412",
    caseTitle: "Riverside District — Unattended Death Investigation",
    status: "active",
    riskLevel: "high",
    riskScore: 78,
    jurisdiction: "Metro Forensics Division — Sector 7",
    leadInvestigator: "Det. M. Okafor",
    openedDate: "Mar 15, 2025",
    lastUpdated: "2 hours ago",
    evidenceCount: 507,
    anomalyCount: 5,
    subjects: 3,
    blurb:
      "AI engine flags spatial mismatch between subject device and vehicle GPS. Witness statement contradicts autopsy TOD by 65 minutes.",
  },
  {
    caseId: "VX-2025-04398",
    caseTitle: "Harbor Pier 9 — Vehicular Manslaughter",
    status: "review",
    riskLevel: "medium",
    riskScore: 54,
    jurisdiction: "Coastal Division — Sector 3",
    leadInvestigator: "Det. K. Vance",
    openedDate: "Mar 11, 2025",
    lastUpdated: "Yesterday",
    evidenceCount: 284,
    anomalyCount: 2,
    subjects: 2,
    blurb:
      "Telematics show pre-impact braking inconsistent with driver's claim of mechanical failure. Awaiting ECU forensics.",
  },
  {
    caseId: "VX-2025-04376",
    caseTitle: "Northgate Tower — Industrial Fatality",
    status: "active",
    riskLevel: "critical",
    riskScore: 91,
    jurisdiction: "Metro Forensics Division — Sector 2",
    leadInvestigator: "Det. A. Reyes",
    openedDate: "Mar 08, 2025",
    lastUpdated: "47 minutes ago",
    evidenceCount: 612,
    anomalyCount: 8,
    subjects: 4,
    blurb:
      "Safety harness failure correlated with maintenance log gaps. Multiple unauthorized badge swipes detected pre-event.",
  },
  {
    caseId: "VX-2025-04341",
    caseTitle: "Eastside Plaza — Suspicious Disappearance",
    status: "active",
    riskLevel: "high",
    riskScore: 72,
    jurisdiction: "Metro Forensics Division — Sector 5",
    leadInvestigator: "Det. J. Chen",
    openedDate: "Mar 03, 2025",
    lastUpdated: "5 hours ago",
    evidenceCount: 198,
    anomalyCount: 4,
    subjects: 2,
    blurb:
      "Last known CCTV ping at 22:47 — mobile device powered off 6 minutes later. No further telemetry recovered.",
  },
  {
    caseId: "VX-2025-04298",
    caseTitle: "Westbrook Apartments — Cause of Death Review",
    status: "review",
    riskLevel: "low",
    riskScore: 24,
    jurisdiction: "Metro Forensics Division — Sector 7",
    leadInvestigator: "Det. M. Okafor",
    openedDate: "Feb 24, 2025",
    lastUpdated: "3 days ago",
    evidenceCount: 86,
    anomalyCount: 0,
    subjects: 1,
    blurb:
      "Toxicology and autopsy align with attending physician records. Pending final coroner sign-off.",
  },
  {
    caseId: "VX-2025-04221",
    caseTitle: "Old Mill Road — Hit and Run",
    status: "closed",
    riskLevel: "medium",
    riskScore: 48,
    jurisdiction: "Rural Division — Sector 11",
    leadInvestigator: "Det. P. Holloway",
    openedDate: "Feb 18, 2025",
    lastUpdated: "12 days ago",
    evidenceCount: 142,
    anomalyCount: 1,
    subjects: 2,
    blurb:
      "Suspect vehicle identified via paint transfer analysis and ALPR cross-reference. Conviction secured.",
  },
]

export function getCaseById(caseId: string): ForensicCase | null {
  if (caseId === mockCase.caseId) return mockCase
  const summary = caseList.find((c) => c.caseId === caseId)
  if (!summary) return null
  // Synthesize a lightweight ForensicCase for non-primary cases by overlaying summary data on the template
  return {
    ...mockCase,
    caseId: summary.caseId,
    caseTitle: summary.caseTitle,
    status: summary.status,
    riskLevel: summary.riskLevel,
    riskScore: summary.riskScore,
    jurisdiction: summary.jurisdiction,
    leadInvestigator: summary.leadInvestigator,
    openedDate: summary.openedDate,
    lastUpdated: summary.lastUpdated,
    summary: summary.blurb,
  }
}
