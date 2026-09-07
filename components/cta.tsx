import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

const EXTENSION_LINK = "https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_footer_cta"

export function CTA() {
  return (
    <section className="border-b border-border bg-muted/20 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border border-border bg-card">
          <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Pre-publish check</p>
              <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Run the compliance check before your next launch.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                Analyze the creative. Review the findings. Make the decision before the platform makes it for you.
              </p>
            </div>

            <div>
              <Button asChild size="lg" className="h-12 rounded-md px-6">
                <a href={EXTENSION_LINK} target="_blank" rel="noopener noreferrer">
                  Start a free scan
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <p className="mt-3 text-right text-[10px] text-muted-foreground">3 free monthly scans · No credit card</p>
            </div>
          </div>

          <div className="grid border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-border">
            <div className="px-6 py-4 text-xs text-muted-foreground">01 <span className="ml-2 font-medium text-foreground">Analyze creative</span></div>
            <div className="px-6 py-4 text-xs text-muted-foreground">02 <span className="ml-2 font-medium text-foreground">Review findings</span></div>
            <div className="px-6 py-4 text-xs text-muted-foreground">03 <span className="ml-2 font-medium text-foreground">Launch with context</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
