"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Does Mediacrater guarantee my ad will be approved?",
    answer: "No. Mediacrater provides a confidence score based on publicly accessible ad policies. Your video is still subject to each platform's proprietary detection algorithms. We help you identify and fix potential issues before uploading, significantly reducing rejection risk, but final approval is always at the platform's discretion.",
  },
  {
    question: "What happens during a scan?",
    answer: "Mediacrater analyzes your creative against the platform policies you select, then returns a risk assessment with findings such as timestamps and suggested changes where applicable.",
  },
  {
    question: "What is the difference between Basic and Deep Scan?",
    answer: "Basic Scan is intended for simpler creatives with fewer rapid cuts. Deep Scan is intended for videos where cuts are short enough that more detailed review is useful.",
  },
  {
    question: "Which platforms do you support?",
    answer: "We currently support Meta (Facebook & Instagram), TikTok, YouTube/Google Ads, Pinterest, and X (formerly Twitter). Our policy engine is continuously updated as platforms change their advertising guidelines.",
  },
  {
    question: "Is my video data secure?",
    answer: "Mediacrater uses a privacy-first architecture. Your original video files are temporarily passed to us, analysed and then immediately deleted from our memory and storage.",
  },
  {
    question: "How are scans charged?",
    answer: "One scan deducts one from your scan amount regardless of scan type or video length. You can see the exact cost before each scan, always one.",
  },
  {
    question: "Do unused tokens expire?",
    answer: "Tokens expire and renew at the end of your billing cycle, they do not carry over to the next month.",
  },
  {
    question: "Is Mediacrater affiliated with Meta, TikTok, or Google?",
    answer: "No. Mediacrater is an independent tool and is not affiliated with, endorsed by, or sponsored by any of the platforms we analyze including Meta. Platform logos are displayed solely for user experience to indicate which policies are being checked.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-2">
              Before you scan
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-display)]">
              The questions that matter before you use it.
            </h2>
            <p className="mt-3 text-muted-foreground">
              What the scan does, what it does not do, and how your files and scans are handled.
            </p>
          </div>

          <div className="lg:col-span-8">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-xl px-5 bg-card"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-4 text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
