"use client"
import { useState, useEffect } from "react"
import { Play, CheckCircle2 } from "lucide-react"

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
    title: "Install Extension",
    description: "Add extension to Chrome browser and authenticate your account.",
  },
  {
    step: "02",
    title: "Upload & Target",
    description: "Drag video creative in and select target platforms (Meta, TikTok, YouTube).",
  },
  {
    step: "03",
    title: "Select Scan Depth",
    description: "Choose Basic for simple assets or Deep Scan for rapid-cut creative.",
  },
  {
    step: "04",
    title: "Review Violations",
    description: "Examine risk score, timestamp markers, and suggested text replacements.",
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
    <section id="how-it-works" className="py-16 border-b border-border bg-secondary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 font-mono text-xs text-muted-foreground uppercase tracking-widest border-l-2 border-primary pl-3">
          Workflow Sequence
        </div>

        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-foreground font-[family-name:var(--font-display)]">
            Operating Procedure
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 font-mono flex flex-col justify-between gap-2">
            {steps.map((item, idx) => {
              const isActive = activeStep === idx
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 border transition-none cursor-pointer rounded-none ${
                    isActive 
                      ? "bg-card border-primary" 
                      : "bg-background border-border hover:bg-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 border ${
                      isActive ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"
                    }`}>
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold uppercase text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="lg:col-span-7">
            <div className="border border-border bg-card rounded-none h-full flex flex-col">
              <div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span>DEMO_PLAYER</span>
                <span>mediacrater_walkthrough.mp4</span>
              </div>

              <div className="relative aspect-video bg-black flex-1">
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
                    className="relative block w-full h-full cursor-pointer bg-black"
                    aria-label="Watch video demo"
                  >
                    <img
                      src={`https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`}
                      alt="Demo Thumbnail"
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="flex items-center gap-2 border border-border bg-background px-4 py-2 text-xs font-mono font-bold uppercase text-foreground hover:bg-secondary">
                        <Play className="w-3.5 h-3.5 fill-foreground text-foreground" />
                        <span>Run Demo Video</span>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 border border-border bg-background/90 px-2 py-1 text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> YouTube Stream
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
