import { TopNav } from "@/components/forensic/top-nav"
import { SettingsView } from "@/components/forensic/settings-view"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        <SettingsView />
      </main>
    </div>
  )
}
