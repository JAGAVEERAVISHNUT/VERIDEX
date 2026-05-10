// All data on this page is extracted directly from the ingested student
// autopsy report ("Student autopsy report: Sample"). No fictional / synthetic
// records are mixed in.

export type CaseStatus = "active" | "completed" | "review"
export type DeathManner = "natural" | "accident" | "suicide" | "homicide" | "undetermined"
export type Severity = "low" | "medium" | "high"
export type OrganStatus = "normal" | "abnormal" | "critical"
export type ResusEventKind = "vital" | "intervention" | "deterioration" | "outcome"

export interface Subject {
  age: number
  sex: string
  ethnicity: string
  pastMedicalHistory: string
  knownRiskFactors: string[]
}

export interface KeyFinding {
  id: string
  text: string
  weight: Severity
}

export interface ResuscitationEvent {
  id: string
  time: string
  location: string
  description: string
  kind: ResusEventKind
}

export interface ExternalFinding {
  id: string
  region: string
  description: string
  significance: Severity
  perimortem: boolean
}

export interface BodyCavity {
  cavity: string
  finding: string
}

export interface OrganFinding {
  id: string
  organ: string
  weightGrams?: number
  status: OrganStatus
  observations: string
}

export interface PathologySample {
  id: string
  region: string
  finding: string
  ageEstimate?: string
  severity: Severity
}

export interface InvestigationNote {
  id: string
  author: string
  role: string
  timestamp: string
  content: string
  tag: "observation" | "hypothesis" | "follow-up" | "conclusion"
}

export interface AnalysisSection {
  injuryPattern: {
    summary: string
    findings: ExternalFinding[]
    overallAssessment: string
    extractedFrom: string[]
  }
  causeOfDeath: {
    primary: string
    immediate: string
    underlying: string
    contributing: string[]
    manner: DeathManner
    confidence: number
    mechanism: string
    reasoning: string
    extractedFrom: string[]
  }
  organCondition: {
    summary: string
    findings: OrganFinding[]
    extractedFrom: string[]
  }
  tissuePathology: {
    summary: string
    samples: PathologySample[]
    extractedFrom: string[]
  }
  investigationNotes: {
    summary: string
    notes: InvestigationNote[]
    unansweredQuestions: string[]
    recommendedTests: string[]
    extractedFrom: string[]
  }
}

export interface AutopsyCase {
  caseId: string
  caseTitle: string
  status: CaseStatus
  manner: DeathManner

  subject: Subject
  examiner: string
  examinationDate: string
  facility: string
  pronouncedAt: string
  openedDate: string
  lastUpdated: string

  summary: string
  keyFindings: KeyFinding[]

  clinicalHistory: {
    narrative: string
    presentingComplaints: string[]
    interventions: string[]
  }
  resuscitationTimeline: ResuscitationEvent[]

  externalExamination: {
    description: string
    findings: ExternalFinding[]
    devicesInPlace: string[]
  }
  bodyCavities: BodyCavity[]

  organFindings: OrganFinding[]
  pathology: {
    summary: string
    samples: PathologySample[]
  }

  causeOfDeath: AnalysisSection["causeOfDeath"]
  correlation: {
    summary: string
    notes: InvestigationNote[]
    unansweredQuestions: string[]
    recommendedTests: string[]
  }

  analysis: AnalysisSection

  // Tabular stats
  totalOrganWeightGrams: number
  organsExamined: number
  resuscitationDurationMinutes: number
}

// ---------------------------------------------------------------------------
// Single case derived 1:1 from the attached student autopsy report (Sample).
// ---------------------------------------------------------------------------

const subject: Subject = {
  age: 35,
  sex: "Male",
  ethnicity: "African American",
  pastMedicalHistory: "No significant past medical history",
  knownRiskFactors: ["Obesity"],
}

const externalFindings: ExternalFinding[] = [
  {
    id: "ex1",
    region: "Upper chest & anterior neck",
    description: "Area of congestion / erythema — pattern consistent with peri-mortem CPR / lead-pad placement.",
    significance: "low",
    perimortem: true,
  },
  {
    id: "ex2",
    region: "Bilateral conjunctivae",
    description: "Multiple small areas of hemorrhage (petechiae) bilaterally — consistent with terminal hypoxia / agonal pressure rise.",
    significance: "medium",
    perimortem: true,
  },
  {
    id: "ex3",
    region: "Lower extremities",
    description: "No peripheral edema. Both calves equal in circumference; milking the venous system produced no clots.",
    significance: "low",
    perimortem: false,
  },
  {
    id: "ex4",
    region: "Body habitus",
    description: "35-year-old well-developed, well-nourished male. No major surgical scars identified.",
    significance: "low",
    perimortem: false,
  },
]

const bodyCavities: BodyCavity[] = [
  { cavity: "Right pleural cavity", finding: "10 mL clear fluid. No adhesions." },
  { cavity: "Left pleural cavity", finding: "10 mL clear fluid. No adhesions." },
  { cavity: "Pericardial sac", finding: "Yellow, glistening, no adhesions or fibrosis. 30 mL straw-colored fluid." },
  { cavity: "Peritoneal cavity", finding: "Minimal fluid." },
]

const organFindings: OrganFinding[] = [
  {
    id: "o1",
    organ: "Heart",
    weightGrams: 400,
    status: "abnormal",
    observations:
      "Large with normal shape; pericardium intact; epicardial fat diffusely firm. No gross infarction. Slightly raised white plaques in left ventricular wall lining. Foramen ovale closed. Left-dominant circulation. Minimal atherosclerosis (max 20% stenosis at LAD bifurcation). LV 2.2 cm, RV 0.2 cm, tricuspid ring 11 cm, pulmonic 8 cm, mitral 10.2 cm, aortic 7 cm.",
  },
  {
    id: "o2",
    organ: "Aorta",
    status: "normal",
    observations: "Minimal atherosclerosis with no measurable plaques along the full length of the ascending and descending aorta.",
  },
  {
    id: "o3",
    organ: "Right lung",
    weightGrams: 630,
    status: "critical",
    observations:
      "Pink parenchyma; bronchi grossly normal. TWO large organizing thrombo-emboli identified: (1) at first branch of pulmonary artery — 1.0 × 1.0 × 2.5 cm older organizing component adherent to vessel wall, surrounded by newer thrombosis completely occluding the bifurcation; (2) further out in vasculature — 1.0 × 1.0 × 1.5 cm. Multiple smaller emboli distending downstream vessels.",
  },
  {
    id: "o4",
    organ: "Left lung",
    weightGrams: 710,
    status: "normal",
    observations: "Pink parenchyma without evidence of congestion or hemorrhage. Bronchi grossly normal.",
  },
  {
    id: "o5",
    organ: "Esophagus & stomach",
    status: "normal",
    observations: "Normal in appearance, no ulcers or varices. Stomach contains ~800 mL of contents with no pills or other non-food material.",
  },
  {
    id: "o6",
    organ: "Pancreas",
    status: "normal",
    observations: "Normal lobular cut surface with evidence of autolysis (post-mortem change).",
  },
  {
    id: "o7",
    organ: "Bowel (duodenum, jejunum, ileum, colon)",
    status: "normal",
    observations: "All grossly normal without evidence of abnormal vasculature or diverticuli.",
  },
  {
    id: "o8",
    organ: "Appendix",
    status: "normal",
    observations: "Present and unremarkable.",
  },
  {
    id: "o9",
    organ: "Liver",
    weightGrams: 2850,
    status: "abnormal",
    observations: "Enlarged. Cut surface reveals normal architecture with no gross fibrosis. Gallbladder in place; bile duct probe-patent through the ampulla of Vater.",
  },
  {
    id: "o10",
    organ: "Spleen",
    weightGrams: 340,
    status: "abnormal",
    observations: "Enlarged. Cut surface reveals normal-appearing white and red pulp.",
  },
  {
    id: "o11",
    organ: "Lymph nodes",
    status: "normal",
    observations: "No abnormally large lymph nodes noted.",
  },
  {
    id: "o12",
    organ: "Right kidney",
    weightGrams: 200,
    status: "normal",
    observations: "Normal-appearing cortex and medulla with intact calyces.",
  },
  {
    id: "o13",
    organ: "Left kidney",
    weightGrams: 210,
    status: "abnormal",
    observations: "Contains a 1.0 × 1.0 × 1.0 cm simple cyst with clear fluid. Otherwise normal cortex and medulla with intact calyces.",
  },
  {
    id: "o14",
    organ: "Prostate & seminal vesicles",
    status: "normal",
    observations: "Normal-appearing tissue without inflammation or embolus.",
  },
  {
    id: "o15",
    organ: "Right adrenal",
    weightGrams: 8,
    status: "normal",
    observations: "Normal position. Cut surface reveals normal cortex and medulla.",
  },
  {
    id: "o16",
    organ: "Left adrenal",
    weightGrams: 11.6,
    status: "normal",
    observations: "Normal position. Cut surface reveals normal cortex and medulla.",
  },
  {
    id: "o17",
    organ: "Thyroid",
    weightGrams: 12.4,
    status: "normal",
    observations: "Grossly normal.",
  },
]

const pathologySamples: PathologySample[] = [
  {
    id: "p1",
    region: "Right pulmonary artery — 1st branch",
    finding:
      "1.0 × 1.0 × 2.5 cm organizing thrombo-embolus adherent to vessel wall (older). Surrounded by newer thrombus completely occluding the bifurcation.",
    ageEstimate: "≥ several days (fibroblast organization)",
    severity: "high",
  },
  {
    id: "p2",
    region: "Right pulmonary vasculature — distal",
    finding: "Second organizing, adherent embolus measuring 1.0 × 1.0 × 1.5 cm.",
    ageEstimate: "≥ several days (organization present)",
    severity: "high",
  },
  {
    id: "p3",
    region: "Right lung — smaller pulmonary vessels",
    finding: "Multiple additional emboli distending the vessels they reside within.",
    severity: "medium",
  },
  {
    id: "p4",
    region: "Pulmonary endothelium",
    finding: "No evidence of endothelial damage in the pulmonary vasculature that would have caused the occlusion.",
    severity: "low",
  },
  {
    id: "p5",
    region: "Left ventricle — wall lining",
    finding: "Slightly raised white plaques noted on gross examination (incidental).",
    severity: "low",
  },
  {
    id: "p6",
    region: "Lower-extremity venous system",
    finding: "No clots produced on milking; calves equal in circumference. No source thrombus localized at autopsy.",
    severity: "medium",
  },
]

const resuscitationTimeline: ResuscitationEvent[] = [
  {
    id: "r1",
    time: "Pre-hospital",
    location: "Patient residence",
    description: "Patient called EMS reporting shortness of breath and chest pain.",
    kind: "vital",
  },
  {
    id: "r2",
    time: "EMS arrival",
    location: "Patient residence",
    description:
      "Patient tachypneic at 40 breaths/min with SpO₂ 90%. Reported as agitated. Lung sounds checked — no evidence of fluid in lung fields.",
    kind: "deterioration",
  },
  {
    id: "r3",
    time: "EMS scene",
    location: "Patient residence",
    description: "Breathing treatments administered.",
    kind: "intervention",
  },
  {
    id: "r4",
    time: "15:00",
    location: "UTMB",
    description: "Patient arrives at UTMB.",
    kind: "vital",
  },
  {
    id: "r5",
    time: "15:02 (≈)",
    location: "UTMB",
    description: "Two minutes after arrival: patient becomes unresponsive and apneic. SpO₂ 80–90%.",
    kind: "deterioration",
  },
  {
    id: "r6",
    time: "15:02 (≈)",
    location: "UTMB",
    description: "Heart rate decreases to asystole. Patient intubated — good breath sounds and air movement confirmed.",
    kind: "intervention",
  },
  {
    id: "r7",
    time: "15:03 (≈)",
    location: "UTMB",
    description:
      "Wide-complex bradycardia identified. ACLS protocol for pulseless electrical activity (PEA) initiated and continued for 45 minutes.",
    kind: "intervention",
  },
  {
    id: "r8",
    time: "During ACLS",
    location: "UTMB",
    description: "Tissue plasminogen activator (TPA) administered — no improvement.",
    kind: "intervention",
  },
  {
    id: "r9",
    time: "During ACLS",
    location: "UTMB",
    description: "Bedside echocardiogram — no pericardial effusion identified.",
    kind: "intervention",
  },
  {
    id: "r10",
    time: "During ACLS",
    location: "UTMB",
    description:
      "Administered: D5W, Narcan, multiple rounds of epinephrine and atropine, calcium chloride, sodium bicarbonate.",
    kind: "intervention",
  },
  {
    id: "r11",
    time: "During ACLS",
    location: "UTMB",
    description:
      "Three episodes of ventricular tachycardia / fibrillation. Cardioversion / defibrillation performed each time, all resulting in asystole.",
    kind: "deterioration",
  },
  {
    id: "r12",
    time: "16:05",
    location: "UTMB",
    description:
      "Patient pronounced dead. Examination: fixed and dilated pupils, no heart sounds, no pulse, no spontaneous respirations.",
    kind: "outcome",
  },
]

const investigationNotes: InvestigationNote[] = [
  {
    id: "n1",
    author: "Examining Pathologist",
    role: "Autopsy",
    timestamp: "Gross examination",
    content:
      "Most significant finding is the presence of multiple old and new thromboemboli in the pulmonary vasculature of the right lung.",
    tag: "observation",
  },
  {
    id: "n2",
    author: "Examining Pathologist",
    role: "Autopsy",
    timestamp: "Gross examination",
    content:
      "Older emboli are organizing and adherent to the vessel wall. Adherence requires a fibroblast response, which takes at least a few days — confirming pre-existing pulmonary embolic disease.",
    tag: "observation",
  },
  {
    id: "n3",
    author: "Examining Pathologist",
    role: "Autopsy",
    timestamp: "Clinicopathologic correlation",
    content:
      "Fatal event was the new thrombosis layered on top of the large saddle thrombus in the pulmonary artery. This created a high-pressure situation the right ventricle could not handle, resulting in cardiac dysfunction and demise.",
    tag: "conclusion",
  },
  {
    id: "n4",
    author: "Examining Pathologist",
    role: "Autopsy",
    timestamp: "Clinicopathologic correlation",
    content:
      "Virchow's triad considered: endothelial injury, stasis, hypercoagulability. Patient's age likely precludes pure venous stasis as sole etiology, though it may have contributed.",
    tag: "hypothesis",
  },
  {
    id: "n5",
    author: "Examining Pathologist",
    role: "Autopsy",
    timestamp: "Clinicopathologic correlation",
    content:
      "Autopsy revealed no evidence of endothelial damage in the pulmonary vasculature that would have caused the occlusion.",
    tag: "observation",
  },
  {
    id: "n6",
    author: "Examining Pathologist",
    role: "Autopsy",
    timestamp: "Clinicopathologic correlation",
    content:
      "Hypercoagulable state is the most likely underlying etiology. Risk factors evaluated: obesity (PRESENT — only known risk factor), trauma (none), surgery (none), cancer (none), Factor V Leiden, prothrombin gene mutation, deficiencies of protein C / S / antithrombin III, plasminogen disorders, lupus anticoagulant. No stigmata of SLE.",
    tag: "hypothesis",
  },
  {
    id: "n7",
    author: "Examining Pathologist",
    role: "Autopsy",
    timestamp: "Recommendation",
    content:
      "The most fruitful search is examination of genetic possibilities for a hypercoagulable state — Factor V Leiden being the most common.",
    tag: "follow-up",
  },
  {
    id: "n8",
    author: "Examining Pathologist",
    role: "Autopsy",
    timestamp: "Summary",
    content:
      "Patient died of pulmonary embolism. The underlying cause of the embolism is currently undetermined; a definitive diagnosis may be ascertained with genetic or other laboratory tests and a more detailed history.",
    tag: "conclusion",
  },
]

const unansweredQuestions = [
  "Underlying cause of the patient's hypercoagulable state remains undetermined.",
  "Source of the original deep-vein thrombus was not identified at autopsy (legs were milked with no clots produced).",
  "Whether obesity alone, or in combination with an inherited thrombophilia, was sufficient to drive recurrent pulmonary embolism.",
]

const recommendedTests = [
  "Factor V Leiden (most common inherited hypercoagulable disorder).",
  "Prothrombin gene mutation (G20210A).",
  "Protein C, Protein S, and Antithrombin III activity assays.",
  "Plasminogen activity / plasminogen disorders panel.",
  "Lupus anticoagulant and antiphospholipid antibody panel.",
  "Detailed medical and family history regarding prior DVT / PE and unexplained thrombotic events.",
]

const causeOfDeath: AnalysisSection["causeOfDeath"] = {
  primary: "Pulmonary thromboembolism — saddle thrombus of the right pulmonary artery",
  immediate:
    "Acute thrombosis layered on top of a pre-existing organizing saddle embolus, completely occluding the right pulmonary artery bifurcation.",
  underlying:
    "Recurrent pulmonary thromboembolic disease in the setting of a presumed hypercoagulable state (etiology undetermined at autopsy).",
  contributing: ["Obesity (only known risk factor)"],
  manner: "natural",
  confidence: 92,
  mechanism:
    "Acute right-sided cardiac dysfunction. Sudden complete occlusion of the right pulmonary artery produced acute pulmonary hypertension that the right ventricle could not overcome → low cardiac output → PEA arrest unresponsive to ACLS.",
  reasoning:
    "Cause of death is anatomically definitive on autopsy. Manner is classified as natural (medical event). The terminal mechanism is unambiguous; the open question is the underlying hypercoagulable etiology, which requires post-mortem genetic and laboratory work-up to fully resolve.",
  extractedFrom: [
    "Autopsy Report — Lungs (gross)",
    "Autopsy Report — Clinicopathologic Correlation",
    "Clinical history (EMS / UTMB course)",
  ],
}

const keyFindings: KeyFinding[] = [
  {
    id: "kf1",
    text: "Saddle thrombus completely occluding the right pulmonary artery bifurcation — direct cause of terminal cardiac dysfunction.",
    weight: "high",
  },
  {
    id: "kf2",
    text: "Multiple pulmonary thromboemboli of differing ages (older organizing + newer thrombosis) — confirms recurrent embolic disease ≥ several days prior to death.",
    weight: "high",
  },
  {
    id: "kf3",
    text: "Bilateral conjunctival petechiae — consistent with terminal hypoxia / agonal pressure rise; not traumatic.",
    weight: "medium",
  },
  {
    id: "kf4",
    text: "Failed thrombolysis (TPA) and 45 minutes of ACLS for PEA — terminal cardiopulmonary collapse refractory to standard resuscitation.",
    weight: "high",
  },
  {
    id: "kf5",
    text: "No source DVT identified on lower-extremity examination (legs milked, no clots produced).",
    weight: "medium",
  },
  {
    id: "kf6",
    text: "Obesity is the only documented risk factor for hypercoagulability; underlying genetic / acquired thrombophilia not yet determined.",
    weight: "medium",
  },
  {
    id: "kf7",
    text: "Incidental: 1.0 cm simple cortical cyst in left kidney; mildly enlarged liver (2850 g) and spleen (340 g) — clinical significance unclear.",
    weight: "low",
  },
]

const totalOrganWeight = organFindings.reduce((s, o) => s + (o.weightGrams ?? 0), 0)

export const autopsyCase: AutopsyCase = {
  caseId: "AUT-2025-0001",
  caseTitle: "35-year-old Male — Sudden Cardiopulmonary Collapse · Pulmonary Embolism",
  status: "completed",
  manner: "natural",

  subject,
  examiner: "Examining Pathologist (student autopsy report — sample)",
  examinationDate: "Per attached autopsy report",
  facility: "UTMB",
  pronouncedAt: "16:05 — UTMB",
  openedDate: "Per ingested report",
  lastUpdated: "On ingest",

  summary:
    "35-year-old African-American male with no significant past medical history presented to EMS with shortness of breath and chest pain, deteriorated rapidly on hospital arrival, and was pronounced dead at 16:05 after 45 minutes of unsuccessful ACLS. Autopsy revealed multiple pulmonary thromboemboli of differing ages in the right lung — the terminal event being a fresh thrombosis layered on a pre-existing saddle embolus, producing acute right-heart failure. Manner: natural; the underlying hypercoagulable etiology is undetermined and requires genetic / laboratory follow-up.",

  keyFindings,

  clinicalHistory: {
    narrative:
      "Patient self-activated EMS for shortness of breath and chest pain. On EMS arrival he was tachypneic at 40 breaths/min with SpO₂ 90% and described as agitated; lung sounds were checked and revealed no fluid in the lung fields. Breathing treatments were administered. Two minutes after arrival at UTMB at 15:00 he became unresponsive and apneic with SpO₂ 80–90%. Heart rate decreased to asystole; he was intubated with good breath sounds and air movement. Wide-complex bradycardia followed and ACLS for PEA was carried out for 45 minutes including TPA, multiple rounds of epinephrine, atropine, calcium chloride and sodium bicarbonate, plus three episodes of VT/VF with cardioversion — each resolving back to asystole. Bedside echocardiogram showed no pericardial effusion. He was pronounced dead at 16:05 with fixed dilated pupils, no heart sounds, no pulse and no spontaneous respirations.",
    presentingComplaints: ["Shortness of breath", "Chest pain", "Agitation"],
    interventions: [
      "Pre-hospital breathing treatments",
      "Endotracheal intubation",
      "ACLS for PEA — 45 minutes",
      "Tissue plasminogen activator (TPA)",
      "D5W, Narcan",
      "Multiple rounds: epinephrine, atropine, calcium chloride, sodium bicarbonate",
      "Three cardioversion / defibrillation attempts (VT/VF → asystole)",
      "Bedside echocardiogram",
    ],
  },
  resuscitationTimeline,

  externalExamination: {
    description:
      "Body of a 35-year-old well-developed, well-nourished male. No peripheral edema. No major surgical scars. Multiple resuscitation devices in place at receipt.",
    findings: externalFindings,
    devicesInPlace: [
      "Nasogastric tube",
      "Endotracheal tube",
      "IV — right hand",
      "IV — left femoral region",
      "Multiple cardiac lead pads on the thorax",
    ],
  },
  bodyCavities,

  organFindings,
  pathology: {
    summary:
      "Pulmonary vascular pathology dominates. Multiple thromboemboli of differing ages are present in the right pulmonary vasculature. The fatal lesion is the recent thrombus layered on a previously organized saddle embolus, which adheres to the vessel wall — confirming that the patient had embolic disease for at least several days prior to the terminal event. There is no endothelial damage in the pulmonary vasculature to explain the occlusion, focusing the etiologic search on a hypercoagulable state.",
    samples: pathologySamples,
  },

  causeOfDeath,
  correlation: {
    summary:
      "Cause of death (pulmonary embolism) is anatomically definitive on autopsy. The unresolved question is the underlying mechanism: a relatively healthy 35-year-old man with a single risk factor (obesity) developed recurrent pulmonary emboli over a period of days, with a final acute thrombosis producing right-heart failure refractory to TPA and ACLS. Virchow's triad analysis points to a hypercoagulable state — most fruitful next step is genetic work-up (Factor V Leiden, prothrombin mutation, protein C/S/AT-III, plasminogen, lupus anticoagulant).",
    notes: investigationNotes,
    unansweredQuestions,
    recommendedTests,
  },

  analysis: {
    injuryPattern: {
      summary:
        "There are NO traumatic injuries. External findings are limited to peri-mortem resuscitation artifact (anterior chest / neck congestion from CPR and lead pads) and bilateral conjunctival petechiae attributable to terminal hypoxia and agonal pressure rise, NOT to assault or mechanical asphyxia.",
      findings: externalFindings,
      overallAssessment:
        "Pattern is non-traumatic. The petechial hemorrhage and chest erythema are entirely explained by the documented resuscitation course and the natural agonal physiology of acute pulmonary embolism. There is no defensive injury, ligature mark, or pattern injury.",
      extractedFrom: ["Autopsy Report — External Examination"],
    },
    causeOfDeath,
    organCondition: {
      summary:
        "Major organs are largely unremarkable except for striking pulmonary vascular pathology. Cardiac chamber dimensions and atherosclerotic burden are minimal — there is no evidence of intrinsic coronary or myocardial disease that would account for sudden death. Mild hepatomegaly (2850 g) and splenomegaly (340 g) are noted; a 1.0 cm simple cortical cyst is present in the left kidney.",
      findings: organFindings,
      extractedFrom: ["Autopsy Report — Internal Examination"],
    },
    tissuePathology: {
      summary:
        "Gross-level pulmonary vascular pathology is diagnostic. The presence of organizing emboli adherent to vessel walls confirms recurrent embolic disease pre-dating the fatal event by at least several days; the layered fresh thrombus on the saddle embolus is the proximate fatal lesion. No endothelial damage is present in the pulmonary vasculature.",
      samples: pathologySamples,
      extractedFrom: ["Autopsy Report — Lungs (gross)", "Autopsy Report — Heart (gross)"],
    },
    investigationNotes: {
      summary:
        "Cause of death anatomically established; underlying hypercoagulable etiology requires post-mortem genetic and laboratory follow-up to fully explain why a relatively healthy 35-year-old developed recurrent pulmonary embolism.",
      notes: investigationNotes,
      unansweredQuestions,
      recommendedTests,
      extractedFrom: ["Autopsy Report — Clinicopathologic Correlation", "Autopsy Report — Summary & Reflection"],
    },
  },

  totalOrganWeightGrams: Math.round(totalOrganWeight),
  organsExamined: organFindings.length,
  resuscitationDurationMinutes: 65, // 15:00 arrival → 16:05 pronounced
}

export const caseList = [autopsyCase]

export function getCaseById(caseId: string): AutopsyCase | null {
  if (caseId === autopsyCase.caseId) return autopsyCase
  return null
}
