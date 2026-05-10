"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { use } from "react"
import { TopNav } from "@/components/forensic/top-nav"
import { CaseDashboard } from "@/components/forensic/case-dashboard"
import { useCasesStore } from "@/lib/cases-store"

export default function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const data = useCasesStore((s) => s.getCaseById(id))

  if (!data) notFound()

  return (
    <div className="min-h-screen bg-background bg-grid">
      <TopNav />
      <div className="border-b border-border bg-card/20">
        <div className="px-4 md:px-6 py-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
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
