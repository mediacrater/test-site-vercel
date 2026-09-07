"use client"

import { useState, useEffect } from "react"
import { Play } from "lucide-react"

const YOUTUBE_WATCH_URL = "https://www.youtube.com/watch?v=Jk_XtsN1N9I"

function youtubeIdFromWatchUrl(url: string): string {
  try {
    return new URL(url).searchParams.get("v") ?? ""
  } catch {
    return ""
  }
}

const YOUTUBE_VIDEO_ID = youtubeIdFromWatchUrl(YOUTUBE_WATCH_URL)

const steps = [
  {
    step: "01",
    title: "Bring in the creative",
    description: "Add your video to the Mediacrater extension and choose the platforms where you intend to run it.",
  },
  {
    step: "02",
    title: "Choose the depth",
    description: "Use Basic for straightforward creatives or Deep Scan when rapid cuts make more detailed review useful.",
  },
  {
    step: "03",
    title: "Read the findings",
    description: "See the risk level, platform-specific results, and the moments in the video that deserve attention.",
  },
  {
    step: "04",
    title: "Fix it before launch",
    description: "Review the flagged section, adjust the creative, then run another scan before putting budget behind it.",
  },
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isPlaying) return

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 3500)

    return () => clearInterval(timer)
  }, [isPlaying])

  return (
    <section id="how-it-works" className="py-20 md:py-28 border-b border-border/50 bg-secondary/20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-2">
            The workflow
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-display)]">
            Four steps between your edit and your ad account.
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            The point is simple: catch things while they are still easy to change.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-3">
            {steps.map((item, idx) => {
              const isActive = activeStep === idx

              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-300 ${
                    isActive
                      ? "bg-card border-primary/50 shadow-sm ring-1 ring-inset ring-primary/20"
                      : "bg-card/50 border-border/60 hover:bg-card hover:border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-sm font-mono font-bold px-2 py-0.5 rounded transition-colors duration-300 shrink-0 ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.step}
                    </span>

                    <div>
                      <h3 className="text-base font-bold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-muted/60 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>

                <div className="text-[11px] font-mono text-muted-foreground">
                  product_walkthrough
                </div>

                <div className="w-12" />
              </div>

              <div className="relative aspect-video bg-black overflow-hidden">
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                    title="Mediacrater Product Walkthrough"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : (
                  <a
                    href={YOUTUBE_WATCH_URL}
                    onClick={(e) => {
                      e.preventDefault()
                      setIsPlaying(true)
                    }}
                    className="relative block w-full h-full cursor-pointer group overflow-hidden"
                    aria-label="Watch Mediacrater product walkthrough on YouTube"
                  >
                    <img
                      src={`https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`}
                      alt="Mediacrater Video Walkthrough Thumbnail"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                    />

                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center p-4">
                      <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-2xl group-hover:scale-105 transition-transform z-10">
                        <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
                          <Play className="w-4 h-4 fill-primary-foreground text-primary-foreground ml-0.5" />
                        </div>
                        <span className="text-sm whitespace-nowrap">Watch the product</span>
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                Step {steps[activeStep].step}
              </p>
              <p className="mt-1 text-sm text-foreground font-semibold">
                {steps[activeStep].title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {steps[activeStep].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
