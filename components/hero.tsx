import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Check, ArrowUpRight } from "lucide-react"

const EXTENSION_LINK =
  "https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_hero"

export function Hero() {
  return (
    <section className="relative border-b border-border pt-24 pb-16 md:pt-32 md:pb-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Badge
              variant="outline"
              className="mb-6 rounded-none border-border bg-secondary/50 px-3 py-1 text-xs font-mono uppercase tracking-wider text-foreground"
            >
              [ VIDEO AD POLICY CHECKER ]
            </Badge>

            <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-none">
              Know before <br />
              you launch.
            </h1>

            <p className="mt-6 max-w-xl text-base text-muted-foreground leading-normal">
              Scan video ad creatives against Meta, TikTok, and Google policies before committing ad spend. Flag violations prior to account submission.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-none bg-primary px-6 text-sm font-mono font-semibold uppercase text-primary-foreground shadow-none hover:bg-primary/90"
              >
                <a
                  href={EXTENSION_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Try Free
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-none border border-border bg-background px-6 text-sm font-mono font-semibold uppercase hover:bg-secondary"
              >
                <a
                  href="https://www.youtube.com/watch?v=Jk_XtsN1N9I&utm_medium=website_hero"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Demo
                </a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-muted-foreground border-t border-border pt-4">
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-foreground" />
                Privacy-first processing
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-foreground" />
                Multi-platform coverage
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-foreground" />
                From $0.19 / scan
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                Supported Engines:
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Meta", "TikTok", "YouTube", "X", "Pinterest"].map(
                  (platform) => (
                    <span
                      key={platform}
                      className="rounded-none border border-border bg-card px-2 py-0.5 text-xs font-mono text-foreground"
                    >
                      {platform}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-none border-2 border-border bg-card shadow-none">
              <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-2 font-mono text-xs text-muted-foreground">
                <span>TERMINAL_AUDIT_PREVIEW</span>
                <span>STATUS: ACTIVE</span>
              </div>

              <div className="p-4 space-y-4">
                <div className="relative aspect-video border border-border bg-black">
                  <div className="absolute left-3 top-3 border border-white/20 bg-black/80 px-2 py-1 text-[10px] font-mono text-white">
                    FILE: compliance_audit.mp4
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex justify-between text-[10px] font-mono text-white/70 mb-1">
                      <span>00:12</span>
                      <span>00:31</span>
                    </div>
                    <div className="h-1 border border-white/20 bg-black">
                      <div className="h-full w-[39%] bg-primary" />
                    </div>
                  </div>

                  <div className="absolute right-3 top-3 border border-amber-500 bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-400 uppercase">
                    1 Issue Detected
                  </div>
                </div>

                <div className="border border-border bg-background p-4 space-y-3 font-mono">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground">Risk Level</p>
                      <p className="text-base font-bold text-foreground uppercase">Medium Risk</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-muted-foreground">Confidence</p>
                      <p className="text-sm font-bold text-amber-500">78%</p>
                    </div>
                  </div>

                  <div className="border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
                    <p className="font-bold text-foreground uppercase">Timestamp 0:12 — Soft guarantee claim</p>
                    <p className="mt-1 text-muted-foreground">Potential policy issue. Amend wording prior to campaign submission.</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border">
                    <span>Scan Type: DEEP</span>
                    <span>Status: COMPLETE</span>
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
