"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fingerprint, LayoutDashboard, UploadCloud, FolderOpen, Settings, Bell, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Ingest", icon: UploadCloud },
  { href: "#", label: "Cases", icon: FolderOpen },
  { href: "#", label: "Settings", icon: Settings },
]

export function TopNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <Fingerprint className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">VERIDEX</span>
          <span className="hidden md:inline-flex items-center rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Forensic Intelligence
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {navItems.map((item) => {
            const active = item.href === pathname
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-2.5 py-1.5 text-xs text-muted-foreground w-72">
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Search cases, evidence, subjects&hellip;</span>
          <kbd className="ml-auto font-mono text-[10px] text-muted-foreground/70">⌘K</kbd>
        </div>

        <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 ring-1 ring-primary/30 flex items-center justify-center font-mono text-[11px] font-semibold">
            MO
          </div>
          <div className="hidden lg:flex flex-col leading-tight">
            <span className="text-xs font-medium">Det. M. Okafor</span>
            <span className="font-mono text-[10px] text-muted-foreground">Badge #4421</span>
          </div>
        </div>
      </div>
    </header>
  )
}
