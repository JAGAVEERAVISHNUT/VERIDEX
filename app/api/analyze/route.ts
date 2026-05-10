// Mock analyze API - simulates PDF processing without actual parsing or AI calls

function generateMockCase(fileName: string) {
  const caseId = `ME-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`
  const names = ["John Doe", "Jane Smith", "Robert Johnson", "Maria Garcia", "William Brown"]
  const manners = ["natural", "accident", "homicide", "undetermined"] as const
  const randomName = names[Math.floor(Math.random() * names.length)]
  const randomManner = manners[Math.floor(Math.random() * manners.length)]

  return {
    caseId,
    caseTitle: `${randomName} - ${randomManner.charAt(0).toUpperCase() + randomManner.slice(1)} Death Investigation`,
    status: "completed",
    manner: randomManner,
    subject: {
      age: Math.floor(Math.random() * 60) + 20,
      sex: Math.random() > 0.5 ? "Male" : "Female",
      ethnicity: "Caucasian",
      pastMedicalHistory: "Hypertension, Type 2 Diabetes",
      knownRiskFactors: ["Smoking history", "Obesity"],
    },
    examiner: "Dr. Sarah Mitchell, M.D., Chief Medical Examiner",
    examinationDate: new Date().toISOString().split("T")[0],
    facility: "County Medical Examiner's Office",
    pronouncedAt: `${new Date().toLocaleDateString()} at General Hospital`,
    openedDate: new Date().toISOString().split("T")[0],
    lastUpdated: new Date().toISOString(),
    summary: `Autopsy examination of ${randomName} performed following ${randomManner} death. Document "${fileName}" has been analyzed and processed.`,
    keyFindings: [
      { id: "kf1", text: "Significant cardiac hypertrophy observed", weight: "high" },
      { id: "kf2", text: "Evidence of chronic pulmonary disease", weight: "medium" },
      { id: "kf3", text: "No evidence of acute trauma", weight: "low" },
    ],
    clinicalHistory: {
      narrative: "Patient had a history of cardiovascular disease with multiple hospital admissions.",
      presentingComplaints: ["Chest pain", "Shortness of breath"],
      interventions: ["CPR performed", "Advanced cardiac life support"],
    },
    resuscitationTimeline: [
      { id: "rt1", time: "14:30", location: "Home", description: "Patient found unresponsive", kind: "deterioration" },
      { id: "rt2", time: "14:35", location: "Home", description: "EMS called, CPR initiated", kind: "intervention" },
      { id: "rt3", time: "15:10", location: "Hospital", description: "Pronounced deceased", kind: "outcome" },
    ],
    externalExamination: {
      description: "Well-developed, well-nourished adult in early decomposition.",
      findings: [
        { id: "ex1", region: "Head", description: "No external injuries", significance: "low", perimortem: false },
        { id: "ex2", region: "Torso", description: "Medical intervention marks present", significance: "low", perimortem: true },
      ],
      devicesInPlace: ["IV catheter right arm", "ECG leads on chest"],
    },
    bodyCavities: [
      { cavity: "Thoracic", finding: "Minimal pleural effusion bilaterally" },
      { cavity: "Abdominal", finding: "No free fluid, organs in normal anatomical position" },
      { cavity: "Cranial", finding: "No epidural or subdural hemorrhage" },
    ],
    organFindings: [
      { id: "of1", organ: "Heart", weightGrams: 420, status: "abnormal", observations: "Left ventricular hypertrophy, 90% occlusion of LAD" },
      { id: "of2", organ: "Lungs", weightGrams: 950, status: "abnormal", observations: "Pulmonary edema and congestion bilaterally" },
      { id: "of3", organ: "Liver", weightGrams: 1650, status: "normal", observations: "Mild fatty changes" },
      { id: "of4", organ: "Brain", weightGrams: 1380, status: "normal", observations: "No gross abnormalities" },
      { id: "of5", organ: "Kidneys", weightGrams: 310, status: "normal", observations: "Mild arteriolosclerosis" },
    ],
    pathology: {
      summary: "Microscopic examination reveals significant cardiovascular pathology consistent with chronic disease.",
      samples: [
        { id: "ps1", region: "Myocardium", finding: "Interstitial fibrosis and myocyte hypertrophy", severity: "high" },
        { id: "ps2", region: "Coronary arteries", finding: "Severe atherosclerosis with calcification", severity: "high" },
        { id: "ps3", region: "Lung tissue", finding: "Chronic passive congestion", severity: "medium" },
      ],
    },
    causeOfDeath: {
      primary: "Acute myocardial infarction",
      immediate: "Cardiac arrhythmia",
      underlying: "Coronary artery disease",
      contributing: ["Hypertensive heart disease", "Type 2 Diabetes Mellitus"],
      manner: randomManner,
      confidence: 92,
      mechanism: "Cardiac arrest secondary to acute coronary occlusion",
      reasoning: "Autopsy findings consistent with acute cardiac event in setting of severe coronary atherosclerosis.",
      extractedFrom: ["Gross examination", "Microscopic examination", "Clinical history"],
    },
    correlation: {
      summary: "Autopsy findings correlate well with clinical presentation and history.",
      notes: [
        { id: "n1", author: "Dr. Mitchell", role: "ME", timestamp: new Date().toISOString(), content: "Findings consistent with natural cardiac death", tag: "conclusion" },
      ],
      unansweredQuestions: [],
      recommendedTests: ["Toxicology panel", "Vitreous glucose"],
    },
    analysis: {
      injuryPattern: { summary: "No significant injuries identified", findings: [], overallAssessment: "Non-traumatic death", extractedFrom: ["External examination"] },
      causeOfDeath: {
        primary: "Acute myocardial infarction",
        immediate: "Cardiac arrhythmia",
        underlying: "Coronary artery disease",
        contributing: ["Hypertensive heart disease"],
        manner: randomManner,
        confidence: 92,
        mechanism: "Cardiac arrest",
        reasoning: "Consistent with natural cardiac death",
        extractedFrom: ["Autopsy examination"],
      },
      organCondition: { summary: "Significant cardiac pathology, other organs within normal limits", findings: [], extractedFrom: ["Organ examination"] },
      tissuePathology: { summary: "Microscopic changes consistent with chronic cardiovascular disease", samples: [], extractedFrom: ["Histology"] },
      investigationNotes: { summary: "Case closed as natural death", notes: [], unansweredQuestions: [], recommendedTests: [], extractedFrom: ["Case notes"] },
    },
    totalOrganWeightGrams: 4710,
    organsExamined: 5,
    resuscitationDurationMinutes: 40,
  }
}

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

    // Check file type
    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf")
    const isText = file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")

    if (!isPDF && !isText) {
      return Response.json({ status: "invalid", message: "Unsupported file type" }, { status: 422 })
    }

    // Simulate 10 seconds of processing time
    await new Promise((resolve) => setTimeout(resolve, 10000))

    // Generate mock case data
    const mockCase = generateMockCase(file.name)

    // Return success with mock case data
    return Response.json({ status: "valid", case: mockCase })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    return Response.json({ 
      status: "error", 
      message: `Analysis failed: ${errorMessage}` 
    }, { status: 500 })
  }
}
