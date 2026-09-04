"use client"

import {
  AlertTriangle,
  CheckCircle,
  Lock,
} from "lucide-react"
import { useState, useEffect } from "react"

function PolicyEngineVisual() {
  return (
    <div className="overflow-hidden border border-border bg-card font-mono text-xs shadow-none">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
        <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
          /bin/policy_engine.exe
        </span>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 bg-muted-foreground/30" />
          <div className="h-2 w-2 bg-muted-foreground/30" />
          <div className="h-2 w-2 bg-muted-foreground/30" />
        </div>
      </div>

      <div className="grid md:grid-cols-[1.1fr_0.9fr] divide-x divide-border">
        {/* Video side */}
        <div className="relative min-h-[220px] bg-black flex flex-col justify-between p-3">
          <div className="flex justify-between items-start">
            <div className="bg-white/10 px-2 py-1 text-[9px] text-white/70 uppercase">
              creative_042.mp4
            </div>
            <div className="bg-amber-500 text-black px-2 py-1 text-[9px] font-bold uppercase">
              [REVIEW REQ]
            </div>
          </div>

          <div className="mt-auto border border-white/20 p-2 bg-white/5">
            <div className="mb-2 flex justify-between text-[9px] text-white/50">
              <span>TS: 00:12</span>
              <span>LEN: 00:31</span>
            </div>
            <div className="h-1 bg-white/10 relative">
              <div className="absolute top-0 left-0 h-full w-[40%] bg-primary" />
              <div className="absolute top-[-2px] left-[40%] w-1 h-2 bg-white" />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-4 bg-background">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
            -- Platform Trace --
          </p>

          <div className="space-y-0 text-[11px]">
            <div className="flex items-center justify-between border-b border-dashed border-border py-2">
              <span className="text-foreground">Meta_Policy_DB</span>
              <span className="text-emerald-500 font-bold">[PASS]</span>
            </div>

            <div className="flex items-center justify-between border-b border-dashed border-border py-2 bg-amber-500/5">
              <span className="text-foreground">TikTok_Ruleset</span>
              <span className="text-amber-500 font-bold">[REVIEW]</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-foreground">YouTube_GAds</span>
              <span className="text-emerald-500 font-bold">[PASS]</span>
            </div>
          </div>

          <div className="mt-4 border border-amber-500/30 bg-amber-500/5 p-2">
            <p className="text-[9px] font-bold text-amber-500 uppercase">
              ! 1 issue detected
            </p>
            <p className="mt-1 text-[9px] leading-relaxed text-muted-foreground">
              &gt; Timestamp 0:12 contains a claim that may require manual review against local directives.
            </p>
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
    <div className="overflow-hidden border border-border bg-card font-mono text-xs shadow-none">
      <div className="border-b border-border bg-muted/50 px-3 py-2">
        <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
          /scripts/suggested_fix.sh
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
          <div className="flex items-center gap-2 text-[10px] text-destructive uppercase font-bold">
            <AlertTriangle className="h-3 w-3" />
            Violation Risk
          </div>
          <CheckCircle className="h-3 w-3 text-emerald-500" />
        </div>

        <div className="space-y-2">
          <div className="text-[9px] text-muted-foreground uppercase">Original Input:</div>
          <div
            className={`border p-2 transition-colors duration-200 ${
              step === 0
                ? "border-destructive text-destructive bg-destructive/5"
                : "border-border text-muted-foreground/50 bg-transparent"
            }`}
          >
            &gt; “Lose 10lbs in 7 days!”
          </div>

          <div className="text-muted-foreground text-center py-1">|</div>
          
          <div className="text-[9px] text-muted-foreground uppercase">Suggested Fix:</div>
          <div
            className={`border p-2 transition-colors duration-200 ${
              step === 1
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                : "border-border text-muted-foreground/50 bg-transparent"
            }`}
          >
            &gt; “Support your wellness journey”
          </div>
        </div>

        <div className="mt-4 border-t border-border pt-3 bg-muted/20 p-2">
          <p className="text-[9px] font-bold uppercase text-muted-foreground">
            // Output Context
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
            Replace potentially problematic guarantees with language that avoids an unsupported outcome claim.
          </p>
        </div>
      </div>
    </div>
  )
}

export function Features() {
  return (
    <section
      id="features"
      className="border-b border-border bg-secondary/10 py-16 md:py-24 font-mono"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl border-l-2 border-primary pl-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            [MODULE: THE_POLICY_ENGINE]
          </p>

          <h2 className="mt-3 text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
            See what needs attention before the platform does.
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            &gt; Mediacrater looks at your creative against platform-specific policies, identifies potential risk zones, and gives you actionable data to rectify errors.
          </p>
        </div>

        {/* Feature 1 */}
        <div className="mt-16 grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 bg-card border border-border p-6">
            <p className="text-[10px] font-bold text-primary mb-4 border-b border-border pb-2">PROCESS_01</p>
            <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">
              One creative.
              <br />
              Multiple checks.
            </h3>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Cross-reference your creative against the platforms you plan to advertise on. Each platform operates isolated risk models.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Meta", "TikTok", "YouTube", "Pinterest", "X"].map(
                (platform) => (
                  <span
                    key={platform}
                    className="border border-border bg-background px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase"
                  >
                    {platform}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <PolicyEngineVisual />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <FixVisual />
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5 bg-card border border-border p-6">
            <p className="text-[10px] font-bold text-primary mb-4 border-b border-border pb-2">PROCESS_02</p>

            <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">
              Don't just find it.
              <br />
              Know what to fix.
            </h3>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Results point you toward the sector of the creative needing review, mapping timestamps to rule violations.
            </p>

            <div className="mt-6 border border-border bg-background p-3 flex gap-3 items-start">
              <Lock className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-foreground uppercase">
                  Privacy-first architecture
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                  Payload is processed in temporary memory and flushed post-analysis.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Small supporting statement */}
        <div className="mt-16 border-t border-dashed border-border pt-8">
          <div className="grid gap-6 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="sm:pr-6 py-2 sm:py-0">
              <p className="text-[10px] font-bold text-primary uppercase">VAR: SCAN_DEPTH</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Basic and Deep scanning execution for variable editing cadences.
              </p>
            </div>

            <div className="sm:px-6 py-2 sm:py-0">
              <p className="text-[10px] font-bold text-primary uppercase">VAR: RISK_LEVEL</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Triage outputs via Low, Medium, and High risk assignments.
              </p>
            </div>

            <div className="sm:pl-6 py-2 sm:py-0">
              <p className="text-[10px] font-bold text-primary uppercase">VAR: TIMESTAMPS</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Seek directly to sectors of the payload requiring manual override.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
