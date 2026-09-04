import { Button } from "@/components/ui/button"
import { Shield, ArrowUpRight } from "lucide-react"

const EXTENSION_LINK =
  "https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_hero"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background pt-24 pb-16 md:pt-32 md:pb-20 font-mono">
      {/* Rigid background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: `40px 40px`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Copy */}
          <div className="lg:col-span-6">
            <div className="mb-6 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest">
              <span className="h-1.5 w-1.5 bg-primary animate-pulse" />
              SYS_PROC: Video ad policy checker
            </div>

            <h1 className="max-w-3xl text-4xl font-bold uppercase leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Know before
              <br />
              you <span className="text-primary underline decoration-2 underline-offset-4">launch.</span>
              <span className="inline-block w-4 h-8 ml-2 bg-primary animate-pulse align-bottom mb-1" />
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground border-l-2 border-border pl-4">
              &gt; Scan your video ads for potential Meta, TikTok, and Google
              policy issues before you spend money promoting them.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-none bg-primary px-6 text-xs font-bold uppercase text-primary-foreground hover:bg-primary/90"
              >
                <a
                  href={EXTENSION_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  [ EXECUTE: Try free ]
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-none border-border bg-card px-6 text-xs uppercase hover:bg-secondary"
              >
                <a
                  href="https://www.youtube.com/watch?v=Jk_XtsN1N9I&utm_medium=website_hero"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  /view_demo.mp4
                </a>
              </Button>
            </div>

            <div className="mt-8 flex flex-col gap-2 text-[10px] text-muted-foreground uppercase">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">[OK]</span> Privacy-first processing
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">[OK]</span> Multi-platform support
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">[OK]</span> From $0.19 / scan
              </div>
            </div>

            <div className="mt-10 border-t border-dashed border-border pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
                TARGET_REGISTERS:
              </p>
              <div className="flex flex-wrap gap-2">
                {["Meta", "TikTok", "YouTube", "X", "Pinterest"].map(
                  (platform) => (
                    <span
                      key={platform}
                      className="border border-border bg-card px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase"
                    >
                      {platform}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Product visual */}
          <div className="relative lg:col-span-6">
            <div className="relative overflow-hidden border border-border bg-card shadow-none">
              {/* Terminal chrome */}
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  root@mediacrater:~/scan_engine
                </span>
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 bg-muted-foreground/30" />
                  <div className="h-2 w-2 bg-muted-foreground/30" />
                  <div className="h-2 w-2 bg-muted-foreground/30" />
                </div>
              </div>

              <div className="grid gap-0 border-b border-border">
                {/* Video container */}
                <div className="relative aspect-video bg-black p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="border border-white/20 bg-black/80 px-2 py-1 text-[9px] text-white/70 uppercase">
                      FILE: compliance_audit.mp4
                    </div>
                    <div className="bg-amber-500 text-black px-2 py-1 text-[9px] font-bold uppercase animate-pulse">
                      WARN: 1 ISSUE
                    </div>
                  </div>

                  <div className="border border-white/20 bg-black/60 p-2">
                    <p className="text-[9px] font-bold text-white/50 mb-1">
                      TS: 00:12 / LEN: 00:31
                    </p>
                    <div className="h-1 w-full bg-white/10 relative">
                      <div className="absolute left-0 top-0 h-full w-[39%] bg-primary" />
                      <div className="absolute left-[39%] top-[-2px] h-2 w-1 bg-white" />
                    </div>
                  </div>
                </div>

                {/* Assessment */}
                <div className="bg-background p-4">
                  <div className="flex items-start justify-between gap-4 border-b border-dashed border-border pb-3 mb-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        Output: Policy Assessment
                      </p>
                      <p className="mt-1 text-sm font-bold text-amber-500 uppercase">
                        &gt; Medium Risk
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-muted-foreground uppercase">
                        Conf_Score
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        0.78
                      </p>
                    </div>
                  </div>

                  <div className="border border-amber-500/30 bg-amber-500/5 p-3">
                    <div className="flex gap-2">
                      <span className="text-amber-500 font-bold text-[10px] mt-0.5">&gt;</span>
                      <div>
                        <p className="text-[10px] font-bold text-foreground uppercase">
                          Timestamp 0:12 — Soft guarantee claim
                        </p>
                        <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                          Potential policy issue detected. Review phrasing parameters before sequence init.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[9px] text-muted-foreground uppercase pt-2">
                    <span>Process: Deep_Scan</span>
                    <span className="text-primary font-bold">
                      [ STATUS: COMPLETE ]
                    </span>
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
