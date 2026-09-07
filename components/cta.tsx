import { Button } from "@/components/ui/button"
import { Shield, ArrowUpRight } from "lucide-react"

const EXTENSION_LINK = "https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_footer_cta"

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-primary">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
          Before the next launch
        </p>

        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-primary-foreground font-[family-name:var(--font-display)] text-balance">
          Give every creative one more checkpoint.
        </h2>

        <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto text-pretty">
          Scan the ad, inspect the risky parts, make your call, then publish.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8 py-6"
          >
            <a href={EXTENSION_LINK} target="_blank" rel="noopener noreferrer">
              <Shield className="w-5 h-5 mr-2" />
              Start with 3 free scans
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>

        <p className="mt-6 text-sm text-primary-foreground/60">
          No credit card required.
        </p>
      </div>
    </section>
  )
}
