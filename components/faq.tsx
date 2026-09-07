"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Does Mediacrater guarantee platform approval?",
    answer: "No. Mediacrater provides a confidence assessment based on publicly accessible advertising policies. Each platform has proprietary detection and enforcement systems, so final approval remains at the platform's discretion.",
  },
  {
    question: "How does a scan work?",
    answer: "One scan deducts one scan from your available amount regardless of scan type or video length. The exact scan cost is shown before you run the analysis.",
  },
  {
    question: "How is creative data handled?",
    answer: "Mediacrater uses a privacy-first architecture. Original video files are temporarily passed for analysis and are then deleted from memory and storage.",
  },
  {
    question: "Which platforms are supported?",
    answer: "Mediacrater currently supports Meta (Facebook & Instagram), TikTok, YouTube/Google Ads, Pinterest, and X. The policy engine is updated as advertising guidelines change.",
  },
  {
    question: "What is the difference between Basic and Deep Scan?",
    answer: "Basic Scan is intended for simpler product ads. Deep Scan is intended for videos with rapid edits and cuts that may require more detailed analysis.",
  },
  {
    question: "Do unused tokens expire?",
    answer: "Tokens expire and renew at the end of your billing cycle. They do not carry over to the next month.",
  },
  {
    question: "Can I get a refund?",
    answer: "Unused tokens can be refunded within 7 days of purchase. Processing fees that cannot be recovered may be deducted. Tokens already consumed by scans cannot be reaccumulated.",
  },
  {
    question: "Is Mediacrater affiliated with Meta, TikTok, Google, or other platforms?",
    answer: "No. Mediacrater is an independent tool and is not affiliated with, endorsed by, or sponsored by the advertising platforms it analyzes.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="border-b border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Documentation</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
              The details.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
              Straight answers about assessment scope, data handling, scans, and platform compatibility.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full border-t border-border">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
                <AccordionTrigger className="py-5 text-left text-sm font-semibold text-foreground hover:text-primary hover:no-underline">
                  <span className="mr-6 flex items-center gap-4">
                    <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-10 pr-6 text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
