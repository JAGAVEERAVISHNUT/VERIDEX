import { ForensicCase } from "./mock-data";

// In-memory store to hold dynamically generated cases
const store = new Map<string, ForensicCase>();

export function saveCase(caseId: string, data: ForensicCase) {
  store.set(caseId, data);
}

export function getGeneratedCase(caseId: string): ForensicCase | undefined {
  return store.get(caseId);
}

export function getAllGeneratedCases(): ForensicCase[] {
  return Array.from(store.values());
}
