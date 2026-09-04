import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

const EXTENSION_LINK = "https://mediacrater.com/signup"

export function CTA() {
  return (
    <section className="py-16 md:py-24 bg-primary border-t border-border font-mono">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border border-primary-foreground/20 bg-primary-foreground/5 p-8 md:p-12 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 bg-primary-foreground text-primary text-[10px] font-bold px-2 py-1 uppercase">
            TERMINAL_PROMPT
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mt-4 tracking-tight uppercase">
            &gt; Stop Guessing. Stop Waiting. Stop Appealing.
            <span className="inline-block w-3 h-5 ml-2 bg-primary-foreground animate-pulse align-middle" />
          </h2>
          
          <p className="mt-6 text-sm text-primary-foreground/80 max-w-2xl">
            // Protect your most valuable advertising assets. Join marketers who scan before they upload.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start">
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-sm px-8 py-6 rounded-none font-bold uppercase tracking-wider"
            >
              <a href={EXTENSION_LINK} target="_blank" rel="noopener noreferrer">
                <Shield className="w-4 h-4 mr-2" />
                ./try_for_free.sh
              </a>
            </Button>
          </div>

          <div className="mt-8 border-t border-primary-foreground/20 pt-4">
            <p className="text-[10px] text-primary-foreground/60 uppercase tracking-widest">
              STATUS: 3 free monthly scans included. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
