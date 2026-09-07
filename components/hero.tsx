import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowUpRight, CheckCircle } from "lucide-react"

const EXTENSION_LINK =
  "https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_hero"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/50 pt-28 pb-20 md:pt-36 md:pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[12%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-[8%] top-[18%] h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Badge
              variant="outline"
              className="mb-6 rounded-full border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary"
            >
              Pre-publish ad compliance check
            </Badge>

            <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.98] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-7xl">
              See the problem
              <br />
              <span className="text-primary">before you upload.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Upload a creative, choose where you plan to advertise it, and get
              a practical risk review before the platform gets a chance to reject it.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <a href={EXTENSION_LINK} target="_blank" rel="noopener noreferrer">
                  <Shield className="mr-2 h-4 w-4" />
                  Scan a creative free
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-xl bg-background px-6 text-base"
              >
                <a
                  href="https://www.youtube.com/watch?v=Jk_XtsN1N9I&utm_medium=website_hero"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch the scan
                </a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
              {[
                "Timestamped findings",
                "Platform-specific checks",
                "Privacy-first processing",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-border/60 pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
                Check against
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {["Meta", "TikTok", "YouTube", "X", "Pinterest"].map((platform) => (
                  <span
                    key={platform}
                    className="rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/5 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  scan / compliance_audit.mp4
                </span>
                <div className="w-10" />
              </div>

              <div className="grid gap-4 p-4 sm:p-5">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-950 to-black" />

                  <div className="absolute left-5 top-5 rounded-md border border-white/10 bg-black/40 px-2.5 py-1.5 text-[10px] font-mono text-white/70 backdrop-blur">
                    summer_offer.mp4
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex justify-between text-[10px] text-white/40">
                      <span>00:12</span>
                      <span>00:31</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/15">
                      <div className="h-full w-[39%] rounded-full bg-primary" />
                    </div>
                  </div>

                  <div className="absolute right-5 top-5 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold text-amber-400 ring-1 ring-inset ring-amber-500/20">
                    Review needed
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      What needs attention
                    </p>

                    <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                      <div className="flex gap-3">
                        <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            00:12 · Outcome claim
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            Review wording that may read as a guaranteed result.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Next step
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-foreground">
                        Open the timestamp and revise the claim before publishing.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-4 sm:w-36">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Assessment
                    </p>
                    <p className="mt-2 text-xl font-bold text-foreground">
                      Medium risk
                    </p>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[52%] rounded-full bg-amber-500" />
                    </div>
                    <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
                      Based on the selected platform policies and scan depth.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="relative mt-3 text-center text-xs text-muted-foreground">
              Example scan — the result is an assessment, not an approval guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
