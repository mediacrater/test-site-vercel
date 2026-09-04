"use client"

import {
  AlertTriangle,
  CheckCircle,
  Lock,
} from "lucide-react"

export function Features() {
  return (
    <section
      id="features"
      className="border-b border-border bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Persistent Tab Rail */}
          <div className="lg:col-span-3">
            <div className="sticky top-28 space-y-8">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">
                  The Policy Engine
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight tracking-tight text-foreground">
                  Active Case Files
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Cross-reference your creative against specific platform parameters. Know what to review before the algorithm does.
                </p>
              </div>

              <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider">
                <a href="#case-001" className="p-3 border border-border hover:bg-secondary/50 text-foreground transition-colors flex items-center justify-between">
                  <span>Case 001 // Meta</span>
                  <span className="text-muted-foreground">→</span>
                </a>
                <a href="#case-002" className="p-3 border border-border hover:bg-secondary/50 text-foreground transition-colors flex items-center justify-between">
                  <span>Case 002 // TikTok</span>
                  <span className="text-muted-foreground">→</span>
                </a>
                <a href="#case-003" className="p-3 border border-border hover:bg-secondary/50 text-foreground transition-colors flex items-center justify-between">
                  <span>Case 003 // YouTube</span>
                  <span className="text-muted-foreground">→</span>
                </a>
              </div>

              <div className="mt-8 flex items-start gap-3 border border-border bg-card p-4">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                <div>
                  <p className="font-mono text-[10px] font-bold text-foreground uppercase tracking-widest">
                    Privacy Protocol
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Creative is processed temporarily for analysis, never stored permanently.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Case Files Content */}
          <div className="lg:col-span-9 space-y-24">
            
            {/* Case 001: Meta */}
            <div id="case-001" className="scroll-mt-32">
              <div className="border-b-2 border-foreground pb-4 mb-8 flex justify-between items-end">
                <div>
                  <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Platform Analysis</p>
                  <h3 className="font-[family-name:var(--font-display)] text-4xl font-bold text-foreground mt-2">META</h3>
                </div>
                <div className="font-mono text-xs text-muted-foreground">ID: MT-8924</div>
              </div>

              <div className="border border-border bg-card p-6 md:p-10 relative overflow-hidden">
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="font-mono text-sm font-bold text-foreground uppercase mb-4 tracking-wider">Violation Detected</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      Timestamp 0:12 contains an unsupported outcome claim. The platform algorithm heavily penalizes absolute guarantees in ad copy and audio.
                    </p>
                    
                    <div className="space-y-4 font-mono text-xs">
                      <div className="border-l-2 border-destructive bg-destructive/5 p-4 text-destructive">
                        <span className="block text-[10px] uppercase mb-1 opacity-70">Flagged Transcript</span>
                        “Lose 10lbs in 7 days!”
                      </div>
                      <div className="border-l-2 border-emerald-500 bg-emerald-500/5 p-4 text-emerald-600 dark:text-emerald-400">
                        <span className="block text-[10px] uppercase mb-1 opacity-70">Suggested Revision</span>
                        “Support your wellness journey”
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black relative aspect-video border border-border flex items-center justify-center">
                    <div className="absolute top-4 left-4 bg-black/60 font-mono text-[10px] text-white px-2 py-1 border border-white/20">creative_042.mp4</div>
                    <AlertTriangle className="h-8 w-8 text-destructive opacity-50" />
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  <div className="transform -rotate-6 border-[3px] border-destructive text-destructive font-bold uppercase px-6 py-2 text-2xl tracking-[0.2em] mix-blend-multiply dark:mix-blend-lighten opacity-90 inline-block pointer-events-none">
                    FLAGGED
                  </div>
                </div>
              </div>
            </div>

            {/* Case 002: TikTok */}
            <div id="case-002" className="scroll-mt-32">
              <div className="border-b-2 border-foreground pb-4 mb-8 flex justify-between items-end">
                <div>
                  <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Platform Analysis</p>
                  <h3 className="font-[family-name:var(--font-display)] text-4xl font-bold text-foreground mt-2">TIKTOK</h3>
                </div>
                <div className="font-mono text-xs text-muted-foreground">ID: TK-1102</div>
              </div>

              <div className="border border-border bg-card p-6 md:p-10 relative overflow-hidden">
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="font-mono text-sm font-bold text-foreground uppercase mb-4 tracking-wider">Deep Scan Results</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      Analysis reveals rapid frame cuts between 0:04 and 0:06 that may trigger TikTok's automated content moderation for sensory overload policies. 
                    </p>
                    <div className="flex items-center gap-3 bg-secondary p-4 border border-border">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="font-mono text-xs text-foreground uppercase">Manual Review Required</span>
                    </div>
                  </div>
                  
                  <div className="bg-black relative aspect-[9/16] md:aspect-auto border border-border flex items-center justify-center">
                    <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/20">
                      <div className="h-full w-1/4 bg-amber-500 ml-[10%]" />
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  <div className="transform -rotate-3 border-[3px] border-amber-500 text-amber-500 font-bold uppercase px-6 py-2 text-2xl tracking-[0.2em] mix-blend-multiply dark:mix-blend-lighten opacity-90 inline-block pointer-events-none">
                    PENDING
                  </div>
                </div>
              </div>
            </div>

            {/* Case 003: YouTube */}
            <div id="case-003" className="scroll-mt-32">
              <div className="border-b-2 border-foreground pb-4 mb-8 flex justify-between items-end">
                <div>
                  <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Platform Analysis</p>
                  <h3 className="font-[family-name:var(--font-display)] text-4xl font-bold text-foreground mt-2">YOUTUBE</h3>
                </div>
                <div className="font-mono text-xs text-muted-foreground">ID: YT-4491</div>
              </div>

              <div className="border border-border bg-card p-6 md:p-10 relative overflow-hidden">
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="font-mono text-sm font-bold text-foreground uppercase mb-4 tracking-wider">Compliance Confirmed</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      Audio transcripts, on-screen text, and visual pacing pass Google Ads basic policy checks. No high-risk policy zones detected.
                    </p>
                    <div className="space-y-2 font-mono text-xs uppercase text-muted-foreground">
                      <div className="flex justify-between border-b border-border py-2">
                        <span>Audio check</span>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="flex justify-between border-b border-border py-2">
                        <span>Visual check</span>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Metadata check</span>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black relative aspect-video border border-border flex items-center justify-center">
                    <div className="absolute top-4 left-4 bg-black/60 font-mono text-[10px] text-emerald-400 px-2 py-1 border border-emerald-500/30">compliant_v2.mp4</div>
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  <div className="transform -rotate-6 border-[3px] border-emerald-500 text-emerald-500 font-bold uppercase px-6 py-2 text-2xl tracking-[0.2em] mix-blend-multiply dark:mix-blend-lighten opacity-90 inline-block pointer-events-none">
                    CLEARED
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
