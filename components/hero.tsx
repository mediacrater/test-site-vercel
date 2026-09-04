import { Shield, ArrowRight } from "lucide-react"

const EXTENSION_LINK =
  "https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_hero"

export function Hero() {
  return (
    <section className="relative border-b-2 border-foreground pt-28 pb-20 md:pt-36 md:pb-28 bg-background">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left: Dossier Information */}
          <div className="lg:col-span-7 pr-0 lg:pr-10 border-r-0 lg:border-r border-border">
            <div className="mb-8 inline-block border-2 border-foreground px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
              Subject: Pre-Launch Compliance
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-6xl font-bold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-7xl lg:text-8xl mb-8 uppercase">
              Know before <br />
              you <span className="text-primary italic">launch.</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground font-mono">
              Scan your video ads for potential Meta, TikTok, and Google policy issues before you spend money promoting them. Protect the asset.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row font-mono">
              <a
                href={EXTENSION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-between border-2 border-foreground bg-foreground px-6 text-sm font-bold uppercase tracking-wider text-background hover:bg-background hover:text-foreground transition-colors"
              >
                <span className="flex items-center">
                  <Shield className="mr-3 h-4 w-4" />
                  Initiate Scan
                </span>
                <ArrowRight className="ml-4 h-4 w-4" />
              </a>

              <a
                href="https://www.youtube.com/watch?v=Jk_XtsN1N9I&utm_medium=website_hero"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center border-2 border-border bg-background px-6 text-sm font-bold uppercase tracking-wider text-foreground hover:bg-secondary transition-colors"
              >
                Review Documentation
              </a>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <div>
                <span className="block text-foreground mb-1">Status</span>
                Privacy-first processing
              </div>
              <div>
                <span className="block text-foreground mb-1">Coverage</span>
                Multi-platform support
              </div>
              <div>
                <span className="block text-foreground mb-1">Fee Schedule</span>
                From $0.19 / scan
              </div>
            </div>
          </div>

          {/* Right: UI Terminal */}
          <div className="lg:col-span-5 relative mt-10 lg:mt-0">
            <div className="border-2 border-border bg-card h-full min-h-[400px] flex flex-col">
              {/* Terminal Header */}
              <div className="border-b-2 border-border bg-muted/50 px-4 py-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground font-bold">Terminal // Scan_01</span>
                <span className="font-mono text-[10px] text-muted-foreground">mediacrater.com/scan</span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col gap-6">
                <div className="relative aspect-video border border-border bg-black w-full flex items-center justify-center">
                  <div className="font-mono text-[10px] text-white/50">compliance_audit.mp4</div>
                  <div className="absolute bottom-4 left-4">
                    <div className="h-1 w-32 bg-white/20">
                      <div className="h-full w-[39%] bg-primary" />
                    </div>
                    <p className="mt-2 font-mono text-[10px] text-white/50">00:12 / 00:31</p>
                  </div>
                </div>

                <div className="border border-border bg-background p-4 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Assessment</p>
                    <p className="font-mono text-[10px] font-bold text-amber-500">78% CONFIDENCE</p>
                  </div>
                  
                  <p className="text-xl font-bold font-[family-name:var(--font-display)] text-foreground uppercase">Medium Risk</p>
                  
                  <div className="mt-4 border-l-2 border-amber-500 pl-4 py-1">
                    <p className="font-mono text-xs font-bold text-foreground">Timestamp 0:12</p>
                    <p className="font-mono text-[10px] text-muted-foreground mt-1">Soft guarantee claim detected. Review phrasing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
