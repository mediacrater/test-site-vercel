"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, ArrowUpRight, ScanSearch } from "lucide-react"

const EXTENSION_LINK =
  "https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_hero"

export function Hero() {
  return (
    <section className="hero relative overflow-hidden border-b border-border pt-28 pb-20 md:pt-36 md:pb-28">
      {/* The animation is intentionally part of the hero's visual identity, not a loading screen. */}
      <div className="hero-kinetic pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
        <div className="hero-kinetic-word hero-kinetic-question">Question</div>
        <div className="hero-kinetic-word hero-kinetic-know">Know</div>
      </div>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-border/70" />
        <div className="absolute -right-32 top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="hero-content relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <div>
            <Badge variant="outline" className="mb-7 rounded-full border-border bg-background px-3 py-1.5 text-xs font-semibold tracking-wide">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
              Ad creative compliance
            </Badge>

            <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.94] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-[5.5rem]">
              Know before you launch.
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
        .hero-kinetic {
          --hero-header-offset: 96px;
          --hero-anchor-x: clamp(1rem, calc((100vw - 1280px) / 2 + 1rem), 5rem);
          --hero-anchor-y: clamp(7rem, 10vw, 9rem);
          isolation: isolate;
        }

        .hero-kinetic-word {
          position: absolute;
          left: 50%;
          top: 50%;
          transform-origin: center center;
          white-space: nowrap;
          font-family: var(--font-display), sans-serif;
          font-weight: 800;
          line-height: .82;
          letter-spacing: -.075em;
          will-change: left, top, transform, opacity, filter;
        }

        .hero-kinetic-question {
          font-size: clamp(5.5rem, 23vw, 25rem);
          color: hsl(var(--foreground));
          animation: question-crank 10s cubic-bezier(.76,0,.24,1) infinite;
        }

        .hero-kinetic-know {
          font-size: clamp(5.5rem, 23vw, 25rem);
          color: hsl(var(--primary));
          opacity: 0;
          animation: know-crush-and-land 10s cubic-bezier(.76,0,.24,1) infinite;
        }

        .hero-content {
          animation: hero-content-reveal 10s cubic-bezier(.22,1,.36,1) infinite;
        }

        @keyframes question-crank {
          0%, 8% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(.72) rotate(-1.5deg);
            filter: blur(10px);
          }
          12%, 22% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            filter: blur(0);
          }
          27% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.015, .97) rotate(0deg);
          }
          31% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.02, .19) translateY(36vh);
          }
          36% {
            opacity: .65;
            transform: translate(-50%, -50%) scale(.88, .055) translateY(43vh);
            filter: blur(1px);
          }
          41%, 78% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(.22, .012) translateY(46vh);
            filter: blur(8px);
          }
          84% {
            opacity: .18;
            transform: translate(-50%, -50%) scale(.38) translateY(0);
            filter: blur(5px);
          }
          90% {
            opacity: .72;
            transform: translate(-50%, -50%) scale(.78) rotate(-1deg);
            filter: blur(1px);
          }
          96%, 100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(.72) rotate(-1.5deg);
            filter: blur(10px);
          }
        }

        @keyframes know-crush-and-land {
          0%, 20% {
            opacity: 0;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) translateY(-72vh) scale(1.08);
            filter: blur(8px);
          }
          24% {
            opacity: 1;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) translateY(-66vh) scale(1.08);
            filter: blur(0);
          }
          30% {
            opacity: 1;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) translateY(0) scale(1.03, .97);
          }
          33% {
            opacity: 1;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) translateY(1.5vh) scale(1.08, .78);
          }
          37% {
            opacity: 1;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) translateY(.5vh) scale(.98, .69);
          }
          45% {
            opacity: 1;
            left: var(--hero-anchor-x);
            top: var(--hero-anchor-y);
            transform: translate(0, 0) scale(.235);
            filter: blur(0);
          }
          72% {
            opacity: 1;
            left: var(--hero-anchor-x);
            top: var(--hero-anchor-y);
            transform: translate(0, 0) scale(.235);
          }
          79% {
            opacity: 0;
            left: var(--hero-anchor-x);
            top: var(--hero-anchor-y);
            transform: translate(0, 0) scale(.235);
            filter: blur(0);
          }
          84% {
            opacity: 0;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(.4);
          }
          90% {
            opacity: .8;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(.86);
            filter: blur(0);
          }
          96%, 100% {
            opacity: 0;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(.72);
            filter: blur(10px);
          }
        }

        @keyframes hero-content-reveal {
          0%, 31% { opacity: 0; transform: translateY(14px); }
          40%, 76% { opacity: 1; transform: translateY(0); }
          82%, 100% { opacity: 0; transform: translateY(8px); }
        }

        @media (max-width: 767px) {
          .hero-kinetic {
            --hero-anchor-x: 1rem;
            --hero-anchor-y: 7.5rem;
          }

          .hero-kinetic-word {
            top: 43%;
          }

          .hero-kinetic-question,
          .hero-kinetic-know {
            font-size: clamp(4.25rem, 25vw, 9rem);
          }

          @keyframes know-crush-and-land {
            0%, 20% { opacity: 0; left: 50%; top: 43%; transform: translate(-50%, -50%) translateY(-62vh) scale(1.05); filter: blur(8px); }
            24% { opacity: 1; left: 50%; top: 43%; transform: translate(-50%, -50%) translateY(-58vh) scale(1.05); filter: blur(0); }
            30% { opacity: 1; left: 50%; top: 43%; transform: translate(-50%, -50%) scale(1.03, .97); }
            33% { opacity: 1; left: 50%; top: 43%; transform: translate(-50%, -50%) translateY(1vh) scale(1.08, .78); }
            37% { opacity: 1; left: 50%; top: 43%; transform: translate(-50%, -50%) scale(.98, .69); }
            45%, 72% { opacity: 1; left: var(--hero-anchor-x); top: var(--hero-anchor-y); transform: translate(0, 0) scale(.27); filter: blur(0); }
            79% { opacity: 0; left: var(--hero-anchor-x); top: var(--hero-anchor-y); transform: translate(0, 0) scale(.27); }
            84% { opacity: 0; left: 50%; top: 43%; transform: translate(-50%, -50%) scale(.4); }
            90% { opacity: .8; left: 50%; top: 43%; transform: translate(-50%, -50%) scale(.86); filter: blur(0); }
            96%, 100% { opacity: 0; left: 50%; top: 43%; transform: translate(-50%, -50%) scale(.72); filter: blur(10px); }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-kinetic { display: none; }
          .hero-content { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  )
}
