import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Zap } from "lucide-react"

const EXTENSION_LINK = "https://forms.gle/Di7xxvUSKebeAUDd6"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Zap className="w-4 h-4 mr-2 text-accent" />
            10 Free Tokens on Signup
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-[family-name:var(--font-display)] leading-tight text-balance">
            Video Ad
            <span className="text-primary"> Policy Checker</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-semibold text-foreground/80 font-[family-name:var(--font-display)]">
            Never Get an Ad Rejection Notification Again
          </p>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Scan your video ads for Meta, TikTok, and Google policy violations before uploading.
            Get instant AI confidence scores and actionable fixes in 60 seconds.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 py-6"
            >
              <a href={EXTENSION_LINK} target="_blank" rel="noopener noreferrer">
                <Shield className="w-5 h-5 mr-2" />
                Join the waitlist
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 border-border hover:bg-secondary bg-transparent"
            >
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Privacy-first processing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Multi-platform support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>As low as $0.85/scan</span>
            </div>
          </div>

          {/* Platform Icons */}
          <div className="mt-16">
            <p className="text-sm text-muted-foreground mb-6">Scan ads for all major platforms</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-label="Meta Facebook ad policy checker" role="img">
                  <title>Meta Facebook Platform</title>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                <span className="text-sm font-medium">Meta</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-label="TikTok ad policy checker" role="img">
                  <title>TikTok Platform</title>
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span className="text-sm font-medium">TikTok</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-label="YouTube Google ad policy checker" role="img">
                  <title>YouTube Google Ads Platform</title>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-sm font-medium">YouTube</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-label="X Twitter ad policy checker" role="img">
                  <title>X Twitter Platform</title>
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
                <span className="text-sm font-medium">X / Twitter</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-label="Pinterest ad policy checker" role="img">
                  <title>Pinterest Platform</title>
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium">Pinterest</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
