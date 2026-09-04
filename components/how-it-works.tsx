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
    title: "Install Extension",
    description: "Add the Mediacrater Chrome extension in one click and verify your account.",
  },
  {
    step: "02",
    title: "Upload & Select Platforms",
    description: "Drag in your video creative and select whether you are targeting Meta, TikTok, or YouTube.",
  },
  {
    step: "03",
    title: "Configure Scan Depth",
    description: "Choose Basic for regular ads or Deep Scan for fast-paced edits with rapid cuts.",
  },
  {
    step: "04",
    title: "Get Instant Risk Breakdown",
    description: "Review detected risk zones, jump to violation timestamps, and copy suggested fixes.",
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
    <section id="how-it-works" className="py-16 md:py-24 border-b border-border bg-secondary/10 font-mono">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
            [SYS: 60_SECOND_WORKFLOW]
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight">
            How Mediacrater Works
          </h2>
          <p className="mt-3 text-xs text-muted-foreground border-l-2 border-border pl-3">
            &gt; From installation to your first policy risk report in under a minute.
          </p>
        </div>

        {/* Split Section */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Log List */}
          <div className="lg:col-span-5 space-y-0 border border-border bg-card">
            <div className="bg-muted/50 border-b border-border p-2 text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
              /scripts/onboarding_sequence.sh
            </div>
            <div className="p-4 space-y-4">
              {steps.map((item, idx) => {
                const isActive = activeStep === idx
                return (
                  <div
                    key={item.step}
                    onClick={() => setActiveStep(idx)}
                    className={`cursor-pointer border-l-2 pl-3 transition-colors duration-200 ${
                      isActive 
                        ? "border-primary bg-primary/5 py-2" 
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}>
                          [TASK_{item.step}]
                        </span>
                        <h3 className={`text-xs font-bold uppercase ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        &gt; {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: YouTube Terminal */}
          <div className="lg:col-span-7">
            <div className="border border-border bg-card shadow-none">
              {/* Window Bar */}
              <div className="px-3 py-2 bg-muted/50 border-b border-border flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  /media/walkthrough.mp4
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-muted-foreground/30" />
                  <div className="w-2 h-2 bg-muted-foreground/30" />
                  <div className="w-2 h-2 bg-muted-foreground/30" />
                </div>
              </div>

              {/* Player Container */}
              <div className="relative aspect-video bg-black overflow-hidden p-2">
                <div className="relative w-full h-full border border-white/20">
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
                      className="relative block w-full h-full cursor-pointer group"
                    >
                      <img
                        src={`https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`}
                        alt="Mediacrater Walkthrough Thumbnail"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center p-4">
                        <div className="border border-primary bg-black/80 px-4 py-2 flex items-center gap-3 group-hover:bg-primary/20 transition-colors">
                          <Play className="w-3 h-3 text-primary fill-primary" />
                          <span className="text-[10px] font-bold uppercase text-primary tracking-widest">Execute_Playback</span>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                        <div className="text-[9px] text-white/50 uppercase flex justify-between">
                          <span>Codec: YT_HD</span>
                          <span>[READY]</span>
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
