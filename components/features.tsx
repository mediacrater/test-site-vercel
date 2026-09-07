"use client"

import { AlertTriangle, CheckCircle2, Lock, ScanSearch } from "lucide-react"
import { useEffect, useState } from "react"

function PolicyMatrix() {
  return (
    <div className="border border-border bg-card">
      <div className="grid grid-cols-[1fr_auto_auto_auto] border-b border-border bg-muted/20 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <div className="px-4 py-3">Policy assessment</div>
        <div className="w-20 border-l border-border px-3 py-3 text-center">Meta</div>
        <div className="w-20 border-l border-border px-3 py-3 text-center">TikTok</div>
        <div className="w-20 border-l border-border px-3 py-3 text-center">YouTube</div>
      </div>

      {[
        ["Creative claim", "PASS", "REVIEW", "PASS"],
        ["On-screen text", "PASS", "PASS", "PASS"],
        ["Visual content", "PASS", "PASS", "PASS"],
        ["Landing-page language", "—", "—", "—"],
      ].map(([label, meta, tiktok, youtube]) => (
        <div key={label} className="grid grid-cols-[1fr_auto_auto_auto] border-b border-border last:border-b-0">
          <div className="px-4 py-4 text-xs font-medium text-foreground">{label}</div>
          {[meta, tiktok, youtube].map((status, i) => (
            <div key={i} className="flex w-20 items-center justify-center border-l border-border px-2">
              {status === "PASS" ? (
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> PASS
                </span>
              ) : status === "REVIEW" ? (
                <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-3 w-3" /> REVIEW
                </span>
              ) : (
                <span className="text-[9px] text-muted-foreground">—</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function FindingsPanel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive((value) => (value + 1) % 2), 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Detected finding</p>
          <p className="mt-1 text-xs font-semibold">creative_042.mp4 · 00:12</p>
        </div>
        <ScanSearch className="h-4 w-4 text-primary" />
      </div>

      <div className="p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className={`border p-4 transition-all ${active === 0 ? "border-destructive/30 bg-destructive/5" : "border-border bg-muted/20"}`}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Detected language</p>
            <p className="mt-2 font-mono text-xs font-semibold text-foreground">“Guaranteed results”</p>
          </div>

          <div className="text-center text-muted-foreground">→</div>

          <div className={`border p-4 transition-all ${active === 1 ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-muted/20"}`}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Suggested revision</p>
            <p className="mt-2 text-xs font-semibold text-foreground">Use qualified, non-guaranteed language.</p>
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assessment confidence</span>
            <span className="font-mono text-xs font-semibold">78%</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Findings are presented as policy risks to review, not guarantees of platform enforcement.
          </p>
        </div>
      </div>
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="border-b border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Product</p>
            <h2 className="mt-4 max-w-lg font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl">
              A compliance layer between your creative and the platform.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
              Analyze the asset, isolate potential policy risk, and give your team a concrete place to start reviewing the creative.
            </p>
          </div>

          <div className="space-y-20">
            <div className="grid gap-8 border-t border-border pt-8 md:grid-cols-[0.72fr_1.28fr] md:gap-12">
              <div>
                <p className="font-mono text-xs text-primary">01 / POLICY ANALYSIS</p>
                <h3 className="mt-4 text-2xl font-bold tracking-tight">Platform-specific assessment.</h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Run the same creative through the policy frameworks that matter to the campaign. See where assessments differ instead of treating every platform as if it uses the same rules.
                </p>
              </div>
              <PolicyMatrix />
            </div>

            <div className="grid gap-8 border-t border-border pt-8 md:grid-cols-[1.28fr_0.72fr] md:gap-12">
              <div className="order-2 md:order-1">
                <FindingsPanel />
              </div>
              <div className="order-1 md:order-2">
                <p className="font-mono text-xs text-primary">02 / FINDINGS</p>
                <h3 className="mt-4 text-2xl font-bold tracking-tight">Timestamped risk, not vague feedback.</h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Findings identify where the creative deserves a second look, with timestamps and suggested revisions where applicable.
                </p>
                <div className="mt-6 flex gap-3 border-t border-border pt-5">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs leading-5 text-muted-foreground">
                    Creative files are temporarily processed for analysis rather than treated as permanent account assets.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
              {[
                ["SCAN DEPTH", "Basic and Deep analysis for different editing styles."],
                ["RISK ASSESSMENT", "Low, Medium, and High classifications for triage."],
                ["TIMESTAMPS", "Locate the portion of the creative associated with a finding."],
              ].map(([label, body]) => (
                <div key={label} className="bg-card p-5">
                  <p className="font-mono text-[10px] font-bold text-primary">{label}</p>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
