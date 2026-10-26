//components/how-it-works.tsx
"use client"

import { ArrowUpRight } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { YOUTUBE_DEMO_URL } from "@/lib/site-links"

const steps = [
  { title: "Choose your creative", text: "Upload the video or image you are preparing to run, or paste a link to it." },
  { title: "Select the platforms", text: "Tell Mediacrater where the creative is going. Policy context matters." },
  { title: "Run the analysis", text: "The creative is checked for likely policy risks against the platforms you selected." },
  { title: "Review the findings", text: "Get risk levels, timestamps, policy context and suggested revisions." },
]

export function HowItWorks() {
  const { ref, inView } = useInView<HTMLOListElement>({ threshold: 0.4 })

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-verse="1 Corinthians 10:31" className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 id="how-title" className="display-lg text-[clamp(2.1rem,4.4vw,3.4rem)]">
              From creative to clarity.
            </h2>
            <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-muted-foreground">
              A compliance review should not require a compliance department.
            </p>
          </div>
          <a
            href={YOUTUBE_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 self-start text-[1rem] font-semibold text-link underline underline-offset-4 hover:decoration-2 md:self-auto"
          >
            Watch the demo on YouTube
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <ol ref={ref} className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-8">
          {/* Track: horizontal on desktop, vertical on mobile. Fills once when it scrolls into view. */}
          <span aria-hidden="true" className="absolute left-[1.3rem] top-2 bottom-2 w-[2px] bg-border md:left-0 md:right-0 md:top-[1.3rem] md:bottom-auto md:h-[2px] md:w-auto" />
          <span
            aria-hidden="true"
            className={`absolute left-[1.3rem] top-2 bottom-2 w-[2px] origin-top bg-primary transition-transform duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] md:left-0 md:right-0 md:top-[1.3rem] md:bottom-auto md:h-[2px] md:w-auto md:origin-left ${
              inView ? "scale-x-100 scale-y-100" : "scale-y-0 md:scale-x-0 md:scale-y-100"
            }`}
          />
          {steps.map((step, i) => (
            <li key={step.title} className="relative pl-16 md:pl-0">
              <span
                className={`absolute left-0 top-0 flex h-[2.6rem] w-[2.6rem] items-center justify-center rounded-full border-2 font-display text-base font-extrabold transition-colors duration-500 md:static ${
                  inView ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"
                }`}
                style={{ transitionDelay: inView ? `${200 + i * 320}ms` : "0ms" }}
              >
                {i + 1}
              </span>
              <h3 className="text-xl font-bold md:mt-7">{step.title}</h3>
              <p className="mt-2 max-w-[34ch] text-[1rem] leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
