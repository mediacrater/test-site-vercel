import { ArrowRight, ShieldCheck, X } from "lucide-react"

export function AdAccountInsurance() {
  return (
    <section className="overflow-hidden bg-foreground py-24 text-background md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-background/45">Protect your business</p>
            <h2 className="mt-5 max-w-xl font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-0.035em] sm:text-5xl">Everyone hates insurance... until something goes wrong.</h2>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-relaxed text-background/70">If you buy media, you already know the reality: large spenders can have more room for error, more account history, and more leverage when a platform makes a decision. Smaller advertisers don't always get that luxury.</p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-background/70">Mediacrater gives you another layer of protection—by identifying potential creative-level policy risks before you hand the platform a reason to scrutinize the ad.</p>
          </div>
        </div>

        <div className="mt-16 border-y border-background/15">
          <div className="grid md:grid-cols-2">
            <div className="border-b border-background/15 p-7 md:border-b-0 md:border-r md:p-10"><div className="flex items-center gap-3 text-sm font-semibold"><X className="h-4 w-4 text-red-400"/>Submit and hope</div><div className="mt-8 space-y-4 text-sm text-background/55"><div className="flex justify-between border-b border-background/10 pb-3"><span>Creative reviewed internally</span><span className="text-red-300">Not always</span></div><div className="flex justify-between border-b border-background/10 pb-3"><span>Potential policy issue identified</span><span className="text-red-300">After rejection</span></div><div className="flex justify-between"><span>Time spent appealing</span><span className="text-red-300">Unplanned</span></div></div></div>
            <div className="p-7 md:p-10"><div className="flex items-center gap-3 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-primary"/>Review before submission</div><div className="mt-8 space-y-4 text-sm text-background/55"><div className="flex justify-between border-b border-background/10 pb-3"><span>Creative analyzed</span><span className="text-primary">Before launch</span></div><div className="flex justify-between border-b border-background/10 pb-3"><span>Potential risk identified</span><span className="text-primary">With timestamp</span></div><div className="flex justify-between"><span>Revision decision</span><span className="text-primary">In your hands</span></div></div></div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-l-2 border-primary pl-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-2xl text-sm leading-relaxed text-background/55">You can't control how a platform ultimately reviews an ad. You can control what you submit to it.</p><span className="flex items-center gap-2 text-sm font-semibold">Review the creative first <ArrowRight className="h-4 w-4"/></span></div>
      </div>
    </section>
  )
}
