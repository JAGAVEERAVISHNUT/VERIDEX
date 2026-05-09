import { notFound } from "next/navigation"
import Link from "next/link"
import { TopNav } from "@/components/forensic/top-nav"
import { CaseDashboard } from "@/components/forensic/case-dashboard"
import { getCaseById } from "@/lib/mock-data"
import { getGeneratedCase } from "@/lib/case-store"

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let data = getGeneratedCase(id)
  if (!data) {
    data = getCaseById(id)
  }
  if (!data) notFound()

  return (
    <div className="min-h-screen bg-background bg-grid">
      <TopNav />
      <div className="border-b border-border bg-card/20">
        <div className="px-4 md:px-6 py-2">
          <Link
            href="/cases"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-mono uppercase tracking-wider">Back to Cases</span>
          </Link>
        </div>
      </div>
      <main>
        <CaseDashboard data={data} />
      </main>
    </div>
  )
}
