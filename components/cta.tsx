import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

const EXTENSION_LINK = "https://mediacrater.com/signup"

export function CTA() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center font-mono">
        <div className="border border-primary-foreground/30 p-8 bg-primary">
          <h2 className="text-3xl font-bold uppercase tracking-tight font-[family-name:var(--font-display)]">
            Prevent Ad Rejections. Execute Audits Pre-Launch.
          </h2>
          <p className="mt-3 text-xs text-primary-foreground/80 max-w-2xl mx-auto uppercase">
            Deploy compliance verification prior to platform upload.
          </p>

          <div className="mt-6 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-xs font-bold uppercase px-8 py-3 rounded-none h-auto"
            >
              <a href={EXTENSION_LINK} target="_blank" rel="noopener noreferrer">
                <Shield className="w-4 h-4 mr-2" />
                Initialize Free Account
              </a>
            </Button>
          </div>

          <p className="mt-4 text-[10px] text-primary-foreground/60 uppercase">
            [ 3 Free Monthly Scans Included · No Credit Card Required ]
          </p>
        </div>
      </div>
    </section>
  )
}
