"use client"

import { AlertTriangle, Lock } from "lucide-react"

export function Features() {
  return (
    <section
      id="features"
      className="border-b border-border/50 bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
            // Module: The Policy Engine
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            See what needs attention before the platform does.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Mediacrater looks at your creative against platform-specific
            policies, identifies potential risk zones, and gives you something
            useful to act on.
          </p>
        </div>

        {/* Audit Document Body */}
        <div className="relative pl-6 sm:pl-10 border-l-2 border-border/60 space-y-24">
          
          {/* Feature 1: Cross-referencing */}
          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16">
            <div className="absolute -left-[31px] sm:-left-[47px] top-1 flex items-center justify-center bg-background py-2">
              <span className="font-mono text-xs font-bold text-muted-foreground bg-background px-1">01</span>
            </div>

            <div>
              <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground mb-4">
                One creative. Multiple checks.
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground mb-6">
                Cross-reference your creative against the platforms you plan to
                advertise on. Each platform can have different rules and
                different points of failure.
              </p>
              
              <div className="flex flex-wrap gap-3 font-mono text-xs">
                {["Meta: PASS", "TikTok: REVIEW", "YouTube: PASS", "Pinterest: PASS", "X: PASS"].map(
                  (platform) => (
                    <span
                      key={platform}
                      className={`px-3 py-1.5 border ${
                        platform.includes("REVIEW")
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {platform}
                    </span>
                  )
                )}
              </div>
            </div>

            <aside className="border-l-2 border-amber-500/30 pl-5 py-2 h-fit">
              <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400 font-mono text-xs uppercase tracking-widest">
                <AlertTriangle className="h-4 w-4" />
                Conflict Detected
              </div>
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                Creative format passes general guidelines but triggers a soft violation in TikTok's ad review matrix.
              </p>
            </aside>
          </div>

          {/* Feature 2: Fix Visual integrated as text */}
          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16">
            <div className="absolute -left-[31px] sm:-left-[47px] top-1 flex items-center justify-center bg-background py-2">
              <span className="font-mono text-xs font-bold text-muted-foreground bg-background px-1">02</span>
            </div>

            <div>
              <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground mb-4">
                Don't just find the problem. Know what to review.
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground mb-8">
                Results point you toward the part of the creative that needs
                attention, including timestamps and suggested changes where
                applicable.
              </p>

              {/* Redline Transcript Example */}
              <div className="bg-secondary/30 border border-border p-6 font-mono text-sm leading-loose text-muted-foreground">
                <span className="text-foreground font-semibold mr-4">[00:12]</span>
                "Get ready to 
                <del className="mx-2 line-through decoration-destructive decoration-[3px] text-foreground">
                  lose 10lbs in 7 days!
                </del> 
                <ins className="no-underline text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1 py-0.5 border border-amber-500/30">
                  support your wellness journey
                </ins>"
              </div>

              <div className="mt-8 flex items-start gap-4 border border-border bg-background p-4 max-w-md">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider mb-1">
                    Privacy-first processing
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Your creative is temporarily processed for analysis rather
                    than becoming a permanent asset in your account.
                  </p>
                </div>
              </div>
            </div>

            <aside className="border-l-2 border-amber-500/30 pl-5 py-2 h-fit">
              <p className="font-mono text-xs text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">
                Margin Note
              </p>
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                Replace potentially problematic guarantees with language that avoids an unsupported outcome claim. Timestamp logged for immediate review.
              </p>
            </aside>
          </div>

          {/* Supporting Statement / Metadata Footer */}
          <div className="relative pt-8 mt-16 border-t border-border/60">
            <div className="absolute -left-[29px] sm:-left-[45px] top-7 h-2 w-2 rounded-none border border-muted-foreground bg-background" />
            <div className="grid gap-10 sm:grid-cols-3 font-mono">
              <div>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-widest border-b border-border pb-2 mb-3">
                  Scan Depth
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Basic and Deep scanning available for different editing paces.
                </p>
              </div>
              <div>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-widest border-b border-border pb-2 mb-3">
                  Risk Level
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Categorized into Low, Medium, and High thresholds.
                </p>
              </div>
              <div>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-widest border-b border-border pb-2 mb-3">
                  Timestamps
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Direct navigation to flagged creative segments.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
