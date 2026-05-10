"use client"

import { create } from "zustand" // Zustand state management
import { caseList, type AutopsyCase } from "@/lib/mock-data"

interface CasesStore {
  uploadedCases: AutopsyCase[]
  cases: AutopsyCase[] // Combined cases - stable reference
  addCase: (c: AutopsyCase) => void
  getCaseById: (id: string) => AutopsyCase | null
}

export const useCasesStore = create<CasesStore>((set, get) => ({
  uploadedCases: [],
  cases: [...caseList], // Initialize with mock data
  addCase: (c) =>
    set((state) => ({
      uploadedCases: [c, ...state.uploadedCases],
      cases: [c, ...state.uploadedCases, ...caseList], // Update combined cases
    })),
  getCaseById: (id) => {
    const uploaded = get().uploadedCases.find((c) => c.caseId === id)
    if (uploaded) return uploaded
    return caseList.find((c) => c.caseId === id) ?? null
  },
}))
