"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, ArrowUpRight, ScanSearch } from "lucide-react"

const EXTENSION_LINK =
  "https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_hero"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-border/70" />
        <div className="absolute -right-32 top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <div>
            <Badge variant="outline" className="mb-7 rounded-full border-border bg-background px-3 py-1.5 text-xs font-semibold tracking-wide">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
              Ad creative compliance
            </Badge>

            <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.94] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-[5.5rem]">
              <span className="sr-only">Know before you launch.</span>
              <span aria-hidden="true" className="block">
                <span className="question-stage relative inline-block pr-1">
                  <span className="question-word">Question</span>
                  <svg className="question-x absolute left-[-3%] top-[47%] h-[45%] w-[106%] -translate-y-1/2 overflow-visible" viewBox="0 0 100 40" fill="none">
                    <path d="M4 5 L96 35" pathLength="1" />
                    <path d="M96 5 L4 35" pathLength="1" />
                  </svg>
                </span>{" "}
                <span>before</span>
                <br />
                <span>you <span className="text-primary">launch.</span></span>
                <span className="know-word" aria-hidden="true">Know</span>
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Analyze your ad creative for potential policy risks across Meta, TikTok, Google, and more—before you spend money promoting it.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-xl px-6 text-base font-semibold shadow-sm">
                <a href={EXTENSION_LINK} target="_blank" rel="noopener noreferrer">
                  <Shield className="mr-2 h-4 w-4" />
                  Try it free
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl bg-background px-6 text-base">
                <a href="https://www.youtube.com/watch?v=Jk_XtsN1N9I&utm_medium=website_hero" target="_blank" rel="noopener noreferrer">
                  See how it works
                </a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Privacy-first processing</div>
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Multi-platform support</div>
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />From $0.19 / scan</div>
            </div>

            <div className="mt-10 border-t border-border pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">Check creatives for</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Meta", "TikTok", "Google", "YouTube", "X", "Pinterest"].map((platform) => (
                  <span key={platform} className="border border-border bg-secondary/30 px-2.5 py-1 text-xs font-medium text-muted-foreground">{platform}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 bg-primary/[0.035] blur-3xl" aria-hidden="true" />
            <div className="relative border border-border bg-card shadow-2xl shadow-black/5">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2"><ScanSearch className="h-4 w-4 text-primary" /><span className="text-xs font-semibold tracking-wide">CREATIVE ANALYSIS</span></div>
                <span className="font-mono text-[10px] text-muted-foreground">DEEP SCAN / 00:31</span>
              </div>
              <div className="grid md:grid-cols-[1.15fr_.85fr]">
                <div className="relative aspect-video bg-black md:aspect-auto md:min-h-[410px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-950 to-black" />
                  <div className="absolute left-5 top-5 font-mono text-[10px] text-white/50">compliance_audit.mp4</div>
                  <div className="absolute left-[12%] right-[10%] top-[36%] border-l-2 border-primary/80 pl-3 text-white">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Detected language</p>
                    <p className="mt-1 text-xl font-semibold">Guaranteed results</p>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="mb-2 flex justify-between font-mono text-[10px] text-white/50"><span>00:00</span><span>00:12</span><span>00:31</span></div>
                    <div className="relative h-1 bg-white/15"><div className="absolute left-[39%] top-1/2 h-3 w-px -translate-y-1/2 bg-primary" /><div className="h-full w-[39%] bg-primary" /></div>
                  </div>
                </div>
                <div className="border-t border-border bg-background md:border-l md:border-t-0">
                  <div className="border-b border-border p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Policy assessment</p>
                    <div className="mt-2 flex items-end justify-between"><span className="text-2xl font-bold">Medium risk</span><span className="font-mono text-sm text-amber-500">78% confidence</span></div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                      <div><p className="text-sm font-semibold">00:12 — Soft guarantee claim</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Potential policy risk detected in the creative language. Review before publishing.</p></div>
                    </div>
                    <div className="mt-6 border-t border-border pt-4 text-xs"><div className="flex justify-between"><span className="text-muted-foreground">Platform</span><span className="font-medium">Meta Ads</span></div><div className="mt-3 flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium">Claims &amp; Misrepresentation</span></div></div>
                    <div className="mt-6 border border-primary/15 bg-primary/[0.035] p-3 text-xs leading-relaxed"><span className="font-semibold">Recommended revision:</span> Reframe the claim so the outcome is not presented as guaranteed.</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border bg-secondary/20 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground"><span>Visual + text + audio analysis</span><span className="text-primary">Analysis complete</span></div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .question-x path { stroke: hsl(var(--destructive)); stroke-width: 7; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; }
        .question-x path:first-child { animation: draw-x 700ms 900ms cubic-bezier(.65,0,.35,1) forwards; }
        .question-x path:last-child { animation: draw-x 700ms 1100ms cubic-bezier(.65,0,.35,1) forwards; }
        .question-word { display:inline-block; animation: question-out 500ms 1700ms cubic-bezier(.65,0,.35,1) forwards; }
        .know-word { display:inline-block; position:absolute; left:0; top:0; opacity:0; color:hsl(var(--primary)); animation: know-drop 850ms 1700ms cubic-bezier(.16,1,.3,1) forwards; }
        @keyframes draw-x { to { stroke-dashoffset:0; } }
        @keyframes question-out { to { opacity:.12; transform:scale(.94) translateY(2px); } }
        @keyframes know-drop { 0% { opacity:0; transform:translateY(-130%) scale(1.12); } 55% { opacity:1; transform:translateY(9%) scale(.98); } 72% { transform:translateY(-3%) scale(1.01); } 100% { opacity:1; transform:translateY(0) scale(1); } }
        @media (prefers-reduced-motion: reduce) { .question-x path,.question-word,.know-word { animation:none !important; } .question-x path { stroke-dashoffset:0; } .question-word { opacity:.12; } .know-word { opacity:1; transform:none; } }
      `}</style>
    </section>
  )
}
