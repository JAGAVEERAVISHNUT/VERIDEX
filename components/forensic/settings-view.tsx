"use client"

import { useState } from "react"
import {
  User,
  Bell,
  Shield,
  Database,
  Cpu,
  KeyRound,
  Palette,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

export function SettingsView() {
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            System Configuration
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your investigator profile, AI engine, evidence pipeline, and security policies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[--color-risk-low] font-mono">
              <CheckCircle2 className="h-3.5 w-3.5" />
              CHANGES SAVED
            </span>
          )}
          <Button variant="outline" size="sm">
            Reset
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-secondary/50 border border-border h-auto flex-wrap justify-start gap-1 p-1">
          <TabsTrigger value="profile" className="gap-2 text-xs">
            <User className="h-3.5 w-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2 text-xs">
            <Cpu className="h-3.5 w-3.5" /> AI Engine
          </TabsTrigger>
          <TabsTrigger value="evidence" className="gap-2 text-xs">
            <Database className="h-3.5 w-3.5" /> Evidence
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 text-xs">
            <Bell className="h-3.5 w-3.5" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 text-xs">
            <Shield className="h-3.5 w-3.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2 text-xs">
            <Palette className="h-3.5 w-3.5" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2 text-xs">
            <KeyRound className="h-3.5 w-3.5" /> API & Keys
          </TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile">
          <Card className="bg-card border-border">
            <div className="p-5 space-y-5">
              <SectionHeader
                title="Investigator profile"
                description="Identity and credential metadata used in case audit trails."
              />
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 ring-1 ring-primary/30 flex items-center justify-center font-mono text-lg font-semibold">
                  MO
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Det. M. Okafor</span>
                  <span className="font-mono text-[11px] text-muted-foreground">Badge #4421 · Sector 7</span>
                  <Button variant="outline" size="sm" className="mt-2 w-fit text-xs">
                    Replace photo
                  </Button>
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="grid md:grid-cols-2 gap-4">
                <FieldRow label="Full name">
                  <Input defaultValue="Marcus Okafor" />
                </FieldRow>
                <FieldRow label="Badge number">
                  <Input defaultValue="4421" className="font-mono" />
                </FieldRow>
                <FieldRow label="Email">
                  <Input type="email" defaultValue="m.okafor@veridex.gov" />
                </FieldRow>
                <FieldRow label="Phone">
                  <Input defaultValue="+1 (555) 421-7700" />
                </FieldRow>
                <FieldRow label="Division">
                  <Select defaultValue="metro-7">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metro-7">Metro Forensics — Sector 7</SelectItem>
                      <SelectItem value="metro-2">Metro Forensics — Sector 2</SelectItem>
                      <SelectItem value="coastal-3">Coastal Division — Sector 3</SelectItem>
                      <SelectItem value="rural-11">Rural Division — Sector 11</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
                <FieldRow label="Clearance level">
                  <Select defaultValue="tier-4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tier-2">Tier 2 — Standard</SelectItem>
                      <SelectItem value="tier-3">Tier 3 — Restricted</SelectItem>
                      <SelectItem value="tier-4">Tier 4 — Classified</SelectItem>
                      <SelectItem value="tier-5">Tier 5 — Director</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
              </div>

              <FieldRow label="Investigator bio">
                <Textarea
                  rows={3}
                  defaultValue="Lead investigator, Sector 7 Forensics. 14 years in homicide and unattended-death casework. Specialization: digital evidence correlation, GPS forensics."
                />
              </FieldRow>
            </div>
          </Card>
        </TabsContent>

        {/* AI ENGINE */}
        <TabsContent value="ai">
          <Card className="bg-card border-border">
            <div className="p-5 space-y-5">
              <SectionHeader
                title="AI analysis engine"
                description="Tune the inference model, anomaly thresholds, and correlation depth used to generate case insights."
              />

              <FieldRow label="Primary model">
                <Select defaultValue="veridex-l3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veridex-l1">Veridex L1 — Fast (low latency)</SelectItem>
                    <SelectItem value="veridex-l2">Veridex L2 — Balanced</SelectItem>
                    <SelectItem value="veridex-l3">Veridex L3 — Forensic-grade (recommended)</SelectItem>
                    <SelectItem value="veridex-l4">Veridex L4 — Research preview</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>

              <div className="grid md:grid-cols-2 gap-4">
                <SliderField
                  label="Anomaly sensitivity"
                  hint="Higher values surface more potential leads but increase false positives."
                  defaultValue={72}
                />
                <SliderField
                  label="Correlation depth"
                  hint="How aggressively the engine cross-links CCTV, mobile, and GPS evidence."
                  defaultValue={60}
                />
              </div>

              <Separator className="bg-border" />

              <ToggleRow
                label="Auto-summarize new evidence"
                description="Generate a natural-language summary as soon as evidence is ingested."
                defaultChecked
              />
              <ToggleRow
                label="Cross-case pattern detection"
                description="Compare subjects, vehicles, and locations against the entire active caseload."
                defaultChecked
              />
              <ToggleRow
                label="Confidence-gated alerts"
                description="Suppress anomaly alerts below 60% confidence."
              />
              <ToggleRow
                label="Use experimental vision module"
                description="Enable beta CCTV gait + facial structure correlation."
              />
            </div>
          </Card>
        </TabsContent>

        {/* EVIDENCE */}
        <TabsContent value="evidence">
          <Card className="bg-card border-border">
            <div className="p-5 space-y-5">
              <SectionHeader
                title="Evidence pipeline"
                description="Configure ingestion, retention, and chain-of-custody enforcement."
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FieldRow label="Default retention">
                  <Select defaultValue="7y">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1y">1 year</SelectItem>
                      <SelectItem value="3y">3 years</SelectItem>
                      <SelectItem value="7y">7 years (recommended)</SelectItem>
                      <SelectItem value="indef">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
                <FieldRow label="Storage region">
                  <Select defaultValue="us-east">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east">US-East (Primary)</SelectItem>
                      <SelectItem value="us-west">US-West</SelectItem>
                      <SelectItem value="eu-central">EU-Central</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
                <FieldRow label="Max upload size">
                  <Input defaultValue="25 GB" className="font-mono" />
                </FieldRow>
                <FieldRow label="Hash algorithm">
                  <Select defaultValue="sha-256">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sha-256">SHA-256</SelectItem>
                      <SelectItem value="sha-512">SHA-512</SelectItem>
                      <SelectItem value="blake3">BLAKE3</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
              </div>

              <Separator className="bg-border" />

              <ToggleRow
                label="Enforce chain-of-custody signing"
                description="Every access generates a tamper-evident audit entry."
                defaultChecked
              />
              <ToggleRow
                label="Auto-redact PII in transcripts"
                description="Mask names, phone numbers, and addresses in shared exports."
                defaultChecked
              />
              <ToggleRow
                label="Quarantine unverified sources"
                description="Hold uploads from unsigned devices for manual review."
              />

              {/* Storage usage */}
              <div className="rounded-lg border border-border bg-secondary/30 p-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Storage usage</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    1.42 TB <span className="text-muted-foreground/60">/ 5.00 TB</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "28%" }} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-[11px]">
                  <UsageStat label="CCTV" value="812 GB" />
                  <UsageStat label="Mobile dumps" value="394 GB" />
                  <UsageStat label="GPS / telemetry" value="218 GB" />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications">
          <Card className="bg-card border-border">
            <div className="p-5 space-y-3">
              <SectionHeader
                title="Alerts & notifications"
                description="Choose how Veridex notifies you when the AI surfaces new findings."
              />
              <ToggleRow
                label="Critical anomalies"
                description="Push notification + email for high-confidence findings on your active cases."
                defaultChecked
              />
              <ToggleRow
                label="Evidence ingest complete"
                description="Notify when CCTV, mobile, or GPS dumps finish processing."
                defaultChecked
              />
              <ToggleRow
                label="Cross-case matches"
                description="Subject, vehicle, or location overlaps with another active case."
                defaultChecked
              />
              <ToggleRow
                label="Daily case digest"
                description="Morning summary of the previous 24 hours across your caseload."
              />
              <ToggleRow
                label="Mention-only Slack"
                description="Only relay items where you are tagged in the case workspace."
              />

              <Separator className="bg-border my-2" />

              <FieldRow label="Quiet hours">
                <div className="flex items-center gap-2">
                  <Input type="time" defaultValue="22:00" className="font-mono w-32" />
                  <span className="text-xs text-muted-foreground">to</span>
                  <Input type="time" defaultValue="06:00" className="font-mono w-32" />
                </div>
              </FieldRow>
            </div>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security">
          <Card className="bg-card border-border">
            <div className="p-5 space-y-5">
              <SectionHeader
                title="Security & access"
                description="Authentication, session policy, and audit controls."
              />

              <ToggleRow
                label="Two-factor authentication"
                description="Authenticator app required at every sign-in."
                defaultChecked
              />
              <ToggleRow
                label="Hardware key (FIDO2) required"
                description="Enforce a physical security key for case exports."
              />
              <ToggleRow
                label="Lock terminal after inactivity"
                description="Auto-lock the dashboard after 10 minutes of inactivity."
                defaultChecked
              />

              <Separator className="bg-border" />

              <div className="grid md:grid-cols-2 gap-4">
                <FieldRow label="Session timeout">
                  <Select defaultValue="30m">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15m">15 minutes</SelectItem>
                      <SelectItem value="30m">30 minutes</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
                <FieldRow label="Allowed networks">
                  <Input defaultValue="10.42.0.0/16, 192.168.7.0/24" className="font-mono text-xs" />
                </FieldRow>
              </div>

              <div className="rounded-lg border border-[--color-risk-medium]/30 bg-[--color-risk-medium]/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-[--color-risk-medium] mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Last sign-in alert</div>
                    <p className="text-xs text-muted-foreground">
                      Sign-in from new device · MacBook Pro · Sector 7 HQ ·{" "}
                      <span className="font-mono">2025-03-15 08:42 UTC</span>
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 text-xs">
                      Review active sessions
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* APPEARANCE */}
        <TabsContent value="appearance">
          <Card className="bg-card border-border">
            <div className="p-5 space-y-5">
              <SectionHeader
                title="Appearance & display"
                description="Tune the terminal density, accent, and timestamp formatting."
              />

              <FieldRow label="Theme">
                <div className="grid grid-cols-3 gap-2 max-w-md">
                  <ThemeSwatch label="Forensic Dark" active />
                  <ThemeSwatch label="High Contrast" />
                  <ThemeSwatch label="Field Light" />
                </div>
              </FieldRow>

              <div className="grid md:grid-cols-2 gap-4">
                <FieldRow label="Density">
                  <Select defaultValue="comfortable">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
                <FieldRow label="Timestamp format">
                  <Select defaultValue="iso">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iso">ISO 8601 (2025-03-15T18:42Z)</SelectItem>
                      <SelectItem value="local">Local 24h</SelectItem>
                      <SelectItem value="local12">Local 12h</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
              </div>

              <ToggleRow
                label="Reduce motion"
                description="Disable timeline animations and chart transitions."
              />
              <ToggleRow
                label="Show grid lines on charts"
                description="Improves precision in risk and evidence-volume views."
                defaultChecked
              />
            </div>
          </Card>
        </TabsContent>

        {/* API */}
        <TabsContent value="api">
          <Card className="bg-card border-border">
            <div className="p-5 space-y-5">
              <SectionHeader
                title="API access & integrations"
                description="Programmatic access to evidence and AI endpoints. Rotate keys regularly."
              />

              <div className="rounded-lg border border-border bg-secondary/30 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div>
                    <div className="text-sm font-medium">Personal access token</div>
                    <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
                      vdx_live_••••••••••••••••••••4f27
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      ACTIVE
                    </Badge>
                    <Button variant="outline" size="sm" className="text-xs">
                      Rotate
                    </Button>
                  </div>
                </div>
                <div className="px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Created <span className="font-mono">2025-01-04</span> · Last used{" "}
                    <span className="font-mono">3 hours ago</span>
                  </span>
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    Revoke
                  </Button>
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-mono">
                  Connected services
                </div>
                <Integration name="Evidence Locker S3" status="connected" detail="Bucket: vdx-sector7-prod" />
                <Integration name="Coroner DB Bridge" status="connected" detail="PostgreSQL · pg-coroner-01" />
                <Integration
                  name="ALPR Network"
                  status="degraded"
                  detail="Last heartbeat 14 minutes ago"
                />
                <Integration name="Mobile Forensics MDM" status="disconnected" detail="No credentials" />
              </div>

              <Separator className="bg-border" />

              <FieldRow label="Webhook endpoint">
                <Input
                  defaultValue="https://hooks.veridex.gov/sector-7/case-events"
                  className="font-mono text-xs"
                />
              </FieldRow>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  )
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  )
}

function ToggleRow({
  label,
  description,
  defaultChecked,
}: {
  label: string
  description: string
  defaultChecked?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="space-y-0.5">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}

function SliderField({
  label,
  hint,
  defaultValue,
}: {
  label: string
  hint: string
  defaultValue: number
}) {
  const [val, setVal] = useState(defaultValue)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </Label>
        <span className="font-mono text-xs">{val}%</span>
      </div>
      <Slider value={[val]} onValueChange={(v) => setVal(v[0] ?? 0)} min={0} max={100} step={1} />
      <p className="text-[11px] text-muted-foreground">{hint}</p>
    </div>
  )
}

function UsageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
        {label}
      </span>
      <span className="font-mono text-xs">{value}</span>
    </div>
  )
}

function ThemeSwatch({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={`group rounded-lg border p-2 text-left transition-colors ${
        active ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
      }`}
    >
      <div className="h-12 rounded-md bg-gradient-to-br from-background via-secondary to-card border border-border" />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] font-medium">{label}</span>
        {active && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
      </div>
    </button>
  )
}

function Integration({
  name,
  status,
  detail,
}: {
  name: string
  status: "connected" | "degraded" | "disconnected"
  detail: string
}) {
  const config = {
    connected: {
      label: "CONNECTED",
      cls: "text-[--color-risk-low] border-[--color-risk-low]/40 bg-[--color-risk-low]/10",
      dot: "bg-[--color-risk-low]",
    },
    degraded: {
      label: "DEGRADED",
      cls: "text-[--color-risk-medium] border-[--color-risk-medium]/40 bg-[--color-risk-medium]/10",
      dot: "bg-[--color-risk-medium]",
    },
    disconnected: {
      label: "OFFLINE",
      cls: "text-muted-foreground border-border bg-muted/30",
      dot: "bg-muted-foreground",
    },
  }[status]

  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-secondary/20 px-3 py-2.5">
      <div className="flex items-center gap-3">
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-[11px] text-muted-foreground font-mono">{detail}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] ${config.cls}`}
        >
          {config.label}
        </span>
        <Button variant="ghost" size="sm" className="text-xs h-7">
          {status === "disconnected" ? "Connect" : "Manage"}
        </Button>
      </div>
    </div>
  )
}
