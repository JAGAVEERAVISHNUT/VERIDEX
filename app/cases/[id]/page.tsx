import { notFound } from "next/navigation"
import { TopNav } from "@/components/forensic/top-nav"
import { CaseDashboard } from "@/components/forensic/case-dashboard"
import { getCaseById, caseList } from "@/lib/mock-data"
import { apiCaseToForensicCase } from "@/lib/case-adapter"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

export function generateStaticParams() {
  return caseList.map((c) => ({ id: c.caseId }))
}

async function fetchCaseFromApi(id: string) {
  try {
    const res = await fetch(`${API_URL}/cases/${id}`, {
      cache: "no-store", // always fresh
    })
    if (!res.ok) return null
    const apiCase = await res.json()
    return apiCaseToForensicCase(apiCase)
  } catch {
    return null
  }
}

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // 1. Try real API case first
  const apiData = await fetchCaseFromApi(id)
  if (apiData) {
    return (
      <div className="min-h-screen bg-background bg-grid">
        <TopNav />
        <main>
          <CaseDashboard data={apiData} />
        </main>
      </div>
    )
  }

  // 2. Fall back to mock data (for demo cases like VX-2025-04412)
  const mockData = getCaseById(id)
  if (!mockData) notFound()

  return (
    <div className="min-h-screen bg-background bg-grid">
      <TopNav />
      <main>
        <CaseDashboard data={mockData} />
      </main>
    </div>
  )
}
