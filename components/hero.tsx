import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, ArrowUpRight } from "lucide-react"

const EXTENSION_LINK =
  "https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_hero"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/50 pt-28 pb-20 md:pt-36 md:pb-28 bg-background">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Document Audit Structure */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-10 lg:gap-16 items-start">
          
          {/* Main Document Body with Vertical Audit Trail */}
          <div className="relative pl-6 sm:pl-10 border-l-2 border-border/60">
            {/* Audit Trail Marker */}
            <div className="absolute -left-[5px] top-4 h-2 w-2 rounded-full bg-amber-500 ring-4 ring-background" />
            
            <div className="mb-6 inline-flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Document ID: MC-001
              </span>
              <Badge
                variant="outline"
                className="rounded-none border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-amber-600 dark:text-amber-400"
              >
                Scan Complete
              </Badge>
            </div>

            <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.1] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-7xl">
              Know before <br />
              you <del className="line-through decoration-destructive decoration-[4px] opacity-70">launch.</del>{" "}
              <ins className="no-underline font-mono text-amber-500">upload</ins>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Scan your video ads for potential Meta, TikTok, and Google
              policy issues before you spend money promoting them.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-none bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <a
                  href={EXTENSION_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Try it free
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-none border-border bg-background px-6 text-base font-mono text-sm hover:text-amber-600 hover:border-amber-500/50 transition-colors"
              >
                <a
                  href="https://www.youtube.com/watch?v=Jk_XtsN1N9I&utm_medium=website_hero"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  [View Execution Log]
                </a>
              </Button>
            </div>

            <div className="mt-12 border-t border-border/60 pt-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Active Parameters
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500" />
                  Privacy-first processing
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500" />
                  Multi-platform support
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500" />
                  From $0.19 / scan
                </div>
              </div>
            </div>
          </div>

          {/* Margin Annotations Column */}
          <aside className="hidden lg:block space-y-6 pt-8 font-mono text-sm">
            <div className="border-l-2 border-amber-500/50 pl-4 py-1">
              <p className="text-amber-600 dark:text-amber-400 font-semibold mb-1">Annotation_01</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Platforms checked include Meta, TikTok, YouTube, X, and Pinterest. Adjust wording to avoid automatic rejections.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
