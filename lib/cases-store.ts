"use client"

import { create } from "zustand" // Zustand state management
import { caseList, type AutopsyCase } from "@/lib/mock-data"

interface CasesStore {
  uploadedCases: AutopsyCase[]
  addCase: (c: AutopsyCase) => void
  getAllCases: () => AutopsyCase[]
  getCaseById: (id: string) => AutopsyCase | null
}

export const useCasesStore = create<CasesStore>((set, get) => ({
  uploadedCases: [],
  addCase: (c) =>
    set((state) => ({
      uploadedCases: [c, ...state.uploadedCases],
    })),
  getAllCases: () => [...get().uploadedCases, ...caseList],
  getCaseById: (id) => {
    const uploaded = get().uploadedCases.find((c) => c.caseId === id)
    if (uploaded) return uploaded
    return caseList.find((c) => c.caseId === id) ?? null
  },
}))
