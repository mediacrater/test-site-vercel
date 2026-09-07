"use client"

import { useState, useEffect } from "react"
import { ArrowRight, CheckCircle2, Play } from "lucide-react"

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
  ["01", "Upload creative", "Add the video asset you intend to advertise."],
  ["02", "Select policy frameworks", "Choose the platforms relevant to the campaign."],
  ["03", "Run compliance analysis", "Mediacrater evaluates the creative against the selected frameworks."],
  ["04", "Review findings", "Inspect risk, timestamps, and suggested revisions before launch."],
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isPlaying) return
    const timer = setInterval(() => setActiveStep((value) => (value + 1) % steps.length), 3500)
    return () => clearInterval(timer)
  }, [isPlaying])

  return (
    <section id="how-it-works" className="border-b border-border bg-muted/20 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-10 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Workflow</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
              From asset to compliance report.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            The workflow is intentionally simple: submit the creative, define the policy scope, then work from the findings.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            {steps.map(([number, title, description], index) => {
              const active = activeStep === index
              return (
                <button
                  key={number}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`grid w-full grid-cols-[48px_1fr_auto] gap-4 border-t px-0 py-5 text-left transition-colors ${
                    active ? "border-primary" : "border-border"
                  }`}
                >
                  <span className={`font-mono text-xs font-bold ${active ? "text-primary" : "text-muted-foreground"}`}>
                    {number}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-foreground">{title}</span>
                    <span className="mt-1 block max-w-md text-xs leading-5 text-muted-foreground">{description}</span>
                  </span>
                  <ArrowRight className={`mt-0.5 h-4 w-4 transition-opacity ${active ? "opacity-100 text-primary" : "opacity-20"}`} />
                </button>
              )
            })}
          </div>

          <div className="border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Product walkthrough</span>
              <span className="text-[10px] text-muted-foreground">3:12</span>
            </div>
            <div className="relative aspect-video bg-black">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                  title="Mediacrater Product Walkthrough"
                  className="h-full w-full border-0"
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
                  className="group relative block h-full w-full"
                  aria-label="Watch Mediacrater product walkthrough on YouTube"
                >
                  <img
                    src={`https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`}
                    alt="Mediacrater Product Walkthrough Thumbnail"
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-3 border border-white/30 bg-black/70 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm">
                      <Play className="h-4 w-4 fill-white" />
                      Watch walkthrough
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] text-white/60">
                    <CheckCircle2 className="h-3 w-3" /> Product demonstration
                  </div>
                </a>
              )}
            </div>
            <div className="grid grid-cols-4 divide-x border-t border-border">
              {steps.map(([number, title], index) => (
                <button key={number} type="button" onClick={() => setActiveStep(index)} className={`p-3 text-left ${activeStep === index ? "bg-primary/5" : ""}`}>
                  <p className="font-mono text-[9px] text-muted-foreground">{number}</p>
                  <p className="mt-1 text-[10px] font-semibold leading-4">{title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
