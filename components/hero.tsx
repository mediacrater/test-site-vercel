import { Button } from "@/components/ui/button"
import { ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react"

const EXTENSION_LINK =
  "https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_hero"

export function Hero() {
  return (
    <section className="border-b border-border pt-36 pb-16 md:pt-44 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <div className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Ad creative compliance
            </div>

            <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.96] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-[4.4rem]">
              Analyze your creative before you submit it.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              Mediacrater evaluates video ads against platform-specific advertising policies, identifies potential policy risks, and shows you where to review them before you put paid distribution behind the creative.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-md px-6 text-sm font-semibold">
                <a href={EXTENSION_LINK} target="_blank" rel="noopener noreferrer">
                  Run a free compliance scan
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-md px-6 text-sm">
                <a href="https://www.youtube.com/watch?v=Jk_XtsN1N9I&utm_medium=website_hero" target="_blank" rel="noopener noreferrer">
                  View product walkthrough
                </a>
              </Button>
            </div>

            <div className="mt-9 grid max-w-xl grid-cols-1 border-y border-border sm:grid-cols-3">
              <div className="flex items-center gap-2 border-b py-3 text-xs text-muted-foreground sm:border-b-0 sm:border-r">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Privacy-first
              </div>
              <div className="flex items-center gap-2 border-b py-3 text-xs text-muted-foreground sm:border-b-0 sm:border-r sm:px-4">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Multi-platform
              </div>
              <div className="py-3 text-xs font-medium text-muted-foreground sm:px-4">
                From $0.19 / scan
              </div>
            </div>

            <div className="mt-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
                Policy frameworks
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Meta", "TikTok", "YouTube", "Pinterest", "X"].map((platform) => (
                  <span key={platform} className="border border-border px-2.5 py-1.5 text-xs font-medium text-foreground">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:pl-4">
            <div className="border border-border bg-card shadow-[0_24px_70px_-35px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Compliance report</p>
                  <p className="mt-0.5 text-xs text-foreground">creative_042.mp4</p>
                </div>
                <span className="border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  REVIEW
                </span>
              </div>

              <div className="grid md:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[300px] bg-neutral-950">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.08),transparent_45%,rgba(255,255,255,.02))]" />
                  <div className="absolute left-5 top-5 font-mono text-[10px] text-white/50">00:00 — 00:31</div>

                  <div className="absolute bottom-7 left-5 right-5">
                    <div className="relative h-12 border-y border-white/10">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
                      {[8, 22, 37, 53, 69, 84].map((left) => (
                        <div key={left} className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-white/20" style={{ left: `${left}%` }} />
                      ))}
                      <div className="absolute left-[39%] top-1/2 h-7 w-px -translate-y-1/2 bg-amber-400" />
                    </div>
                    <div className="mt-2 flex justify-between text-[9px] font-mono text-white/35">
                      <span>00:00</span><span>00:12 flagged</span><span>00:31</span>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Overall assessment</p>
                    <div className="mt-2 flex items-end justify-between">
                      <p className="text-2xl font-bold tracking-tight">Medium risk</p>
                      <p className="font-mono text-sm font-semibold text-amber-600 dark:text-amber-400">78%</p>
                    </div>
                    <div className="mt-3 h-1 bg-muted">
                      <div className="h-full w-[78%] bg-amber-500" />
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Detected finding</p>
                      <span className="font-mono text-[10px] text-muted-foreground">00:12</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold">Soft guarantee claim</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Potential policy risk detected. Review the claim language before publishing.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-border">
                    {[
                      ["META", "PASS"],
                      ["TIKTOK", "REVIEW"],
                      ["YOUTUBE", "PASS"],
                    ].map(([platform, status]) => (
                      <div key={platform} className="p-4">
                        <p className="text-[9px] font-bold tracking-wider text-muted-foreground">{platform}</p>
                        <p className={`mt-1 text-[10px] font-bold ${status === "REVIEW" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                          {status}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-3 text-[10px] text-muted-foreground">
                <span>Deep scan · policy analysis complete</span>
                <span className="font-mono">1 finding</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
