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

// ---------------------------------------------------------------------------
// Second case — William Debose (ME# 2020-1949)
// City and County of Denver, Office of the Medical Examiner
// Examiner: Meredith A. Frank, M.D. / Signed: James L. Caruso, M.D.
// All data strictly from the attached autopsy report.
// ---------------------------------------------------------------------------

const deboseSubject: Subject = {
  age: 21,
  sex: "Male",
  ethnicity: "Not specified in report",
  pastMedicalHistory: "No evidence of significant natural disease processes",
  knownRiskFactors: [],
}

const deboseExternalFindings: ExternalFinding[] = [
  {
    id: "dex1",
    region: "Right upper chest",
    description:
      "Entrance gunshot wound — 3/16-inch skin defect with 3/16-inch eccentric marginal abrasion between 7 and 11 o'clock. Located approximately 13¾ inches below top of head and 2¼ inches right of anterior midline. No soot deposition or gunpowder stippling.",
    significance: "high",
    perimortem: true,
  },
  {
    id: "dex2",
    region: "Left upper back",
    description:
      "Exit wound — ½-inch irregular laceration, approximately 15¼ inches below top of head and 3³⁄₁₆ inches left of posterior midline. No projectile or fragments recovered.",
    significance: "high",
    perimortem: true,
  },
  {
    id: "dex3",
    region: "Lateral left thigh",
    description:
      "Entrance gunshot wound — 3/16-inch skin defect with 3/16-inch eccentric marginal abrasion between 5 and 7 o'clock. Located approximately 35½ inches above bottom of left foot. No soot deposition or gunpowder stippling.",
    significance: "high",
    perimortem: true,
  },
  {
    id: "dex4",
    region: "Face — bridge and left side of nose",
    description: "1¼ × ¾-inch irregular abrasion on bridge of nose and left side of nose.",
    significance: "low",
    perimortem: true,
  },
  {
    id: "dex5",
    region: "Forehead — mid and left",
    description: "3½ × 1½-inch irregular abrasion.",
    significance: "low",
    perimortem: true,
  },
  {
    id: "dex6",
    region: "Left side of face",
    description: "1¾ × ½-inch abrasion.",
    significance: "low",
    perimortem: true,
  },
  {
    id: "dex7",
    region: "Right knee",
    description: "¾ × ½-inch abrasion.",
    significance: "low",
    perimortem: true,
  },
  {
    id: "dex8",
    region: "Left knee",
    description: "½ × ½-inch abrasion.",
    significance: "low",
    perimortem: true,
  },
  {
    id: "dex9",
    region: "Left wrist",
    description: "Few small abrasions with postmortem appearance.",
    significance: "low",
    perimortem: false,
  },
]

const deboseBodyCavities: BodyCavity[] = [
  {
    cavity: "Right pleural cavity",
    finding: "Approximately 1000 mL of blood — associated with chest gunshot wound path.",
  },
  {
    cavity: "Left pleural cavity",
    finding:
      "Approximately 50 mL of blood after surgical intervention — associated with chest gunshot wound path.",
  },
  {
    cavity: "Peritoneal cavity",
    finding: "No abnormal fluid accumulation.",
  },
  {
    cavity: "Pericardial sac",
    finding: "Surgically opened at hospital. No pericardial effusion on surgical examination.",
  },
]

const deboseOrganFindings: OrganFinding[] = [
  {
    id: "do1",
    organ: "Heart",
    weightGrams: 270,
    status: "normal",
    observations:
      "Occupies usual mediastinal site. Epicardial surfaces smooth. Coronary arteries normal, right-dominant pattern, no atherosclerotic luminal narrowing. Myocardium red-brown and firm. LV 1.5 cm, RV 0.4 cm, IVS 1.5 cm. Valve cusps free of fusion or vegetations. Aorta without aneurysm or dissection. Injury to aorta arch and superior vena cava previously described.",
  },
  {
    id: "do2",
    organ: "Right lung",
    weightGrams: 230,
    status: "critical",
    observations:
      "Hypoinflated. Parenchyma minimally congested, red-purple. Small amount of blood and fluid on sectioning. Pleural surface shows previously described gunshot injuries and mild anthracotic pigment. No consolidation or scarring.",
  },
  {
    id: "do3",
    organ: "Left lung",
    weightGrams: 280,
    status: "critical",
    observations:
      "Hypoinflated. Parenchyma minimally congested. Pleural surface shows previously described gunshot injuries. No consolidation or scarring. Pulmonary vessels patent.",
  },
  {
    id: "do4",
    organ: "Aorta & superior vena cava",
    status: "critical",
    observations:
      "Arch of aorta perforated along the gunshot wound path. Superior vena cava perforated. No atherosclerotic changes. Intimal surfaces otherwise without aneurysm or dissection.",
  },
  {
    id: "do5",
    organ: "Stomach",
    status: "normal",
    observations:
      "Intact mucosal surfaces; lumen contains approximately 350 mL of tan fluid. No pills or pill fragments. No ulceration or scarring.",
  },
  {
    id: "do6",
    organ: "Small and large intestines",
    status: "normal",
    observations: "Unremarkable. Appendix present.",
  },
  {
    id: "do7",
    organ: "Pancreas",
    status: "normal",
    observations: "Lobular, tan, normal but pale appearance. No necrosis, gross hemorrhage, or lesions. Ducts patent.",
  },
  {
    id: "do8",
    organ: "Liver",
    weightGrams: 1850,
    status: "normal",
    observations:
      "Intact capsule covering pale, red-tan parenchyma. No localizing masses or lesions. Intra- and extrahepatic ducts patent. Gallbladder contains trace dark green bile and no stones.",
  },
  {
    id: "do9",
    organ: "Right kidney",
    weightGrams: 140,
    status: "normal",
    observations:
      "Capsule strips without difficulty. Cortical surfaces smooth and pale. Cortices delineated from medullae. Renal vessels patent.",
  },
  {
    id: "do10",
    organ: "Left kidney",
    weightGrams: 160,
    status: "normal",
    observations: "Capsule strips without difficulty. Cortical surfaces smooth and pale. Renal vessels patent.",
  },
  {
    id: "do11",
    organ: "Urinary bladder",
    status: "normal",
    observations: "Contains approximately 100 mL of urine. Mucosa unremarkable.",
  },
  {
    id: "do12",
    organ: "Prostate gland",
    status: "normal",
    observations: "Normal appearing on sectioning.",
  },
  {
    id: "do13",
    organ: "Testes",
    status: "normal",
    observations: "Free of trauma or significant natural disease processes.",
  },
  {
    id: "do14",
    organ: "Spleen",
    weightGrams: 80,
    status: "normal",
    observations: "Smooth, intact capsule. Parenchyma red-purple, uniform. Regional lymph nodes grossly unremarkable.",
  },
  {
    id: "do15",
    organ: "Adrenal glands",
    status: "normal",
    observations: "Unremarkable. Normal cortex and medulla bilaterally.",
  },
  {
    id: "do16",
    organ: "Pituitary gland",
    status: "normal",
    observations: "Unremarkable.",
  },
  {
    id: "do17",
    organ: "Thyroid gland",
    status: "normal",
    observations: "Unremarkable externally. Sectioning shows absence of lesions.",
  },
  {
    id: "do18",
    organ: "Brain",
    weightGrams: 1240,
    status: "normal",
    observations:
      "Externally unremarkable and symmetrical. Blood vessels at base intact and free of atherosclerosis. Multiple coronal sections of cerebrum, cerebellum, and brainstem reveal absence of significant natural disease processes. Scalp reflects without hemorrhage.",
  },
  {
    id: "do19",
    organ: "Cervical spine and anterior neck",
    status: "normal",
    observations:
      "No hemorrhage into strap muscles. Thyroid cartilage and hyoid bone intact. Cervical spine free of injury. Upper airway patent.",
  },
  {
    id: "do20",
    organ: "Musculoskeletal system",
    status: "normal",
    observations:
      "Major muscle groups show no atrophic changes, symmetrical development. Axial and appendicular skeleton unremarkable except previously described rib fracture (posterior left 5th rib).",
  },
]

const debosePathologySamples: PathologySample[] = [
  {
    id: "dp1",
    region: "Right chest — wound track",
    finding:
      "Wound path: skin → subcutaneous tissue → muscle → right pleural cavity → sternum at junction with right 1st rib → upper lobe right lung → arch of aorta → superior vena cava → upper and lower lobes left lung → left pleural cavity → posterior left 5th rib (fracture) → muscle → subcutaneous → skin (exit). Approximately 1000 mL blood in right pleural cavity.",
    severity: "high",
  },
  {
    id: "dp2",
    region: "Left thigh — wound track",
    finding:
      "Wound path: skin → subcutaneous tissue → muscle of left thigh → soft tissue of left pubic area. Projectile recovered at approximately 31⅞ inches below top of head, 4 inches left of anterior midline, in subcutaneous tissue of pubic area. Hemorrhage along wound path.",
    severity: "high",
  },
  {
    id: "dp3",
    region: "Toxicology — peripheral blood",
    finding:
      "Ethanol detected at non-toxic level. Cannabinoids detected at levels consistent with frequent use. No other substances reported.",
    severity: "low",
  },
  {
    id: "dp4",
    region: "Representative organ sections",
    finding:
      "Retained in formalin without preparation of glass slides. No microscopic sections prepared for this report.",
    severity: "low",
  },
]

const deboseResuscitationTimeline: ResuscitationEvent[] = [
  {
    id: "dr1",
    time: "May 1, 2020 — prior to 22:55",
    location: "Scene",
    description: "Altercation with law enforcement personnel resulting in gunshot wounds.",
    kind: "deterioration",
  },
  {
    id: "dr2",
    time: "Scene / Transit",
    location: "Local hospital",
    description: "Decedent transported to local hospital. Resuscitation efforts commenced.",
    kind: "intervention",
  },
  {
    id: "dr3",
    time: "Hospital",
    location: "Local hospital",
    description:
      "Medical intervention: endotracheal intubation, intraosseous catheter (lateral right arm), vascular access (right subclavian), 14-inch chest tube incision (right), 11-inch sutured thoracotomy incision (left), pericardial sac surgically opened.",
    kind: "intervention",
  },
  {
    id: "dr4",
    time: "May 1, 2020 — 22:55",
    location: "Local hospital",
    description: "Pronounced dead. Date and time of death: May 1, 2020 at 2255 hours.",
    kind: "outcome",
  },
]

const deboseInvestigationNotes: InvestigationNote[] = [
  {
    id: "dn1",
    author: "Meredith A. Frank, M.D.",
    role: "Assistant Medical Examiner",
    timestamp: "May 2, 2020 — 08:45",
    content:
      "Autopsy performed at the Denver Office of the Medical Examiner beginning at 08:45. Conor McGuinn assisting.",
    tag: "observation",
  },
  {
    id: "dn2",
    author: "Meredith A. Frank, M.D.",
    role: "Assistant Medical Examiner",
    timestamp: "Gross examination",
    content:
      "Two gunshot wounds identified. Chest wound (right to left, front to back, downward) perforated aorta and superior vena cava — rapidly fatal injuries. Thigh wound (left to right, slightly back to front, upward) injured soft tissue only; projectile recovered.",
    tag: "observation",
  },
  {
    id: "dn3",
    author: "Meredith A. Frank, M.D.",
    role: "Assistant Medical Examiner",
    timestamp: "Gross examination",
    content:
      "No soot deposition or gunpowder stippling on the skin surrounding either entrance wound — consistent with an indeterminate range of fire (not close range).",
    tag: "observation",
  },
  {
    id: "dn4",
    author: "Meredith A. Frank, M.D.",
    role: "Assistant Medical Examiner",
    timestamp: "Clinicopathologic correlation",
    content:
      "Minor cutaneous blunt force injuries of the face and both knees are consistent with terminal collapse and are not indicative of a separate assault event.",
    tag: "conclusion",
  },
  {
    id: "dn5",
    author: "James L. Caruso, M.D.",
    role: "Chief Medical Examiner / Coroner",
    timestamp: "June 12, 2020",
    content:
      "Cause of death: gunshot wound of the chest injuring both lungs, the aorta, and the superior vena cava. Manner of death: homicide.",
    tag: "conclusion",
  },
]

const deboseCauseOfDeath: AnalysisSection["causeOfDeath"] = {
  primary: "Gunshot wound of the chest",
  immediate: "Perforation of the aorta (arch) and superior vena cava with bilateral hemothorax",
  underlying: "Homicidal gunshot wound",
  contributing: [
    "Bilateral hemothorax (right: ~1000 mL, left: ~50 mL after surgery)",
    "Hemorrhage along the wound path",
    "Non-toxic ethanol level (incidental)",
    "Cannabinoids at levels consistent with frequent use (incidental)",
  ],
  manner: "homicide",
  confidence: 98,
  mechanism:
    "Perforating gunshot wound traversing the right lung, aortic arch, and superior vena cava produced massive hemorrhage and bilateral hemothorax. Rapid exsanguination and cardiopulmonary collapse were unsurvivable despite surgical intervention.",
  reasoning:
    "Cause of death anatomically definitive at autopsy. Manner is homicide: the chest wound trajectory (right to left, front to back, downward), the absence of close-range discharge stippling from either entrance, and the circumstances of the altercation are consistent with homicide by firearm. The thigh wound contributed to hemorrhage but was not independently fatal.",
  extractedFrom: [
    "Autopsy Report — Anatomic Diagnoses",
    "Autopsy Report — Opinion (James L. Caruso, M.D.)",
    "Autopsy Report — External Examination",
    "Autopsy Report — Internal Examination",
  ],
}

const deboseKeyFindings: KeyFinding[] = [
  {
    id: "dkf1",
    text: "Perforating gunshot wound of the chest — right to left, front to back, downward — perforating the aortic arch and superior vena cava. Direct cause of death.",
    weight: "high",
  },
  {
    id: "dkf2",
    text: "Bilateral hemothorax: ~1000 mL (right) and ~50 mL (left after surgery). Massive hemorrhage incompatible with survival.",
    weight: "high",
  },
  {
    id: "dkf3",
    text: "No soot deposition or gunpowder stippling at either entrance wound — indeterminate range of fire, not close-contact.",
    weight: "medium",
  },
  {
    id: "dkf4",
    text: "Second gunshot wound to lateral left thigh — soft tissue injury only; projectile recovered in subcutaneous pubic tissue. Not independently fatal.",
    weight: "medium",
  },
  {
    id: "dkf5",
    text: "Minor cutaneous blunt force injuries of face and both knees consistent with terminal collapse.",
    weight: "low",
  },
  {
    id: "dkf6",
    text: "Toxicology: non-toxic ethanol and cannabinoids (frequent-use pattern). No other substances detected.",
    weight: "low",
  },
  {
    id: "dkf7",
    text: "No evidence of significant natural disease processes — no pre-existing cardiopulmonary disease or contributory condition.",
    weight: "low",
  },
]

const deboseTotalOrganWeight = deboseOrganFindings.reduce((s, o) => s + (o.weightGrams ?? 0), 0)

export const deboseCase: AutopsyCase = {
  caseId: "AUT-2020-1949",
  caseTitle: "William Debose — Homicide · Gunshot Wound of the Chest",
  status: "completed",
  manner: "homicide",

  subject: deboseSubject,
  examiner: "Meredith A. Frank, M.D. (AME) / James L. Caruso, M.D. (Chief ME)",
  examinationDate: "May 2, 2020 — 08:45",
  facility: "City and County of Denver, Office of the Medical Examiner",
  pronouncedAt: "May 1, 2020 — 22:55 (local hospital)",
  openedDate: "May 2, 2020",
  lastUpdated: "June 12, 2020",

  summary:
    "21-year-old male sustained two gunshot wounds during an altercation with law enforcement. The chest wound (right to left, front to back, downward) perforated both lungs, the aortic arch, and the superior vena cava, producing bilateral hemothorax and exsanguination despite emergency surgical intervention. The thigh wound injured soft tissue only; one projectile was recovered. No close-range discharge indicators were present at either entrance wound. Manner of death: homicide. No significant natural disease processes identified.",

  keyFindings: deboseKeyFindings,

  clinicalHistory: {
    narrative:
      "A 21-year-old male was involved in an altercation with law enforcement and sustained two gunshot wounds. He was transported to a local hospital where resuscitation efforts — including endotracheal intubation, chest tube placement, thoracotomy, and vascular access — were unsuccessful. He was pronounced dead at 2255 hours on May 1, 2020.",
    presentingComplaints: ["Gunshot wounds (chest and left thigh)", "Cardiopulmonary collapse"],
    interventions: [
      "Endotracheal intubation",
      "Intraosseous catheter — lateral right arm",
      "Vascular access device — right subclavian",
      "14-inch chest tube incision — right",
      "11-inch sutured thoracotomy incision — left",
      "Pericardial sac surgically opened",
    ],
  },
  resuscitationTimeline: deboseResuscitationTimeline,

  externalExamination: {
    description:
      "Unembalmed adult male, 151 lbs, 69½ inches. Rigor mortis present and equal throughout. Livor mortis posterior and fixed except in areas exposed to pressure. Body temperature that of refrigeration unit. Body received unclad in unsealed body bag wrapped in hospital sheets.",
    findings: deboseExternalFindings,
    devicesInPlace: [
      "Endotracheal tube",
      "Intraosseous catheter — lateral right arm",
      "Vascular access device — right subclavian",
      "14-inch chest tube incision site — right",
      "11-inch sutured thoracotomy incision site — left",
      "Hospital identification band — right wrist",
    ],
  },
  bodyCavities: deboseBodyCavities,

  organFindings: deboseOrganFindings,
  pathology: {
    summary:
      "Two gunshot wound tracks dominate the pathologic findings. The chest wound perforated major vessels (aorta and SVC) producing massive hemorrhage. The thigh wound produced local soft-tissue hemorrhage only. Toxicology detected non-toxic ethanol and cannabinoids. Representative organ sections were retained in formalin; no microscopic slides were prepared.",
    samples: debosePathologySamples,
  },

  causeOfDeath: deboseCauseOfDeath,
  correlation: {
    summary:
      "Cause and manner of death are unambiguous. Both entrance wounds lack stippling or soot, consistent with indeterminate (not close-range) discharge. One projectile recovered from the thigh track; none from the through-and-through chest wound. Crime laboratory received recovered projectile and trace evidence.",
    notes: deboseInvestigationNotes,
    unansweredQuestions: [
      "Precise firing distance and relative positions of shooter and decedent at time of discharge.",
      "Ballistic comparison of recovered projectile to specific firearm(s).",
    ],
    recommendedTests: [
      "Ballistic analysis of recovered projectile.",
      "Comparison with firearm(s) involved in the altercation.",
      "Full toxicology quantitation report.",
    ],
  },

  analysis: {
    injuryPattern: {
      summary:
        "Two discrete gunshot wounds. (1) Chest: perforating entrance right upper chest → exit left upper back, traversing aorta and SVC — fatal. (2) Thigh: penetrating entrance lateral left thigh → projectile stopped in pubic subcutaneous tissue — non-fatal. Additional minor blunt-force abrasions on face and knees attributed to terminal collapse.",
      findings: deboseExternalFindings,
      overallAssessment:
        "Injury pattern is consistent with two firearm discharges at indeterminate range. The chest wound trajectory and major-vessel perforation are the anatomic basis for death. Minor facial and knee abrasions are terminal-collapse artifacts and do not indicate a separate assault.",
      extractedFrom: [
        "Autopsy Report — Anatomic Diagnoses",
        "Autopsy Report — External Examination",
        "Autopsy Report — Internal Examination",
      ],
    },
    causeOfDeath: deboseCauseOfDeath,
    organCondition: {
      summary:
        "With the exception of the gunshot wound injuries to the lungs, aorta, and superior vena cava, all major organs are unremarkable. There is no evidence of pre-existing cardiovascular, pulmonary, or systemic disease. Both lungs are hypoinflated secondary to hemothorax.",
      findings: deboseOrganFindings,
      extractedFrom: ["Autopsy Report — Internal Examination"],
    },
    tissuePathology: {
      summary:
        "Pathology is entirely traumatic. The chest wound track perforated the aortic arch and SVC producing ~1050 mL of combined hemothorax. The thigh wound track terminated in the pubic subcutaneous tissue. Toxicology: non-toxic ethanol and cannabinoids consistent with frequent use.",
      samples: debosePathologySamples,
      extractedFrom: [
        "Autopsy Report — Evidence of Injury",
        "Autopsy Report — Drugs and Alcohol",
      ],
    },
    investigationNotes: {
      summary:
        "Manner of death is homicide. Cause anatomically definitive. Key open items are ballistic analysis of the recovered projectile and quantitative toxicology.",
      notes: deboseInvestigationNotes,
      unansweredQuestions: [
        "Precise firing distance and relative positioning at time of discharge.",
        "Ballistic comparison of recovered projectile to specific firearm(s).",
      ],
      recommendedTests: [
        "Ballistic analysis of recovered projectile.",
        "Comparison with firearm(s) involved in the altercation.",
        "Full toxicology quantitation report.",
      ],
      extractedFrom: [
        "Autopsy Report — Opinion",
        "Autopsy Report — Additional Procedures",
        "Autopsy Report — Specimens",
      ],
    },
  },

  totalOrganWeightGrams: Math.round(deboseTotalOrganWeight),
  organsExamined: deboseOrganFindings.length,
  resuscitationDurationMinutes: 0, // Time of death at scene/hospital; duration not specified in report
}

export const caseList = [autopsyCase, deboseCase]

export function getCaseById(caseId: string): AutopsyCase | null {
  return caseList.find((c) => c.caseId === caseId) ?? null
}
