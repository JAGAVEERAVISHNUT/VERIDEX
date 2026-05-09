import { TopNav } from "@/components/forensic/top-nav"
import { CasesGrid } from "@/components/forensic/cases-grid"

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <TopNav />
      <main className="px-4 md:px-6 py-6 max-w-[1600px] mx-auto">
        <CasesGrid />
      </main>
    </div>
  )
}
