"use client"

import { AlertTriangle, CheckCircle, Lock } from "lucide-react"
import { useState, useEffect } from "react"

function PolicyEngineVisual() {
  return (
    <div className="border border-border bg-background rounded-none">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2 font-mono text-xs">
        <span className="text-foreground">ENGINE_STATUS: ONLINE</span>
        <span className="text-muted-foreground">policy_engine.v2</span>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-4 bg-black relative min-h-[220px] flex flex-col justify-between font-mono text-xs">
          <div className="border border-white/20 bg-black/80 px-2 py-1 text-[10px] text-white w-fit">
            FILE: creative_042.mp4
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-white/60 mb-1">
              <span>00:12</span>
              <span>00:31</span>
            </div>
            <div className="h-1 bg-white/20 border border-white/40">
              <div className="h-full w-[40%] bg-primary" />
            </div>
          </div>
        </div>

        <div className="p-4 font-mono text-xs space-y-3">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Platform Checks</p>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between border border-border p-2 bg-card">
              <span className="text-foreground">Meta</span>
              <span className="text-emerald-500 font-bold">PASS</span>
            </div>
            <div className="flex items-center justify-between border border-amber-500/40 bg-amber-500/10 p-2">
              <span className="text-foreground">TikTok</span>
              <span className="text-amber-500 font-bold">REVIEW</span>
            </div>
            <div className="flex items-center justify-between border border-border p-2 bg-card">
              <span className="text-foreground">YouTube</span>
              <span className="text-emerald-500 font-bold">PASS</span>
            </div>
          </div>

          <div className="border border-border bg-secondary/30 p-2 text-[11px]">
            <p className="font-bold text-foreground">1 issue detected</p>
            <p className="text-muted-foreground mt-0.5">Timestamp 0:12 claim requires policy verification.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FixVisual() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((current) => (current + 1) % 2)
    }, 2500)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="border border-border bg-background rounded-none">
      <div className="border-b border-border bg-muted/40 px-4 py-2 font-mono text-xs text-muted-foreground">
        MODULE: SUGGESTED_FIX
      </div>

      <div className="p-4 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between border border-border bg-card p-2">
          <span className="flex items-center gap-2 text-red-500 font-bold">
            <AlertTriangle className="h-3.5 w-3.5" /> Violation Detected
          </span>
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
        </div>

        <div className="space-y-2">
          <div
            className={`border p-3 ${
              step === 0
                ? "border-red-500/50 bg-red-500/10 text-red-500 font-bold"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            ORIGINAL: “Lose 10lbs in 7 days!”
          </div>

          <div
            className={`border p-3 ${
              step === 1
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500 font-bold"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            REVISED: “Support your wellness journey”
          </div>
        </div>

        <div className="border-t border-border pt-2 text-[11px] text-muted-foreground">
          REASON: Eliminates guaranteed outcome claim violating ad policy.
        </div>
      </div>
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="border-b border-border bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 font-mono text-xs text-muted-foreground uppercase tracking-widest border-l-2 border-primary pl-3">
          Policy Audit Engine
        </div>

        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-foreground font-[family-name:var(--font-display)]">
            Locate violation triggers prior to platform submission.
          </h2>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-12 mb-16">
          <div className="lg:col-span-5 font-mono">
            <p className="text-xs text-primary font-bold">[01] MULTI-PLATFORM CHECK</p>
            <h3 className="mt-2 text-2xl font-bold uppercase tracking-tight text-foreground">
              Cross-Platform Policy Alignment
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Reference creative assets against distinct compliance parameters across all target networks simultaneously.
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {["Meta", "TikTok", "YouTube", "Pinterest", "X"].map((platform) => (
                <span key={platform} className="border border-border bg-card px-2 py-1 text-xs text-muted-foreground">
                  {platform}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <PolicyEngineVisual />
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-12 mb-16">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <FixVisual />
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5 font-mono">
            <p className="text-xs text-primary font-bold">[02] ACTIONABLE FIXES</p>
            <h3 className="mt-2 text-2xl font-bold uppercase tracking-tight text-foreground">
              Precise Violation Timestamps
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Isolate problematic timestamps and substitute non-compliant copy with policy-aligned alternatives.
            </p>
            <div className="mt-6 border border-border bg-card p-3 flex items-start gap-3">
              <Lock className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <div>
                <p className="text-xs font-bold text-foreground uppercase">Privacy-First Execution</p>
                <p className="text-[11px] text-muted-foreground mt-1">Files are analyzed in temporary memory and immediately discarded.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-0 sm:grid-cols-3 border border-border bg-card divide-y sm:divide-y-0 sm:divide-x divide-border font-mono text-xs">
          <div className="p-4">
            <p className="font-bold text-foreground uppercase">SCAN DEPTH</p>
            <p className="mt-1 text-muted-foreground">Basic and Deep scanning configurations for high-cut video formats.</p>
          </div>
          <div className="p-4">
            <p className="font-bold text-foreground uppercase">RISK INDEX</p>
            <p className="mt-1 text-muted-foreground">Low, Medium, and High threat designations for rapid editorial decisions.</p>
          </div>
          <div className="p-4">
            <p className="font-bold text-foreground uppercase">TIMESTAMPS</p>
            <p className="mt-1 text-muted-foreground">Jump directly to precise video timestamps triggering potential flags.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
