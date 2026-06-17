"use client"

import { Shield, Headphones, Mic, Zap, Lock, FileText, AlertTriangle, CheckCircle, ArrowRight, Notebook } from "lucide-react"
import { useState, useEffect } from "react"

// Animated Fix Recommendation Visual Component
function FixAnimationVisual() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 3)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-500 ${
          step === 0 ? "bg-destructive/20 border border-destructive/30" : "bg-muted opacity-50"
        }`}>
          <AlertTriangle className={`w-4 h-4 transition-colors duration-500 ${
            step === 0 ? "text-destructive" : "text-muted-foreground"
          }`} />
          <span className={`text-xs font-medium transition-colors duration-500 ${
            step === 0 ? "text-destructive" : "text-muted-foreground"
          }`}>Violation</span>
        </div>
        
        <ArrowRight className={`w-4 h-4 transition-all duration-500 ${
          step === 1 ? "text-primary scale-110" : "text-muted-foreground"
        }`} />
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-500 ${
          step === 2 ? "bg-accent/20 border border-accent/30" : "bg-muted opacity-50"
        }`}>
          <CheckCircle className={`w-4 h-4 transition-colors duration-500 ${
            step === 2 ? "text-accent" : "text-muted-foreground"
          }`} />
          <span className={`text-xs font-medium transition-colors duration-500 ${
            step === 2 ? "text-accent" : "text-muted-foreground"
          }`}>Compliant</span>
        </div>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className={`p-2 rounded-md transition-all duration-500 ${
          step === 0 ? "bg-destructive/10 border-l-2 border-destructive" : "opacity-30"
        }`}>
          <span className="text-destructive font-medium">"Lose 10lbs in 7 days!"</span>
        </div>
        
        <div className={`p-2 rounded-md transition-all duration-500 ${
          step === 2 ? "bg-accent/10 border-l-2 border-accent" : "opacity-30"
        }`}>
          <span className="text-accent font-medium">"Support your wellness journey"</span>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: Notebook,
    title: "Multi-Platform Policy Engine",
    description:
      "Cross-references your ad against platform-specific rulebooks for YouTube, Meta, TikTok, and more. What passes on Pinterest might be rejected on TikTok, Mediacrater knows the difference.",
  },
  {
    icon: Shield,
    title: "Visual Audit (2 Scan Depths)",
    description:
      "Choose from Basic for quicker verification with cuts lasting 1 second or more, or Deep for deeper scrutiny on high-risk verticals, which is best used for videos containing fast-paced edits that are less than 1 second long.",
  },
  {
    icon: Headphones,
    title: "Script & Audio Analysis (Coming soon)",
    description:
      "Your ad's audio will be processed and analysed for restricted keywords, prohibited claims, and misleading guarantees without sending data externally.",
  },
  {
    icon: Zap,
    title: "Instant Confidence Score",
    description:
      "Get an immediate 0-100 confidence score on ad approval likelihood. Low scores trigger specific red flags pinpointing the exact timestamp and frame of violations.",
  },
  {
    icon: Lock,
    title: "Scan-and-Forget Architecture",
    description:
      "Your creative assets are never stored on our servers. We scan your ad for policy violations and permanently delete it the moment results are returned to you.",
  },
  {
    icon: FileText,
    title: "Actionable Fix Recommendations",
    description:
      "We don't just find problems, we solve them. Get specific suggestions like 'Focus on product benefits rather than implied instant results.'",
    hasVisual: true,
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-display)] text-balance">
            Built for Professional Media Buyers
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Pre-upload intelligence that transforms your ad workflow. Stop guessing, stop waiting, stop appealing.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 font-[family-name:var(--font-display)]">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              {"hasVisual" in feature && feature.hasVisual && <FixAnimationVisual />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
